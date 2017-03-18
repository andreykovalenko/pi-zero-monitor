const config = require('./config');
const pingConfig = config.ping;
const notificationsConfig = config.notifications;
const recordPingResults = require('./iftt-request')('ping-tested');
const ping = require('./ping-hosts');
const iosNotifier = require('./ios-notifier');
const failedToPingNotifier = iosNotifier('failed-to-ping');

const pingNotifiers = [
  {
    predicate: (ping) =>
      ping.host === pingConfig.localHost && ping.time > notificationsConfig.localPing ||
      ping.time > notificationsConfig.ping,
    send: iosNotifier('slow-ping').send,
  },
  {
    predicate: (ping) => !ping.alive,
    send: iosNotifier('dead-ping').send
  }
];

ping(pingConfig.hosts, pingConfig.tries)
  .then((results)=>{
    results.forEach((ping) => {
      recordPingResults(ping.host, ping.alive, ping.time);

      checkPingResultsAndNotify(ping);
      // console.log('--------->', 'ping.alive', ping.host, ping.alive, ping.time);
    });
  })
  .catch(failedToPingNotifier.send);

function checkPingResultsAndNotify(pingResults) {
  pingNotifiers.forEach((notifier) => {
    if(notifier.predicate(pingResults)) {
      notifier.send(pingResults.host, pingResults.time + ' ms');
    }
  });
}

