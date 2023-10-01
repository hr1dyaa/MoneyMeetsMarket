const express= require("express");
const serverone = express();
const PORT= process.env.PORT|| 5000;
const cors = require("cors");
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const spawn = require('child_process').spawn;

const end = Math.floor(Date.now() / 1000);
const start = end - 2678400;
const urlEnd = `-historical-data?end_date=${end}&st_date=${start}`;

async function getHTML(url) {
    const { data: html } = await axios.get(url);
    return html;
}
let response={}
let temp={}

function cleanField(fieldValue) {
    // Remove extra characters (D, E) and newline characters from the field value
    return fieldValue.replace(/[DE\n]/g, '').trim();
}


const stockName = {
    ASPN: 'https://in.investing.com/equities/asian-paints'+urlEnd,
    AXBK: 'https://in.investing.com/equities/axis-bank'+urlEnd,
    BJFN: 'https://in.investing.com/equities/bajaj-finance'+urlEnd,
    BJFS: 'https://in.investing.com/equities/bajaj-finserv-limited'+urlEnd,
    BRTI: 'https://in.investing.com/equities/bharti-airtel'+urlEnd,
    REDY: 'https://in.investing.com/equities/dr-reddys-laboratories'+urlEnd,
    HCLT: 'https://in.investing.com/equities/hcl-technologies'+urlEnd,
    HDBK: 'https://in.investing.com/equities/hdfc-bank-ltd'+urlEnd,
    HLL: 'https://in.investing.com/equities/hindustan-unilever'+urlEnd,
    ICBK: 'https://in.investing.com/equities/icici-bank-ltd'+urlEnd,
};

const comName = {
    MCGbc1: 'https://in.investing.com/commodities/crude-oil'+urlEnd,
    MNGc1: 'https://in.investing.com/commodities/natural-gas'+urlEnd,
    MALGc1: 'https://in.investing.com/commodities/aluminium-mini'+urlEnd,
    MANc1: 'https://in.investing.com/commodities/aluminum'+urlEnd,
    MCCc1: 'https://in.investing.com/commodities/copper'+urlEnd,
    MCPMM9: 'https://in.investing.com/commodities/copper-mini'+urlEnd,
    MAUc1: 'https://in.investing.com/commodities/refined-gold'+urlEnd,
    MAXc1: 'https://in.investing.com/commodities/gold-guinea'+urlEnd,
    MMIc1: 'https://in.investing.com/commodities/gold-mini'+urlEnd,
    MGPLc1: 'https://in.investing.com/commodities/gold-petal'+urlEnd,
};

serverone.use(cors());
serverone.get("/", async (req, res) =>{
    const invest = req.query.invest;
    console.log('Investment:', invest);
    const risk = req.query.risk;
    console.log('Risk level:', risk);
    const type = req.query.type;
    console.log('Type of investment:', type);
    let data
    if (type === 'Shares'){
        data = await scrapeData(stockName)
    }
    else if (type === 'Commodities') {
        data = await scrapeData(comName)
        res.json({})
    }
    else {
        res.json({})
    }
    let resu =""
        const process =  spawn('python', ['./arima2.py']);
        process.stdout.on('data', data => {
            resu=data.toString()
            res.json({result: resu})
        });
    fs.writeFile('data.json',JSON.stringify(data),(err)=> {console.log(err)})

    
});

const begin = async() => {
    try{
        serverone.listen(PORT, () => {
        console.log(`${PORT} Connected.`);
        });
    }catch(error){
        console.log(error);
    }
}

begin()

async function scrapeData(urls) {
    let formattedData = {};

    for (const [symbol, url] of Object.entries(urls)) {
        const res = await getHTML(url);
        const $ = cheerio.load(res);
        const tempData = [];
        $('body>div>div>section>div>section>section>div>div>table>tbody>tr').each((i, element) => {
            const elements = $(element);
            const temp = {
                date: cleanField(elements.children('td:nth-of-type(1)').text()),
                open: cleanField(elements.children('td:nth-of-type(3)').text()),
                price: cleanField(elements.children('td:nth-of-type(2)').text()),
                high: cleanField(elements.children('td:nth-of-type(4)').text()),
                low: cleanField(elements.children('td:nth-of-type(5)').text()),
                volume: cleanField(elements.children('td:nth-of-type(6)').text()),
                change: cleanField(elements.children('td:nth-of-type(7)').text()),
            };
            tempData.unshift(temp);
        });
        const list = tempData.map((item)=>{
            return Number(item.price.split(',').join(''))
        })
        formattedData[symbol]= list ;
    }

    return formattedData;
}
