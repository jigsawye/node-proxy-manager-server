var jsonfile = require('jsonfile')

module.exports = function updateJson(newProxies) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile('./data/proxies.json', newProxies, { spaces: 2 }, err => {
      (err === null) ? resolve() : reject(err);
    });
  });
};