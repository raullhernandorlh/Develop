'use strict'



let conn = require('./movie-connection') ,
    MovieModel = () =>{}

//Metodos mapeados que se necesitan en la parte del modelo 

// Pedimos todas las peliculas a la base de datos
// Callback (cb) hace referencia a moviecontroller
MovieModel.getAll = (cb) => conn.query("SELECT * FROM MOVIE",cb)


// Pedimos una sola pelicula (registro) a la base de datos

MovieModel.getOne = (id,cb) => conn.query("SELECT * FROM movie WHERE movie_id = ?",id,cb);

// Inserta a la base de datos la pelicula que nosotros vamos a salvar

// MovieModel.insert = (data,cb) => conn.query('INSERT into movie SET ?', data,cb)


// // Actualizacion de una pelicula
// MovieModel.update = (data,cb) => conn.query('UPDATE movie SET ? where movie_id = ?',[data,data.movie_id],cb)

MovieModel.save = (data,cb) => {
    conn.query ('SELECT * FROM movie WHERE movie_id = ?',data.movie_id,(err,rows) => {

        console.log(`Numero de registros ${rows.length}`)
        if(err){
            return err
        }else{
            // En esta expresion ternaria evaluamos que exista la linea a insertar. Si existe (es igual a 1)
            // se actualiza y si no existe se procede a insertar.

            return (rows.length == 1) 
                ?  conn.query('UPDATE movie SET ? WHERE movie_id = ?',[data,data.movie_id],cb)
                : conn.query('INSERT INTO movie SET ?',data,cb)
        }
    })
}

// Eliminacion de la pelicula
MovieModel.delete = (id,cb) => conn.query('DELETE from movie WHERE movie_id = ?',id,cb)


MovieModel.close = () => conn.end()

// Exportamos el prototipo Movie (Un prototipo es como una clase en Javascript. Existen las clases en ES6 pero todavia
// no estan muy pulidas. Por esta razon usamos prototipos )

module.exports = MovieModel