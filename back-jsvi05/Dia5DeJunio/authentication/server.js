//dotenv para variables de entorno
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

// Importamos los metodos  "login" y "register" de "controllers/users"
const { login, register } = require('./controllers/users');

// Importamos los middlewares "isAuthenticated" y "isAdmin" del archivo "auth" de la carpeta "middlewares"
const { isAuthenticated, isAdmin } = require('./middlewares/auth')

// Importamos los metodos "add" y "list" del archivo "events" de la carpeta "controllers"
const { add, list } = require('./controllers/events');

// Puerto cogido del archivo ".env" variable de entorno "PORT"
const port = process.env.PORT;

const app = express();

// Morgan aplicado como middleware para proporcionarnos logs cuando ejecutamos el servidor
app.use(morgan('dev'));

// Bodyparser convierte el body de la peticion a json para poder trabajar con este como un objeto JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());


app.use((req, res, next) => {
    console.log('código que se ejecuta antes de procesar el endpoint');
    next();
})

// ENDPOINTS

// REGISTRO DE USUARIO : Pide metodo "register" que se enecuentra en el archivo "users" de la carpeta "controllers"
app.post('/user', register);

// LOGIN DE USUARIO : Pide metodo "login" que se enecuentra en el archivo "users" de la carpeta "controllers"
app.post('/user/login', login);

// LEER LOS REGISTROS CREADOS(GET)----- PARA LISTAR
// LLama al middleware "is Authenticated" que se encuentra en el archivo "auth" de la carpeta Middlewares
// LLama a la funcion list que se encuentra en el archivo "events" de la carpeta "controller"
// solo los usuarios autenticados pueden leer los eventos creados
app.get('/event', isAuthenticated, list);

// POSTEAR LOS EVENTOS (POST)----------PARA CREAR
//// LLama al middleware "is Authenticated" que se encuentra en el archivo "auth" de la carpeta Middlewares
//// LLama al middleware "is Admin" que se encuentra en el archivo "auth" de la carpeta Middlewares
// Llama a la funcion "add" que se encuentra en el archivo "event" de la carpeta "controllers"
// Solo los usuarios autenticados y que además sean administradores pueden crear eventos
app.post('/event', isAuthenticated, isAdmin, add);

// Error generico que es llamado desde los Middlewares

app.use((error, req, res, next) => {
    res
        .status(error.status || 500)
        .send({status: 'error', message: error.message})
})

// Puerto utilizado por express que coge el numero de la variable de entorno usando "dotenv"
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});