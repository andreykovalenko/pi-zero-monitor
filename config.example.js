module.exports = {
  key: '{{iftt private key placeholder}}',
  ping:{
    hosts: ['{{local ip}}', '{{public ip}}'],
    tries: 100,
    localHost: '{{local ip}}',
  },
  speedTestTime: 5000, //ms
  notifications: {
    upload: 10, // Mb/s
    download: 30, // Mb/s
    ping: 20, //ms
    localPing: 5, //ms
  }
};