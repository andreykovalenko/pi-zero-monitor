const speedTestNet = require('speedtest-net');
const config = require('./config')
const test = speedTestNet({maxTime: config.speedTestTime});
const iftt = require('./iftt-request');
const speedTestMonitor = iftt('speed-tested');
const notifier = require('./ios-notifier');
const slowInternetNotifier = notifier('slow-internet');
const errorNotifier = notifier('failed-to-test-internet');

test.on('data', data => {
  speedTestMonitor(data.speeds.download, data.speeds.upload, data.server.ping);

  if (checkSpeedTestResults(data)) {
    slowInternetNotifier.send(data.speeds.download + 'Mb/s', data.speeds.upload + 'Mb/s');
  }
});

test.on('error', errorNotifier.send);

function checkSpeedTestResults(data) {
  const speedConfig = config.notifications;
  return data.speeds.download < speedConfig.download ||
    data.speeds.upload < speedConfig.upload
}


