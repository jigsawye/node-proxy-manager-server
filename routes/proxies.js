var express = require('express');
var router = express.Router();
var proxies = require('../data/proxies');
var jsonfile = require('jsonfile')

function updateJson(newProxies) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile('./data/proxies.json', newProxies, { spaces: 2 }, err => {
      (err === null) ? resolve() : reject(err);
    });
  });
}

router.get('/', (req, res, next) => {
  res.send(proxies);
});

router.get('/:domain', (req, res, next) => {
  var domain = req.params.domain;
  var data = proxies.filter(proxy => proxy.listen.domain === domain);

  res.json(data);
});

router.post('/', (req, res, next) => {
  var domain = req.body.listen.domain;
  taken = proxies.filter(proxy => proxy.listen.domain === domain);

  if (taken.length !== 0) {
    res.json({ 'error': 'domain already taken' });
  } else {
    proxies.push(req.body);

    updateJson(proxies)
      .then(() => res.json({ 'message': 'create proxy success'}))
      .catch(err => res.json({ 'error': 'create proxy fail'}));
  }
});

router.put('/:domain', (req, res, next) => {
  var domain = req.params.domain;
  taken = proxies.filter(proxy => proxy.listen.domain === domain);

  if (taken.length === 0) {
    res.json({ 'error': 'domain dose not exist' });
  } else {
    var newProxies = proxies.map(proxy => {
      return (proxy.listen.domain == domain) ? req.body : proxy;
    });

    updateJson(newProxies)
      .then(() => res.json({ 'message': 'update proxy success'}))
      .catch(err => res.json({ 'error': 'update proxy fail'}));
  }
});

router.delete('/:domain', (req, res, next) => {
  var domain = req.params.domain;
  taken = proxies.filter(proxy => proxy.listen.domain === domain);

  if (taken.length === 0) {
    res.json({ 'error': 'domain dose not exist' });
  } else {
    var newProxies = proxies.filter(proxy => proxy.listen.domain !== domain);

    updateJson(newProxies)
      .then(() => res.json({ 'message': 'delete proxy success'}))
      .catch(err => res.json({ 'error': 'delete proxy fail'}));
  }
});

module.exports = router;
