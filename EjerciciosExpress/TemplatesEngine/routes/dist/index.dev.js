'use strict';

var express = require('express'),
    router = express.Router();

function jade(req, res, next) {
  var locals = {
    title: 'Jade',
    link: 'http://jade-lang.com/',
    description: 'Jade es un sistema de plantillas inspirado en JavaScript y en Haml para utilizarse en Node.js'
  };
  res.render('index', locals);
}

router.get('/', function (req, res) {
  res.end('Terminamos la configuracion de nuestra primera APP en Express');
}).get('/jade', jade);
module.exports = router;