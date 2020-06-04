const csvtojson = require('csvtojson');
const axios = require('axios');

// IIFE
(async () => {

    if (process.argv.length < 3) {
        console.log('Falta un parámetro');
        return;
    }

    const town = process.argv[2]; 

    const URL_2017 = 'https://abertos.xunta.gal/catalogo/cultura-ocio-deporte/-/dataset/0380/praias-galegas-con-bandeira-azul-2017/001/descarga-directa-ficheiro.csv';

    const respuesta_2017 = await axios.get(URL_2017);
    const listOfBeaches = await csvtojson({'delimiter':';'}).fromString(respuesta_2017.data)

    const filteredBeaches = listOfBeaches.filter( beach => beach['CONCELLO'] === town)

    console.log(filteredBeaches.length);
})(); // <= SE LLAMA A SÍ MISMA

