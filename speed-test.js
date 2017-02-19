const speedTestNet = require('speedtest-net');
const config = require('./config')
const test = speedTestNet({maxTime: config.speedTestTime});
const iftt = require('./iftt-request')('speed-tested');

test.on('data', data => {
  const postData = {value1: data.speeds.download, value2: data.speeds.upload, value3: data.server.ping};
  iftt(postData);
  console.log(postData);
});
console.log
test.on('error', err => {
  console.error(err);
});

