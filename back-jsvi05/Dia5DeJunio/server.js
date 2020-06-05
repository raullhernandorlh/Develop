require('dotenv').config()

const axios = require('axios');
const bodyParser = require('body-parser');
const config = require('config');
const csvtojson = require('csvtojson');
const express = require('express');
const axiosCacheAdapter = require('axios-cache-adapter');
const winston = require('winston');

const poiManager = require('./storage_memory.js')

const app = express();

let globalId = 0;

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

  } catch(e) {
    throw 'unknown-error';
  }

  listOfData = await csvtojson({'delimiter': delimiter}).fromString(listOfData);

  return listOfData;
}

//let collections = ['theater', 'beaches', 'council'];

app.get('/poi', (req, res) => {
  res.json( poiManager.getListNames() );
})

app.post('/poi', (req, res) => {
  const { name } = req.body;

  if (name === undefined) {
    res.status(400).send();
    return;
  }

  try {
    poiManager.createList(name);
    res.send();
  } catch (e) {
    // simplificación: asume un único tipo de error
    res.status(409).send();
    return
  }

})

app.post('/poi/:collection', (req, res) => {
  let collectionName = req.params.collection.toLowerCase();
  let id;

  // comprobar si intentan añadir un elemento a una colección de las que están
  // fuera de nuestro control, que son las que gestiona la Xunta (banderas azules, ayuntamientos y 
  // teatros/auditorios)
  //  const filteredList = ['beaches', 'council', 'theater'].filter(item => item === collectionName);
  if (['beaches', 'council', 'theater'].indexOf(collectionName) !== -1 ) {
    res.status(403).send();
    return; 
  }

  try {
    id = poiManager.addPointOfInterest(collectionName, req.body);
  } catch (e) {
    if (e.message === 'missing-data') {
      res.status(400).send();
      return;
    } else if (e.message === 'unknown-list') {
      res.status(404).send();
      return; 
    } else if (e.message === 'already-exists') {
      res.status(409).send();
      return;
    }

  }

  res.json({id: id});
});

app.delete('/poi/:collection/:id', (req, res) => {
  const collectionName = req.params.collection;

  // OJO!!! cuando generamos el ID era un número entero, pero en la URL
  // viene como cadena
  const id = parseInt(req.params.id);

  try {
    poiManager.deletePointOfInterest(collectionName, id);
  } catch(e) {
    if ((e.message === 'unknown-list') || (e.message === 'unknown-point')) {
      res.status(404).send();
      return
    }
  }

  res.send();
});

app.put('/poi/:collection/:id', (req, res) => {
  //const collectionName = req.params.collection;

  // OJO!!! cuando generamos el ID era un número entero, pero en la URL
  // viene como cadena
  //const id = parseInt(req.params.id);

  let { collection, id} = req.params;
  id = parseInt(id);

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



app.get('/poi/theater', async(req, res) => {
  let listOfTheaters;

  try {
    listOfTheaters = await getJSONFromNetwork(urlTheater, ';');
  } catch(e) {
    res.status(500).send();
    return;
  }

  listOfTheaters = listOfTheaters.map( theater => {
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

/*{
  concello: ,
  coordenadas: ,
  codigoPostal: ,
  direccion: ,
  web: ,
  provincia: ,

  datos: {

  }
*/

app.get('/poi/council', async(req, res) => {
  let listOfCouncils;

  try {
    listOfCouncils = await getJSONFromNetwork(urlCouncil, ',');
  } catch(e) {
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

app.get('/poi/beaches', async (req, res) => {
  // querystring
  // ?year=2019&state=15
  // ?year=2019
  let listOfBeaches;

  const year = req.query['year'];
  const state = req.query['state'];

  if (isNaN(year)) {
    res.status(400).send();
    return;
  }

  try {
    listOfBeaches = await getJSONFromNetwork(config.get(year), ';');
  } catch(e) {

    if (e.message.startsWith('Configuration')) {
      res.status(404).send();
      return;
    } else {
      res.status(500).send();
      return;
    }

  }

  if (state !== undefined) {
    listOfBeaches = listOfBeaches.filter( beach => beach['C�DIGO PROVINCIA'] === state)
  }

  res.json(listOfBeaches);
});


app.get('/poi/:collection', (req, res) => {
  let collectionName = req.params.collection;
  // TODO: check if collection exists (404)
  // TODO: gestionar aquí la descarga de playas, ayuntamientos y teatros

  res.json(collection[collectionName]);
});

const port = process.env.PORT;

logger.info(`Running server in port ${port}`);

app.listen(port);
