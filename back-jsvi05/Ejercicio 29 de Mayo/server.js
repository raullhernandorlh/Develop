
// Lineas requeridas para Winston
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const axios = require('axios');
const bodyParser = require('body-parser');
const csvtojson = require('csvtojson');
const express = require('express');
const axiosCacheAdapter = require('axios-cache-adapter');

const app = express();

let globalId = 1;
/*
  Configuración de CORS. 

  El código a continuación es un middleware, esto es, un mecanismo
  que nos ofrece expressjs para ejecutar código en cada endpoint,
  sin necesidad de añadir dicho código a cada uno de los endpoints.
  Puede haber un número indefinido de ellos y su finalidad es modificar
  el contenido de los objetos req y res. En este caso estamos modificando 
  el objeto de respuesta, res, añadiendo información que indica cuáles son 
  los dominios desde los que se permite acceder a la API.

  Notad la llamada a 'next()'. Es necesario llamar a esta función para
  encadenar todos los middlewares definidos.
*/
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// BODY PARSER (Para parsear texto plano a JSON. Obligatorio para utilizarlo con get, post, delete, put y patch
// Funciona de forma transparente para el programador . Es decir no tenemos que ejecutar ninguna instruccion mas
// en el codigo que la que especificamos ahora con el use . Es un MIDDLEWARE)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Winston : Aplicacion para crear logs

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     //
//     // - Write to all logs with level `info` and below to `combined.log` 
//     // - Write all logs error (and below) to `error.log`.
//     //
//     new winston.transports.File({ filename: 'error.log', level: 'error' }), // Almacena en fichero error.log si "level:'error'"
//     new winston.transports.File({ filename: 'combined.log' }), // almacena en fichero combined.log si "level: 'info'"
//     // muestra por consola el info o el error dependiendo del level elegido. En la consola el format es simple es decir una cadena de texto 
//     new winston.transports.Console({format: winston.format.simple()}), 
//   ]
// });

