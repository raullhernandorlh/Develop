'use strict'

let express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    jade = require('jade'),
    morgan = require('morgan'),
    routes = require('./routes/index'),
    faviconURL = `${__dirname}/public/img/node-favicon.png`,
    publicDir = express.static(`${__dirname}/public/`),
    viewDir = `${__dirname}/views`,
    port = (process.env.PORT || 3000),
    app = express()

app
    //configurando app
    .set('views',viewDir)
    // .set('view engine','ejs');
    .set('view engine','jade')
    .set('port',port)
    //ejecutando middlewares
    .use(favicon(faviconURL))
    .use(morgan('dev'))
    .use(publicDir)
    //ejecuto el middleware enrutador
    .use('/',routes)

module.exports = app


