const express = require('express');
const app = express()
const csvtojson = require('csvtojson');
const axios = require('axios');


app.get('/pointofinterest', async function (req, res) {
  let year = parseInt(req.query['year'])
  let state = req.query['state']

  if(year === undefined){
    res.status(400).send();
    return;
  }

  if (state === undefined) {
    try {
      const beachFilterByYear = await datosPlayasGallegas(year);
      res.json(beachFilterByYear);
    }
    catch (e) {
      console.log(e);
    }

  } else {
    try {
      const beachFilterByYear = await datosPlayasGallegas(year);
      const filteredBeaches = beachFilterByYear.filter(beach => beach['C�DIGO PROVINCIA'] === state)
      res.json(filteredBeaches);
    }
    catch (e) {
      console.log(e);
    }
  }

})

app.listen(8000);



async function datosPlayasGallegas(year) {

  if (year === 2017) {
    const URL_2017 = 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0380/praias-galegas-con-bandeira-azul-2017/001/descarga-directa-ficheiro.csv';

    const respuesta_2017 = await axios.get(URL_2017);
    const listOfBeaches = await csvtojson({ 'delimiter': ';' }).fromString(respuesta_2017.data)
    return listOfBeaches

  }

  else if (year === 2018) {
    const URL_2018 = 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0392/praias-galegas-con-bandeira-azul-2018/001/descarga-directa-ficheiro.csv';
    const respuesta_2018 = await axios.get(URL_2018);
    const listOfBeaches = await csvtojson({ 'delimiter': ';' }).fromString(respuesta_2018.data)
    return listOfBeaches
  }

  else if (year === 2019) {
    const URL_2019 = 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0401/praias-galegas-con-bandeira-azul-2019/001/descarga-directa-ficheiro.csv';
    const respuesta_2019 = await axios.get(URL_2019);
    const listOfBeaches = await csvtojson({ 'delimiter': ';' }).fromString(respuesta_2019.data)
    return listOfBeaches
  }
  else {
    return console.log("Year Unknow")
  }

}









