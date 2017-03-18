const https = require('https');

const config = require('./config');

module.exports = (method) => {

  const postOptions = {
    host: 'maker.ifttt.com',
      path: `/trigger/${method}/with/key/${config.key}`,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
  };

  return post;

  function post(val1, val2, val3) {
    let postReq = https.request(postOptions, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    postReq.write(JSON.stringify({value1: val1, value2: val2, value3: val3}));
    postReq.end();
  }
}
