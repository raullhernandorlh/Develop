// Archivo creado para simular la base de datos

let users = [];

let id = 1;

// Funcion que comprueba si hay un email aociado a un usuario. Si es un si retorna "True" y viceversa
const getUser = (email) => {
    return users.find(user => user.email === email);
}

// Metodo para la creacion de usuario con id autoincrementable

const saveUser = (email, password) => {
    users.push({
        id: id++,
        email,
        password,
        role: 'normal'
    })
}


module.exports = {
    getUser,
    saveUser
}