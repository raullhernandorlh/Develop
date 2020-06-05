let collection = {
    'theater': [],
    'beaches': [],
    'council': []
}

let globalId = 0;

const createList = (name) => {
    if (collection[name.toLowerCase()] !== undefined) {
        throw 'already-exists';
    } else {
        collection[name.toLowerCase()] = [];
    }
}

const addPointOfInterest = (listName, data) => {

    if (data.coordenadas === undefined ||
        data.concello === undefined ||
        data.provincia === undefined ||
        data.web === undefined) {
        throw 'missing-data'
    }

    if (collection[listName.toLowerCase()] === undefined) {
        throw 'unknown-list';
    }

    const isEqual = (item) => {
        // ...
        // return (true|false) 
        // TODO!!!
        return false
    }

    // comprobar si el nuevo elemento ya existía
    const equalElements = collection[listName.toLowerCase()].filter(isEqual);
    if (equalElements.length !== 0) {
        throw 'already-exists';
    }

    let formattedData = {
        id: globalId++,
        concello: data.concello,
        coordenadas: data.coordenadas,
        web: data.web,
        provincia: data.provincia,
        datos: {
            nome: data.nome
        }
    }

    collection[listName.toLowerCase()].push(formattedData);

    return formattedData.id;
}

const deletePointOfInterest = (listName, id) => {
    if (collection[listName.toLowerCase()] === undefined) {
        throw 'unknown-list';
    }

    if (collection[listName].find(item => item.id === id) === undefined) {
        throw 'unknown-point'
      }
    
    collection[listName] = collection[listName].filter( item => item.id !== id);
    
}

const getListNames = () => {
    return Object.keys(collection);
}


module.exports = {
    addPointOfInterest,
    createList,
    deletePointOfInterest,
    getListNames
}
