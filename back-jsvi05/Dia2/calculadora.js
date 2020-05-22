const express = require('express')
const app = express()
 


app.get('/operacion', function (req, res) { 
    let op1 = parseInt(req.query['op1'])
    let op2 = parseInt(req.query['op2'])
    let operation = req.query['type']


    const operations = {
        'sum' :(op1,op2)  => op1 + op2,
        'restar' :(op1,op2)  => op1 - op2,
        'multiplicar' :(op1,op2)  => op1 * op2,
        'dividir' :(op1,op2)  => op1 / op2,
        'pow': (a, b) => a ** b
    } 

    if(isNaN(op1) ||isNaN(op2)){
        res.status(400).send(); // Devuelve el codigo de error 400. No encuentra uno o los dos parametros
        return;
    }

    if(operations[operation] === undefined){
        res.status(404).send();
        return
    }

    const result = operations[operation](op1,op2);
    res.json(result);

//   if(req.query.type === 'sumar'){
      
//       let sumar = op1 + op2
//       res.json(sumar)
//   }
//   else if (req.query.type === 'restar'){
//     let restar = op1 - op2
//       res.json(restar)

//   }
//   else if (req.query.type === 'multiplicar'){
//     let multiplicar = op1 * op2
//     res.json(multiplicar)

//   }else if (req.query.type === 'dividir'){
//       let dividir = op1 / op2
//       res.json(dividir)

//   }else{
//       res.status(404).send();//404 es que no encuentra un recurso en el servidor
//   }
 

})
 
// HAce que nuestra aplicacion se quede esperando a las peticiones (Escucha) . 3000 Es el puerto
app.listen(1500)