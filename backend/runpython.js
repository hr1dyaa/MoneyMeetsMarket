const spawn = require('child_process').spawn;
const process =  spawn('python', ['./arima2.py']);
process.stdout.on('data', data => {
    console.log(data.toString());
});