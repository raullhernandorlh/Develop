'use strict'


let movies = require('../models/movie-connection.js'),
    express = require('express'),
    router = express.Router()



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

    next();
}

router
    .use(movies) // Necesita coger movies para coger la conexion al MySQL (getConnection) 
    .get('/', (req,res,next) =>{
        res.getConnection((err,movies) =>{
            movies.query('SELECT * from movie', (err,rows) =>{
                let locals = {
                    title: 'Lista de Peliculas',
                    data: rows
                }
                res.render('index', locals)
            })
            
        })
        // next()
    })
    .get('agregar', (req,res,next) =>{
        res.render('add-movie', {title:'Agregar Pelicula'})
    })
    // Para usar el middleware "error 404". Este middleware como controla el 
    // error 404 de las rutas DEBE IR SIEMPRE AL FINAL. Si este estaria al principio
    // o entre estas siempre va a mandar "Error 404"
    .post('/', (req,res,next) => {
    // DEl front al back los datos se pasan a traves del atributo name del form (layout.jade)
        req.getConnection((err,movies)=>{
    // Recogemos los datos de la pelicula
            let movie = {
                movie_id : req.body.movie_id,
                title : req.body.title,
                release_year : req.body.release_year,
                rating : req.body.rating,
                image : require.body.image
            }
            movies.query("INSERT INTO movie SET ?", movie, (err,rows) => )
                return (err) ? res.redirect("/Agregar") : res.redirect("/")
        })
    })
    .get('/editar/:movie_id', (req,res,next) =>{
        let movie_id = req.params.movie_id
        console.log(movie_id)

        req.getConnection((err,movies) =>{
            movies.query('SELECT * FROM movie WHERE movie_id = ?',movie_id,(err,rows) =>{
                console.log(err, "---------",rows)
                if(err){
                    throw(err)
                }
                else{
                    let locals = {
                        title : 'Editar Pelicula',
                        data: rows
                    }
                    res.render('edit-movie',locals)
                }
            })
        })
    })
    .use(error404)


module.exports = router