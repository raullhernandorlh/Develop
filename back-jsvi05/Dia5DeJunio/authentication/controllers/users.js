// bcrypt : libreria utilizada para hashear contraseñas
const bcrypt = require('bcrypt');

// jwt : libreria utilizada para la creacion del token
const jwt = require('jsonwebtoken');

// just for academic purpose until database module is ready
const bd = require('./bd_mock');

// REALIZAR REGISTRO

const register = async (req, res) => {
    // coger datos del body (email, password)
    const { email, password } = req.body;

    // comprobaremos que son válidos
    if (!email || !password) {
        res.status(400).send();
        return;
    }

    // comprobar si ya existe un existe un usuario con este email
    if (bd.getUser(email)) {
        res.status(409).send();
        return;
    }

    // encriptar la password (para no almacenarla en texto claro)
    // bcrypt.hash(<password en claro (ej.: 1234)>, <número de "rounds">)
    //    rounds = 3
    //         hash(hash(hash(password)))
    const passwordBcrypt = await bcrypt.hash(password, 10);

    // almacenamos (email, passwordBcrypt)
    bd.saveUser(email, passwordBcrypt);

    res.send();
}

const login = async (req, res) => {
    const { email, password } = req.body;

    // buscar email en la bbdd
    // nos devolverá un JSON para el usuario con un ID, un role, y su password
    const user = bd.getUser(email);

    if (!user) {
        res.status(404).send();
        return;
    }

    // comprobar la password (ojo! con bcrypt)
    // error si no matchean
    const passwordIsvalid = await bcrypt.compare(password, user.password);

    if (!passwordIsvalid) {
        res.status(401).send();
        return;
    }

    // Para crear el token con jwt te piden el "tokenPayload" el cual estara formado por el user.id y el user.role
    // y ademas de esto deberemos pasarle el process la variable de entorno "SECRET"
    const tokenPayload = { id: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.SECRET, {
        expiresIn: '1d'
    });

    res.json({
        token
    })
}

module.exports = {
    login,
    register
}