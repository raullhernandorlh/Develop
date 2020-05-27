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


router
    .get('/', (req,res) =>{
    res.end ('Terminamos la configuracion de nuestra primera APP en Express')
    })

    .get('/jade',jade)
    .get('/ejs',ejs)


module.exports = router