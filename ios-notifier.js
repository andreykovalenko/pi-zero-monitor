const iftt = require('./iftt-request');
const notifier = iftt('ios-notification');

module.exports = configure;

function configure(name) {
  return {
    send: (item1, item2) => notifier(name, item1, item2)
  };
}

// configure('opop').send('10', '20')