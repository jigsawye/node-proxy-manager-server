var http = require('http');
var httpProxy = require('http-proxy');
var proxies = require('./data/proxies');

proxies.forEach(proxy => {
  http.createServer((req, res) => {
    httpProxy.createServer().web(req, res, {target: proxy.target });
  }).listen(proxy.listen.port, proxy.listen.host, () => {
    console.log(`Proxy ${proxy.listen.host}:${proxy.listen.port} => ${proxy.target.host}:${proxy.target.port}`)
  });
});
