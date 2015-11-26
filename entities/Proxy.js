var jsonfile = require('jsonfile');

function createId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

function ProxyEntity() {
  this.proxies = jsonfile.readFileSync('./data/proxies.json');
}

ProxyEntity.prototype.updateJson = function() {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile('./data/proxies.json', this.proxies, { spaces: 2 }, err => {
      (err === null) ? resolve() : reject(err);
    });
  })
}

ProxyEntity.prototype.all = function() {
  return this.proxies;
}

ProxyEntity.prototype.find = function(id) {
  var data = this.proxies.filter(proxy => proxy.id === id);

  return (data.length === 0) ? null : data[0];
}

ProxyEntity.prototype.create = function(data) {
  return new Promise((resolve, reject) => {
    var taken = this.proxies.filter(proxy => {
      return (proxy.listen.host === data.listen.host);
    });

    if (taken.length !== 0) {
      reject('listening host & port was exist');
    } else {
      this.proxies.push(Object.assign({}, data, { id: createId() }));
      this.updateJson().then(() => resolve()).catch(err => reject(err));
    }
  });
}

ProxyEntity.prototype.update = function(id, data) {
  return new Promise((resolve, reject) => {
    var proxy = this.proxies.filter(proxy => proxy.id === id);

    if (proxy.length === 0) {
      reject('specify proxy dose not exist');
    } else {
      this.proxies = this.proxies.map(proxy => {
        return (proxy.id == id)
          ? Object.assign({}, data, { id })
          : proxy;
      });

      this.updateJson().then(() => resolve()).catch(err => reject(err));
    }
  });
}

ProxyEntity.prototype.delete = function(id) {
  return new Promise((resolve, reject) => {
    var proxy = this.proxies.filter(proxy => proxy.id === id);

    if (proxy.length === 0) {
      reject('specify proxy dose not exist');
    } else {
      this.proxies = this.proxies.filter(proxy => proxy.id !== id);
      this.updateJson().then(() => resolve()).catch(err => reject(err));
    }
  });
}

module.exports = new ProxyEntity();
