var http = require('http');
var httpProxy = require('http-proxy');
var connect = require('connect');
var vhost = require('vhost');
var proxies = require('./data/proxies');
var config = require('./config');

var app = connect();

proxies.forEach(proxy => {
  app.use(vhost(proxy.listen.host, (req, res) => {
    httpProxy.createServer().web(req, res, {
      target: proxy.target
    });
  }));
});

app.listen(config.port);
