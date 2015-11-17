var request = require('supertest');
var app = require('../app');
var expect = require('chai').expect;

describe('Auth', function() {
  describe('Api spec', function() {
    it('should return token when username and password is valid', function(done) {
      request(app)
        .post('/auth/login')
        .send({ username: 'imacwebteam', password: 'h.m.chen' })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body.token).to.be.a('string');
          expect(res.body.token.split('.')).to.have.length(3);
          done();
        });
    });

    it('should return 500 when username and password is not valud', function(done) {
      request(app)
        .post('/auth/login')
        .send({ username: 'username', password: 'password' })
        .end(function(err, res) {
          expect(res.status).to.equal(500);
          done();
        });
    });
  });
});
