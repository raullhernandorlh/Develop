'use strict'

var http = require('http');

function webServer(req,res){
    res.writeHead(200,{'Content-type':'text-html'})
    res.end("<h1>Hola Node.js</h1>")
}

http
    .createServer(webServer)
    .listen(3000,'localhost')

console.log('Servidor corriendo en http://localhost:3000/')

