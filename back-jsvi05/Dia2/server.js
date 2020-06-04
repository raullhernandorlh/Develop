const express = require('express')
const app = express()
 
app.get('/pointofinterest', function (req, res) { 
  console.log(req.query)
  if(req.query.type === 'beach'){
      res.send('Playas')
  }else{
      res.send("Cosas que no son playas")
  }

})
 
// HAce que nuestra aplicacion se quede esperando a las peticiones (Escucha) . 3000 Es el puerto
app.listen(1501)