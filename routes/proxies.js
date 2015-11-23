var express = require('express');
var router = express.Router();

var startOrRestartProxyServer = require('../utils/run-proxy');
var Proxy = require('../entities/Proxy');

router.get('/', (req, res, next) => {
  var proxies = Proxy.all();

  res.json(proxies)
});

router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  var proxy = Proxy.find(id);

  if (proxy) {
    res.json(proxy);
  } else {
    res.status(500).json({ 'error': 'proxy is not exist' });
  }
});

router.post('/', (req, res, next) => {
  var data = req.body;

  Proxy.create(data)
    .then(proxy => {
      startOrRestartProxyServer();
      res.json({ 'message': 'create proxy success'});
    })
    .catch(err => res.status(500).json({ 'error': err }));
});

router.put('/:id', (req, res, next) => {
  var id = req.params.id;
  var data = req.body;

  Proxy.update(id, data)
    .then(() => {
      startOrRestartProxyServer();
      res.json({ 'message': 'json.update proxy success'});
    })
    .catch(err => res.status(500).json({ 'error': err }));
});

router.delete('/:id', (req, res, next) => {
  var id = req.params.id;

  Proxy.delete(id)
    .then(() => {
      startOrRestartProxyServer();
      res.json({ 'message': 'delete proxy success'});
    })
    .catch(err => res.status(500).json({ 'error': err }));
});

module.exports = router;
