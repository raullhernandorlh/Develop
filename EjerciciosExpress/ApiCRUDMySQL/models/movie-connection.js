'use strict'

let mysql = require('mysql'),
    conf = require('./db-conf'),
    dbOptions = {
        host: conf.mysql.host,
        port: conf.mysql.port,
        user: conf.mysql.user,
        password: conf.mysql.pass,
        database : conf.mysql.db
    },
    myConn = mysql.createConnection(dbOptions)

myConn.connect((err)=>{
    return (err) ? console.log(`Error al conectarse a MySQL ${err.stack}`) 
    : console.log(`Conexion establecida con MySQL Nº:${myConn.threadId}`)
})
module.exports = myConn


