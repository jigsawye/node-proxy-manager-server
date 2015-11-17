var pm2 = require('pm2');

module.exports = function startOrRestartProxyServer() {
  return pm2.connect(() => {
    pm2.start({
      name: 'proxy-server',
      script: 'proxy.js',
    }, (err, apps) => {
      pm2.disconnect();
    });
  });
};
