const spawn = require('child_process').spawn

const process = spawn('python',['./test.py',1,2])

process.stdout.on('data',(data)=>{
    console.log(data.toString());
})