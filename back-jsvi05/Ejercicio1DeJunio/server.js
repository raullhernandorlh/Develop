const axios = require('axios');
const bodyParser = require('body-parser');
const csvtojson = require('csvtojson');
const express = require('express');
const axiosCacheAdapter = require('axios-cache-adapter');
const winston = require('winston');


const poiManager = require('storage-memory.js');

const app = express();

let globalId = 0;

const logger = winston.createLogger({
  level: 'info',
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
app.use(bodyParser.urlencoded({ extended: true }));

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

// GET . LISTAR LA LISTA de Point Of Interest
app.get('/poi', (req, res) => {
  res.json(poiManager.getListNames());
})


// POST . CREAMOS UNA LISTA  de Point Of Interest

app.post('/poi', (req, res) => {
  const collectionName = req.body.name;

  if (collectionName === undefined) {
    res.status(400).send();
    return;
  }
  // Creamos la lista con el nombre de la coleccion que le pasamos por el body 
  // Si existe la enviamos y sino error 409;

  try {
    poiManager.createList(collectionName)
    res.send()
  } catch (e) {
    res.status(409).send();
    return
  }

})

// POST .CREART ELEMENTOS de las Colecciones

app.post('/poi/:collection', (req, res) => {
  let collectionName = req.params.collection.toLowerCase();

  // comprobar si intentan añadir un elemento a una colección de las que están
  // fuera de nuestro control, que son las que gestiona la Xunta (banderas azules, ayuntamientos y 
  // teatros/auditorios)
  //  const filteredList = ['beaches', 'council', 'theater'].filter(item => item === collectionName);
  if (['beaches', 'council', 'theater'].indexOf(collectionName) !== -1) {
    res.status(403).send();
    return;
  }

  try {
    let id = poiManager.addPointOfInterest(collectioName, req.body)
  } catch (e) {
    if (e.message == 'missing-data') {
      res - status(400).send();
      return
    } else if (e.message == "unknown-list") {
      res.status(404).send();
    } else if (e.message === "already-exists") {
      res.status(409).send();
      return
    }

  }
  // Retornamos el Id cuando agreagmos un point of interest porque luego este puede ser utilizado
  // para eliminar un registro, actualizar todos los registros o actualizar uno en concreto
  res.json({ id: id });
});

// DELETE - Eliminar Point Of Interest 

app.delete('/poi/:collection/:id', (req, res) => {
  const collectionName = req.params.collection;

  // OJO!!! cuando generamos el ID era un número entero, pero en la URL
  // viene como cadena
  const id = parseInt(req.params.id);

  try {
    poiManager.deletePointOfInterest(collectionName, id)
  } catch (e) {
    if (e.message === "unknow-list" || e.message === "unknow-point") {
      res.status(404).send();
      return;
    }
  }

  res.send();
});

// PUT -ACTUALIZAR TODOS LOS ELEMENTOS DE LA COLECCION

app.put('/poi/:collection/:id', (req, res) => {
  const collectionName = req.params.collection;
  const id = parseInt(req.params.id);

  try {
    poiManager.updatePointOfInterest(collectionName, id, req.body)
  } catch (e) {
    if (e.message === 'undefined-body-parameter') {
      res.status(400).send();
      return
    } else if (e.message === 'undefined searched-element') {
      res.status(404).send();
      return
    } else if (e.message === 'undefined searched-element') {
      res.status(404).send();
      return
    }
  }

  res.send();
});


// PATCH - ACTUALIZA UNO O VARIOS DE LOS ELEMENTOS DE UNA COLECCION

app.patch('/poi/:collection/:id', (req, res) => {

  const collectionName = req.params.collection;
  const id = parseInt(req.params.id);

  try {
    poiManager.patchPointOfInterest(collectionName, id, req.body)
  } catch (e) {
    if (e.message === 'unkonow-collection') {
      res.status(404).send()
      return
    } else if (e.message === 'unkonow-searched-element') {
      res.status(404).send()
      return
    }
  }

  res.send();
});

// GET - LISTAR TODOS LOS TEATROS (theaters)

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

// GET - LISTAR TODOS LOS AYUNTAMIENTOS (councils)

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

// GET - LISTAR TODAS LAS PLAYAS (beaches)

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

// LISTAR TODAS LAS COLECCIONES 

app.get('/poi/:collection', (req, res) => {
  let collectionName = req.params.collection;
  // TODO: check if collection exists (404)
  // TODO: gestionar aquí la descarga de playas, ayuntamientos y teatros

  res.json(collection[collectionName]);
});

const port = 8000;

logger.info(`Running server in port ${port}`);


app.listen(port);






