const ping = require('ping');
const Q = require('q');
const config = require('./config');

const hosts = config.pingHosts;
const iftt = require('./iftt-request')('ping-tested');

var cfg = {
    timeout: 10,
    // WARNING: -i 2 may not work in other platform like window
    extra: ["-i 2"],
};

var pinging = range(0, config.pingTries)
  .reduce((promise) => {
  return promise.then(allPingResults => {

    return pingHosts().then(pingResults => {
      return allPingResults.concat(pingResults);
    });
  });
}, Q.when([]));

pinging
  .then(groupByHost)
  .then(getVals)
  // .then(console.log)
  .then((results)=>{
    results.forEach((ping) => {
      const postData = {value1: ping.host, value2: ping.alive, value3: ping.time};
      iftt(postData);
    });
  })
  .catch(console.error);

function getVals(obj) {
  return Object.keys(obj).map((key)=>{
    return obj[key];
  });
}

function groupByHost(arr) {
  return arr.reduce((group, pingResult) => {
    group[pingResult.host] = !group[pingResult.host] ?
      pingResult :
      mergeResults(group[pingResult.host], pingResult);
    return group;
  }, {});
}
function mergeResults(res1, res2) {
  var isAlive = res1.alive && res2.alive;
  var time = !isAlive ?
    999.99 :
    Math.round((res1.time + res2.time)/2*100)/100;

  return {
    host: res1.host,
    alive: isAlive,
    time: time
  };
}

function pingHosts() {
  let aliveHosts = hosts.map(host => {
    return ping.promise.probe(host, cfg)
      .then(response => {
        return {host: response.host, alive:response.alive, time: response.time};
      });
    });

  return Q.all(aliveHosts);
}

function range(i, n) {
  var result = [];
  while (i < n) {
    result.push(i);
    i+=1;
  }
  return result;
}

