const fs = require('fs')
let obj = {}
let list 
fs.readFile('./data.json','utf-8',(err,data)=>{
    obj = JSON.parse(data)
    list = obj.map((item)=>{
        return Number(item.price.split(',').join(''))
    })
    fs.writeFile('./list.json',JSON.stringify(list),(err)=>{console.log(err)})
})