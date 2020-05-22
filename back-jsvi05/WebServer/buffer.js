// Un buffer 
//Una tira de bytes (datos binarios)
// Similar a un array de enteros
// Manipular datos directamente
//      Sockets
//      Streams
//      Implementar protocolos complejos
//      Manipulacion de ficheros/imagenes
//      Criptografia



'use strict'

var buf = new Buffer(100),
    buf2 = new Buffer(26),
    str = '\u00bd + \u00bc = \u00be'
buf.write('abcd',0,4,'ascii')
console.log(buf,
            buf.toString('ascii'),
            str,
            str.length, // La cadena tiene 9 caracteres
            Buffer.byteLength(str,'utf8') + 'bytes', // A nivel de memoria estos 9 caracteres estan ocupando 12 bytes
            buf2.length
)

for( let i = 0; i< buf2.length; i++){
    buf2[i] = i + 97; 
}

console.log(buf2.toString('ascii'))
