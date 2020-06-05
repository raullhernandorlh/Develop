require('dotenv').config();

const jwt = require('jsonwebtoken');

// En este paso verificamos que el usuario esta autenticado corectamente, para ello cogemos el token del header
// de la request que siempre tiene que ir en el parametro "authorization". Para ver si es correcto hay que verificar 
// con la variable de entorno secret

const isAuthenticated = (req, res, next) => {

    const { authorization } = req.headers;

    try {
        const decodedToken = jwt.verify(authorization, process.env.SECRET);
        // Creamos un parametro "reth auth" para meter el objeto "jwt" que tendra entre otras cosas
        // el id y el rol del usuario
        req.auth = decodedToken;

    } catch(e) {
        const authError = new Error('invalid token');
        authError.status = 401;
        return next(authError);
    }

    next();
}

// Para evaluar si es admin o no con req.auth que nos tira el rol

const isAdmin = (req, res, next) => {
    if (!req.auth || req.auth !== 'admin') {
        const authError = new Error('not-authorized');
        authError.status = 403;
        return next(authError);
    }

    next();
}


module.exports = {
    isAdmin,
    isAuthenticated
};