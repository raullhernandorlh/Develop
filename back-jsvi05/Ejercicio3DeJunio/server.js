require('dotenv').config()

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const {login,register} = require('./controllers/users')

const port = process.env.PORT;


const app = express();

app.use(morgan('dev'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:'true'}));
app.use(cors());

app.use((req,res,next) =>{
  console.log('Codigo que se ejecuta antes de procesar el endpoint')
})


app.post('/user',register =>{});

app.post('/user/login',login =>{});

// Solo los usuarios autenticados pueden leer los eventos creados
app.get('/event',isAuthenticated,(res,req) =>{});

// Solo los usuarios autenticados y que ademas sean administradores pueden crear eventos
app.get('/post',isAuthenticated,isAdmin,(res,req) =>{});

app.listen(port);

