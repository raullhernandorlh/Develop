// Esta aplicacion basica o esqueleto de express se ha creado con : Express Generator
// Express Generator es un paquete npm que nos permite crar un esqueleto de aplicacion por defecto

// Como crearlo
// 1. Ejecutamos npm iniy y lo configuaramos
// 2. Intalamos express (npm install express)
// 3. Ejecutamos la siguiente instruccion "npm -i express-generator -g"
// 4. Creamos la carpeta del proyecto "express NombreCarpeta"

// MUY IMPORTANTE -- EL comando de express-generator no funcionara sino somos usuarios root
// con lo cual nos deveremos logear previamente como root en la terminal. Con "sudo -s"
// nos pedira la contraseña y ya estaremos como root




var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
