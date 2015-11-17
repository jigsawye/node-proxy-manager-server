var express = require('express');
var router = express.Router();

var proxies = require('../data/proxies');
var startOrRestartProxyServer = require('../utils/run-proxy');
var updateJson = require('../utils/updateJson');

router.get('/', (req, res, next) => {
  res.json(proxies);
});

router.get('/:host', (req, res, next) => {
  var host = req.params.host;
  var data = proxies.filter(proxy => proxy.listen.host === host);

  res.json(data);
});

router.post('/', (req, res, next) => {
  var host = req.body.listen.host;
  taken = proxies.filter(proxy => proxy.listen.host === host);

  if (taken.length !== 0) {
    res.json({ 'error': 'host already taken' });
  } else {
    proxies.push(req.body);

    updateJson(proxies)
      .then(() => {
        startOrRestartProxyServer();
        res.json({ 'message': 'create proxy success'})
      })
      .catch(err => res.json({ 'error': 'create proxy fail'}));
  }
});

router.put('/:host', (req, res, next) => {
  var host = req.params.host;
  taken = proxies.filter(proxy => proxy.listen.host === host);

  if (taken.length === 0) {
    res.json({ 'error': 'host dose not exist' });
  } else {
    var newProxies = proxies.map(proxy => {
      return (proxy.listen.host == host) ? req.body : proxy;
    });

    updateJson(newProxies)
      .then(() => {
        startOrRestartProxyServer();
        res.json({ 'message': 'update proxy success'})
      })
      .catch(err => res.json({ 'error': 'update proxy fail'}));
  }
});

router.delete('/:host', (req, res, next) => {
  var host = req.params.host;
  taken = proxies.filter(proxy => proxy.listen.host === host);

  if (taken.length === 0) {
    res.json({ 'error': 'host dose not exist' });
  } else {
    var newProxies = proxies.filter(proxy => proxy.listen.host !== host);

    updateJson(newProxies)
      .then(() => {
        startOrRestartProxyServer();
        res.json({ 'message': 'delete proxy success'});
      })
      .catch(err => res.json({ 'error': 'delete proxy fail'}));
  }
});

module.exports = router;
