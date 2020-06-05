const axios = require('axios');

// leer parámetros de la terminal
const operation = process.argv[2];
const op1 = process.argv[3];
const op2 = process.argv[4];


(async () => {
    const url = `http://localhost:8000/calculate?type=${operation}&op1=${op1}&op2=${op2}`;
    try {
        const response = await axios.get(url);
        console.log(`El resultado es: ${response.data.resultado}`);

    } catch(e) {
        console.log('Revise los parámetros');
    }

})();
