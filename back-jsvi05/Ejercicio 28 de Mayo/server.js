const axios = require('axios');
const bodyParser = require('body-parser');
const csvtojson = require('csvtojson');
const express = require('express');
const axiosCacheAdapter = require('axios-cache-adapter');

const app = express();


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

// app.use(function (req, res, next) {
//   console.log(`${new Date()} - recibida petición`);
//   next();
// });

// Create `axios-cache-adapter` instance
const cache = axiosCacheAdapter.setupCache({
  maxAge: 30 * 1000
});

// Create `axios` instance passing the newly created `cache.adapter`
const cachedAxios = axios.create({
  adapter: cache.adapter
})

const urls = {
  beaches = {
  '2017': 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0380/praias-galegas-con-bandeira-azul-2017/001/descarga-directa-ficheiro.csv',
  '2018': 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0392/praias-galegas-con-bandeira-azul-2018/001/descarga-directa-ficheiro.csv',
  '2019': 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0401/praias-galegas-con-bandeira-azul-2019/001/descarga-directa-ficheiro.csv',
  },

  poi = {
    'theatres':'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0305/teatros-auditorios/001/descarga-directa-ficheiro.csv',
    'councils':'https://abertos.xunta.gal/catalogo/administracion-publica/-/dataset/0301/casas-dos-concellos-galicia/102/acceso-aos-datos.csv'
  }

}


let nameCollection = ['theater','councils','beaches'];

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


// let races = [];

// app.post('/races', (req, res) => {
//   races.push(req.body);
//   res.send();
// });

// app.get('/races', (req, res) => {
//   res.json(races);
// })

app.get('/poi/' + nameCollection[0], async(req, res) => {
  let listOfTheaters;

  try {
    listOfTheaters = await getJSONFromNetwork(urls.poi['theatres'], ';');
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

app.get('/poi/' + nameCollection[1], async(req, res) => {
  let listOfCouncils;

  try {
    listOfCouncils = await getJSONFromNetwork(urls.poi[councils], ',');
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

app.get('/poi/' + nameCollection[2], async (req, res) => {
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

  if (urls.beaches[year] === undefined) {
    res.status(404).send();
    return;
  }

  try {
    listOfBeaches = await getJSONFromNetwork(urls.beaches[year], ';');
  } catch(e) {
    res.status(500).send();
    return;
  }

  if (state !== undefined) {
    listOfBeaches = listOfBeaches.filter( beach => beach['C�DIGO PROVINCIA'] === state)
  }

  res.json(listOfBeaches);

});

// http://example.com/poi/europe/spain/galicia/vigo

// TODO Names of current collection of points 

app.get('/poi', async(req, res) => {
  names = [];
  names = nameCollection.map( name => names.push(name))
  res.json(names);
})

// TODO Create new collections

let collections = [];
let getCollection = [];
let id;


app.post('/poi/:collection', (req, res) => {
   collections.push(req.body);
   res.send();
});

app.get('/poi/:collection', (req, res) => {
  res.json(collections);
})

app.get(`/poi/:collection/:${id}`, (req, res) => {
  getCollection = collections.filter((collection) => collection.id === id);

  res.json(getCollection);
})






app.listen(8000);

// localhost

/*

// common data format
{
  concello: ,
  coordenadas: ,
  codigoPostal: ,
  direccion: ,
  web: ,
  provincia: ,

  datos: {

  }
}
*/
