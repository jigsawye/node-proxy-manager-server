var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var router = express.Router();

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if ((username == config.username) && (password == config.password)) {
    var token = jwt.sign({
      username: username,
      password: password,
    }, config.key);

    res.json({
      token: token,
    });
  } else {
    res.status(500).json({
      error: 'username or password is not match',
    });
  }
});

module.exports = router;
