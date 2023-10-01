const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const end = Math.floor(Date.now() / 1000);
const start = end - 31536000;
const urlEnd = `-historical-data?end_date=${end}&st_date=${start}`;

const stockName = {
    ASPN: 'https://in.investing.com/equities/asian-paints'+urlEnd,
    AXBK: 'https://in.investing.com/equities/axis-bank'+urlEnd,
    BJFN: 'https://in.investing.com/equities/bajaj-finance?'+urlEnd,
    BJFS: 'https://in.investing.com/equities/bajaj-finserv-limited'+urlEnd,
    BRTI: 'https://in.investing.com/equities/bharti-airtel'+urlEnd,
    REDY: 'https://in.investing.com/equities/dr-reddys-laboratories'+urlEnd,
    HCLT: 'https://in.investing.com/equities/hcl-technologies'+urlEnd,
    HDBK: 'https://in.investing.com/equities/hdfc-bank-ltd'+urlEnd,
    HLL: 'https://in.investing.com/equities/hindustan-unilever'+urlEnd,
    ICBK: 'https://in.investing.com/equities/icici-bank-ltd'+urlEnd,
    INBK: 'https://in.investing.com/equities/indusind-bank'+urlEnd,
    INFY: 'https://in.investing.com/equities/infosys'+urlEnd,
    ITC: 'https://in.investing.com/equities/itc'+urlEnd,
    KTKM: 'https://in.investing.com/equities/kotak-mahindra-bank'+urlEnd,
    LART: 'https://in.investing.com/equities/larsen---toubro'+urlEnd,
    MAHM: 'https://in.investing.com/equities/mahindra---mahindra'+urlEnd,
    MRTI: 'https://in.investing.com/equities/maruti-suzuki-india'+urlEnd,
    NTPC: 'https://in.investing.com/equities/ntpc'+urlEnd,
    PGRD: 'https://in.investing.com/equities/power-grid-corp.-of-india'+urlEnd,
    RELI: 'https://in.investing.com/equities/reliance-industries'+urlEnd,
    SBI: 'https://in.investing.com/equities/state-bank-of-india'+urlEnd,
    SUN: 'https://in.investing.com/equities/sun-pharma-advanced-research'+urlEnd,
    TCS: 'https://in.investing.com/equities/tata-consultancy-services'+urlEnd,
    TISC: 'https://in.investing.com/equities/tata-steel'+urlEnd,
    TEML: 'https://in.investing.com/equities/tech-mahindra'+urlEnd,
    TITN: 'https://in.investing.com/equities/titan-industries'+urlEnd,
    ULTC: 'https://in.investing.com/equities/ultratech-cement'+urlEnd,
    WIPR: 'https://in.investing.com/equities/wipro-ltd'+urlEnd,
    NEST: 'https://in.investing.com/equities/nestle'+urlEnd,
    LTIM: 'https://in.investing.com/equities/larsen-toubro-infotech-ltd'+urlEnd,
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
    MLDc1: 'https://in.investing.com/commodities/lead'+urlEnd,
    MLMNc1: 'https://in.investing.com/commodities/lead-mini'+urlEnd,
    MNKc1: 'https://in.investing.com/commodities/nickel'+urlEnd,
    MNKEQ9: 'https://in.investing.com/commodities/nickel-mini'+urlEnd,
    MSVc1: 'https://in.investing.com/commodities/silver'+urlEnd,
    MSMRc1: 'https://in.investing.com/commodities/silver-micro'+urlEnd,
    MSDc1: 'https://in.investing.com/commodities/silver-mini'+urlEnd,
    MZIc1: 'https://in.investing.com/commodities/zinc-futures'+urlEnd,
    MZCMc1: 'https://in.investing.com/commodities/zinc-mini'+urlEnd,
    MOMV1: 'https://in.investing.com/commodities/cardamom'+urlEnd,
    MCOTc1: 'https://in.investing.com/commodities/cotton'+urlEnd,
    MCAc1: 'https://in.investing.com/commodities/crude-palm-oil'+urlEnd,
    MCTc1: 'https://in.investing.com/commodities/kapas'+urlEnd,
    MMOc1: 'https://in.investing.com/commodities/mentha-oil'+urlEnd,
    MCSc1: 'https://in.investing.com/commodities/castor-seed'+urlEnd,
};

async function getHTML(url) {
    const { data: html } = await axios.get(url);
    return html;
}

function cleanField(fieldValue) {
    // Remove extra characters (D, E) and newline characters from the field value
    return fieldValue.replace(/[DE\n]/g, '').trim();
}

async function scrapeData(urls) {
    const formattedData = [];

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
            tempData.push(temp);
        });
        const list = tempData.map((item)=>{
            return Number(item.price.split(',').join(''))
        })
        formattedData.push({ [symbol]: list });
    }

    return formattedData;
}

(async () => {
    const stockFormattedData = await scrapeData(stockName);
    const commodityFormattedData = await scrapeData(comName);

    const stockData = Object.assign({}, ...stockFormattedData);
    const commodityData = Object.assign({}, ...commodityFormattedData);

    const stockJSON = JSON.stringify(stockData, null, 2); // Indentation level of 2
    const commodityJSON = JSON.stringify(commodityData, null, 2);

    fs.writeFile(`./data.json`, stockJSON, (err) => {
        if (err) console.log(err);
        console.log('Stock data saved successfully.');
    });

    fs.writeFile(`./datacom.json`, commodityJSON, (err) => {
        if (err) console.log(err);
        console.log('Commodity data saved successfully.');
    });
})();
