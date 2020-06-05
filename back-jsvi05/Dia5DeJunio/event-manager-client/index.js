const axios = require('axios');
const csvtoson = require('csvtojson');


const email = 'raullopezhernando@gmail.com';
const password = '1234';
const baseURL = 'http://localhost:8000';


// Ponemos todas las funciones independientemente
const register = async (email, password) => {

    const response = await axios.post(`${baseURL}/user`, {
        email,
        password
    });
}

const login = async (email, password) => {

    const response = await axios.post(`${baseURL}/user/login`, {
        email,
        password
    });

    return response.data.token;

}


const list = async (token) => {
    const response = await axios.get(`${baseURL}/event`, {
        headers: { authorization: token }
    })
}

const add = async (token, name, artist, type) => {
    const response = await axios.post(
        `${baseURL}/event`,
        {
            name,
            artist,
            type
        },

        {
            headers: { authorization: token }
        }
    )
}

// Llamamos todas las funciones desde el IFI

(async () => {

    console.log(process.argv);

    try {
        await register(email, password);
        const token = await login(email, password);
        const events = await list(token);
        await add (token,'Marea-gira verano', 'Los marea','Concierto')
        console.log(events);

    } catch (e) {
        console.log(e);
    }
    console.log(e.response.status);

})()



// (async () => {

    // try {
    //     await axios.post('http://localhost:8000/user/', {
    //         email: 'raullopezhernando@gmail.com',
    //         password: '12345678'
    //     })

    // } catch (e) {
    //     console.log(e);
    //     console.log('Revise los parámetros');
    // }

    // try {
    //     const login = await axios.post('http://localhost:8000/user/login/', {
    //         email: 'raullopezhernando@gmail.com',
    //         password: '12345678'
    //     })

    //     const loginToken = login.data.token;
    //     console.log(loginToken);

    // }catch(e){
    //     console.log(e);
    //     console.log('Revise los parámetros');
    // }

//     const listarEventos = async (loginToken) => {
//         try {
//             const listEvents = await axios.get('http://localhost:8000/event', {
//                 header: { authorization: header }
//             })
//             console.log(listEvents);

//         } catch (e) {
//             console.log(e);
//             console.log('Revise los parámetros');
//         }
//     }

// })();

    // try {
    //     await axios.post('/user',{
    //     email: 'raullopezhernando@gmail.com',
    //     password: '12345678'
    //     })
    // } catch(e) {
    //     console.log('Revise los parámetros');
    // }













//axios.post('/user',{...});

//axios.post('/user/login',{...});

// axios.get('/event',{header:{authorization:'hajshdksjkasjdkjsasadsa'}})



