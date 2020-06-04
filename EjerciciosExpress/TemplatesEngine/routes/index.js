'use strict'

let express = require('express'),
    router = express.Router()

function jade (req,res,next)
{
    let locals = {
        title:   'Jade',
        link:    'http://jade-lang.com/',
        description:'EJS limpia el HTML del Javascript con plantillas del lado cliente.'
            
                    
    }
    res.render('index',locals)
}

function ejs (req,res,next)
{
    let locals = {
        title:   'EJS',
        link:    'http://www.embeddedjs.com/',
        description:  'Jade es un sistema de plantillas inspirado en JavaScript y en Haml para utilizarse en Node.js'
                    
    }
    res.render('index',locals)
} 

// MIDDLEWARE

function error404(req,res,next)
{
    let error = new Error(),
        locals = {
            title : 'Error 404',
            description : 'Recurso no encontrado',
            error:error,
        }
    
    error.status = 404

    res.render('error',locals)
    // El next() sirve para que siga con el fujo de ejecucion de los
    // middlewares. Es decir, sirve para que ejecute el siguiente middleware
    // dentro de la pila de ejecucion

    .next()
}


router
    .get('/', (req,res) =>{
    res.end ('Terminamos la configuracion de nuestra primera APP en Express')
    })

    .get('/jade',jade)
    .get('/ejs',ejs)
    // Para usar el middleware "error 404". Este middleware como controla el 
    // error 404 de las rutas DEBE IR SIEMPRE AL FINAL. Si este estaria al principio
    // o entre estas siempre va a mandar "Error 404"
    .use(error404)


module.exports = router