const ping = require('ping');
const Q = require('q');

var cfg = {
    timeout: 10,
    // WARNING: -i 2 may not work in other platform like window
    extra: ["-i 2"],
};

module.exports = (hosts, nTimes) => {
  return pingTimes(hosts, nTimes)
  .then(groupByHost)
  .then(getVals)
  .catch(console.error);
};


function pingTimes(hosts, nTimes) {
  return range(0, nTimes)
    .reduce(promise => {
      return promise.then(allResults => {
          return pingHosts(hosts).then(pingResults => {
              return allResults.concat(pingResults);
            });
        });
  }, Q.when([]));
}

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

function pingHosts(hosts) {
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

