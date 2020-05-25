'use strict'

// MiddleWare : Metodo que se ejecuta entre la ejecucion y la respuesta. 


let express = require('express'),
    app = express(),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session')

app
    .use(cookieParser())
    .use(cookieSession({ secret: "secreto" }))
    .get('/', (req, res) => {
    // Esta linea de codigo simplifica un if else. En un if else
    // lo que vendria a decir es que si existe req.session.visitas le sumemos una
    // y que si no existe pues ponga 0 (valor de inicializacion)

    req.session.visitas || (req.session.visitas = 0)
    let n = req.session.visitas++
    res.end(`
        <h1>
         Hola mundo desde Express, me has vistado ${n}veces
         </h1>
         `)
    })

    .listen(3000)

console.log('Iniciando Express en el puerto 3000')

// Para manejar las sesiones tenemos que utilizar dos modulos de npm
// cookie-parser --- Nos permite analizar un objeto que viene de una cookie
// cookie-session ---