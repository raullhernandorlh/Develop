require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const { login, register } = require('./controllers/users');

const port = process.env.PORT;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use((req, res, next) => {
    console.log('código que se ejecuta antes de procesar el endpoint');
})

app.post('/user', register);

app.post('/user/login', login);

// solo los usuarios autenticados pueden leer los eventos creados
app.get('/event', isAuthenticated, (req, res) => {});

// solo los usuarios autenticados y que además sean administradores
// pueden crear eventos
app.post('/event', isAuthenticated, isAdmin, (req, res) => {});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});