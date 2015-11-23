var express = require('express');
var router = express.Router();

var proxies = require('../data/proxies');
var startOrRestartProxyServer = require('../utils/run-proxy');
var updateJson = require('../utils/updateJson');

function createId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

router.get('/', (req, res, next) => {
  res.json(proxies);
});

router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  var data = proxies.filter(proxy => proxy.id === id);

  if (data.length === 0) {
    res.status(500).json({ 'error': 'proxy is not exist' });
  } else {
    res.json(data[0]);
  }
});

router.post('/', (req, res, next) => {
  var host = req.body.listen.host;
  taken = proxies.filter(proxy => proxy.listen.host === host);

  if (taken.length !== 0) {
    res.status(500).json({ 'error': 'host already taken' });
  } else {
    proxies.push(Object.assign({}, req.body, { id: createId() }));

    updateJson(proxies)
      .then(() => {
        startOrRestartProxyServer();
        res.json({ 'message': 'create proxy success'})
      })
      .catch(err => res.status(500).json({ 'error': 'create proxy fail'}));
  }
});

router.put('/:id', (req, res, next) => {
  var id = req.params.id;
  taken = proxies.filter(proxy => proxy.id === id);

  if (taken.length === 0) {
    res.status(500).json({ 'error': 'id dose not exist' });
  } else {
    var newProxies = proxies.map(proxy => {
      return (proxy.id == id)
        ? Object.assign({}, req.body, { id })
        : proxy;
    });

    updateJson(newProxies)
      .then(() => {
        startOrRestartProxyServer();
        res.json({ 'message': 'update proxy success'})
      })
      .catch(err => res.status(500).json({ 'error': 'update proxy fail'}));
  }
});

router.delete('/:id', (req, res, next) => {
  var id = req.params.id;
  taken = proxies.filter(proxy => proxy.id === id);

  if (taken.length !== 0) {
    res.status(500).json({ 'error': 'id dose not exist' });
  } else {
    var newProxies = proxies.filter(proxy => proxy.id !== id);

    updateJson(newProxies)
      .then(() => {
        startOrRestartProxyServer();
        res.json({ 'message': 'delete proxy success'});
      })
      .catch(err => res.status(500).json({ 'error': 'delete proxy fail'}));
  }
});

module.exports = router;