// CREACION LOGGER WINSTON (Creando logger especifico con libreria Winston)

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} : ${message}`;
})

const logger = createLogger({
  format: combine(
    label({ label: 'right meow !!' }),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console(), new transports.File({ filename: 'combined.log' })]
});

logger.info("Hello")





//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 



// const port = 8000;
// logger.info(`Running server in port ${port}`)
////////////////////////////////////////////////////////////////////////////////////////

// AXIOS CATCHE

app.use(function (req, res, next) {
  console.log(`${new Date()} - recibida petición`);
  next();
});

// Create `axios-cache-adapter` instance
const cache = axiosCacheAdapter.setupCache({
  maxAge: 30 * 1000
});

// Create `axios` instance passing the newly created `cache.adapter`
const cachedAxios = axios.create({
  adapter: cache.adapter
})

const urls = {
  '2017': 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0380/praias-galegas-con-bandeira-azul-2017/001/descarga-directa-ficheiro.csv',
  '2018': 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0392/praias-galegas-con-bandeira-azul-2018/001/descarga-directa-ficheiro.csv',
  '2019': 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0401/praias-galegas-con-bandeira-azul-2019/001/descarga-directa-ficheiro.csv',
}

const urlTheater = 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0305/teatros-auditorios/001/descarga-directa-ficheiro.csv';
const urlCouncil = 'https://abertos.xunta.gal/catalogo/administracion-publica/-/dataset/0301/casas-dos-concellos-galicia/102/acceso-aos-datos.csv';

async function getJSONFromNetwork(url, delimiter) {
  let listOfData;

  try {
    const response = await cachedAxios({
      url: url,
      method: 'get'
    });

    listOfData = response.data;

  } catch (e) {
    throw 'unknown-error';
  }

  listOfData = await csvtojson({ 'delimiter': delimiter }).fromString(listOfData);

  return listOfData;
}

//let collections = ['theater', 'beaches', 'council'];

let collection = {
  'theater': [],
  'beaches': [],
  'council': []
}


// GET (OBTENER la lista de colecciones)

app.get('/poi', (req, res) => {
  res.json(Object.keys(collection));
})

// POST (CREAR colecciones nuevas )

app.post('/poi', (req, res) => {

  const collectionName = req.body.name;

  if (collectionName === undefined) {
    res.status(400).send();
    return
  }

  if (collection[collectionName.toLowerCase()] !== undefined) {
    res.status(409).send()
    return
  }

  collection[collectionName] = []
  res.send();

})

// POST (CREAR LOS OBJETOS de una coleccion en concreto)

app.post('/poi/:collection', (req, res) => {
  let collectionName = req.params.collection.toLocaleLowerCase();

  // TODO: comprobar si piden añadir sobre alguna colección externa

  if (['beaches', 'council', 'theater'].filter(item => item === collectionName).length !== 0) {
    res.status(403).send(); // Codigo de error de forbiden (Prohibido)
    return
  }

  // TODO: comprobar si la colección existe (404)



  if (collection[collectionName] === undefined) {
    res.status(404).send();
    return
  }

  const isEqual = (item) => {

    return false
  }
  // Comprobar si el nuevo elemento ya existe

  const equalElements = collection[collectionName].filter(isEqual)

  if (equalElements.length !== 0) {
    res.status(409).send()
    return;
  }

  let data = {
    id: globalId++,
    concello: req.body.concello,
    coordenadas: req.body.coordenadas,
    web: req.body.web,
    provincia: req.body.provincia,
    datos: {
      nome: req.body.nome
    }
  }

  collection[collectionName].push(data);

  res.send();

});



// TEATROS(Devuelve la lista de los teatros )

app.get('/poi/theater', async (req, res) => {
  let listOfTheaters;

  try {
    listOfTheaters = await getJSONFromNetwork(urlTheater, ';');
  } catch (e) {
    res.status(500).send();
    return;
  }

  listOfTheaters = listOfTheaters.map(theater => {
    return {
      concello: theater['CONCELLO'],
      coordenadas: theater['COORDENADAS'],
      codigoPostal: theater['C�DIGO POSTAL'],
      direccion: theater['ENDEREZO'],
      web: theater['WEB'],
      provincia: theater['PROVINCIA'],
      datos: {
        aforamento: theater['AFORAMENTO']
      }
    }
  })

  res.json(listOfTheaters)

})



// GET (Devuelve los objetos de la coleccion ayuntamientos)

app.get('/poi/council', async (req, res) => {
  let listOfCouncils;

  try {
    listOfCouncils = await getJSONFromNetwork(urlCouncil, ',');
  } catch (e) {
    res.status(500).send();
    return;
  }

  listOfCouncils = listOfCouncils.map(council => {
    return {
      concello: council['CONCELLO'],
      coordenadas: `${council['LATITUD']}, ${council['LONGITUD']}`,
      codigoPostal: council['C�DIGO POSTAL'],
      direccion: council['ENDEREZO'],
      web: council['PORTAL WEB'],
      provincia: council['PROVINCIA'],
      datos: {
      }
    }
  })

  res.json(listOfCouncils);

})

// GET( Devuelve los objetos de la coleccion playas)

app.get('/poi/beaches', async (req, res) => {
  // querystring
  // ?year=2019&state=15
  // ?year=2019
  let listOfBeaches;
  const year = parseInt(req.query['year']);
  const state = req.query['state'];

  if (isNaN(year)) {
    res.status(400).send();
    return;
  }

  if (urls[year] === undefined) {
    res.status(404).send();
    return;
  }

  try {
    listOfBeaches = await getJSONFromNetwork(urls[year], ';');
  } catch (e) {
    res.status(500).send();
    return;
  }

  if (state !== undefined) {
    listOfBeaches = listOfBeaches.filter(beach => beach['C�DIGO PROVINCIA'] === state)
  }

  res.json(listOfBeaches);

});

// GET(Devuelve los objetos de una coleccion en concreto)

app.get('/poi/:collection', (req, res) => {
  let collectionName = req.params.collection;
  // TODO: check if collection exists (404)

  if (collection[collectionName] !== undefined) {
    res.json(collection[collectionName]);
    return;
  }
  else {
    res.status(404).send();
  }


});


// DELETE(ELIMINAR una objeto de una coleccion en concreto)

app.delete('/poi/:collection/:id', (req, res) => {

  let collectionName = req.params.collection;
  let collectionId = parseInt(req.params.id);

  // Si no existe el id a eliminar manda un 404
  if(collection[collectionName].find(item => item.id === collectionId) === undefined){
    res.status(404).send();
    return
  }

 
  let filteredCollection = collection[collectionName].filter(item => item.id !== collectionId);
  collection[collectionName] = filteredCollection




  res.json(collection[collectionName])

})


// PUT(ACTUALIZAR TODOS LOS CAMPOS de una coleccion en concreto)

app.put('/poi/:collection/:id', (req, res) => {
  const collectionName = req.params.collection;

  // OJO!!! cuando generamos el ID era un número entero, pero en la URL
  // viene como cadena
  const id = parseInt(req.params.id);

  if (collection[collectionName] === undefined) {
    res.status(404).send();
    return;
  }

  if (req.body.coordenadas === undefined ||
    req.body.concello === undefined ||
    req.body.provincia === undefined ||
    req.body.web === undefined) {
      res.status(400).send();
      return;
    }

  let searchedElement = collection[collectionName].find(item => item.id === id);
  if (searchedElement === undefined) {
    res.status(404).send();
    return;
  }

  searchedElement.concello = req.body.concello;
  searchedElement.coordenadas = req.body.coordenadas;
  searchedElement.web = req.body.web;
  searchedElement.provincia = req.body.provincia;
  searchedElement.datos = req.body.datos;

  res.send();
});



// PATCH (ACTUALIZAR UNO O VARIOS CAMPOS ESPECIFICADOS de una coleccion en concreto)

app.patch('/poi/:collection/:id', (req, res) => {
  const collectionName = req.params.collection;

  // OJO!!! cuando generamos el ID era un número entero, pero en la URL
  // viene como cadena
  const id = parseInt(req.params.id);

  if (collection[collectionName] === undefined) {
    res.status(404).send();
    return;
  }

  let searchedElement = collection[collectionName].find(item => item.id === id);
  if (searchedElement === undefined) {
    res.status(404).send();
    return;
  }

  const bodyParams = Object.keys(req.body);

  for (let param of bodyParams) {
    searchedElement[param] = req.body[param];
  }

//  Object.keys(req.body).forEach(key => {
//    searchedElement[key] = req.body[key];
//  })

  res.send();
});


app.listen(8000);

