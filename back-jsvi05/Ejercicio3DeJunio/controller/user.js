const bcrypt = require('bcrypt');
const jwt = require('jwt');


const register =(req,res) =>{
    // Coger los datos del body. Con destructuring
    const{email,password} = req.body;
    //Comprobaremos que son validos (que es un usuario y su contraseña)
    if(!email || !password){
        res.status(400).send();
        return;
    }


    // Encriptar la password(para no almacenar en texto plano)

    const passwordBcrypt = bcrypt.hash(password,10);

    // Almacenamos(email,passwordBCrypt)
    // 


    res.send();
}


const login =(req,res) =>{
    
    // Buscar email en la bbdd
    // Nos devolvera un JSON para el usuario con un ID, un role y a su password
    // Si no existe email , error
    // Comprobar la password (ojo con bcrypt)
    // error si no matchean

    const passwordIsValid = bcrypt.compare(password, user.password);

    if(!passwordIsValid){
        res.status(401).send();
        return;
    }

    const tokenPayload = {id:user.id,role:user.role};
    const token = jwt.sign(tokenPayload,process.env.SECRET,{
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