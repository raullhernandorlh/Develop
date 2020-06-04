const bcrypt = require('bcrypt');
const jwt = require('jwt');

const register = (req, res) => {
    // coger datos del body (email, password)
    const { email, password } = req.body;

    // comprobaremos que son válidos
    if (!email || !password) {
        res.status(400).send();
        return;
    }

    // comprobar si ya existe un existe un usuario con este email
    // TODO

    // encriptar la password (para no almacenarla en texto claro)
    // bcrypt.hash(<password en claro (ej.: 1234)>, <número de "rounds">)
    //    rounds = 3
    //         hash(hash(hash(password)))
    const passwordBcrypt = bcrypt.hash(password, 10);

    // almacenamos (email, passwordBcrypt)
    // TODO

    res.send();
}

const login = (req, res) => {
    const { email, password } = req.body;

    // buscar email en la bbdd
    // nos devolverá un JSON para el usuario con un ID, un role, y su password

    // si no existe email, error

    // comprobar la password (ojo! con bcrypt)
    // error si no matchean
    const passwordIsvalid = bcrypt.compare(password, user.password);

    if (!passwordIsvalid) {
        res.status(401).send();
        return;
    }

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