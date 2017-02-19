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

  function post(data) {
    let postReq = https.request(postOptions, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    postReq.write(JSON.stringify(data));
    postReq.end();
  }
}
