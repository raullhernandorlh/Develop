// Solo para los usuarios que crea el usuario no para los datos de la Xunta

let collection = {
  'theater': [],
  'beaches': [],
  'council': []
}

let globalId = 0;

// CREATE LIST
const createList = (name) => {
  // Si la lista esta definida lanzamos un throw 'already-exists' sino la creamos
  if (collection[name.toLowerCase()] !== undefined) {
    throw 'already-exists';
  } else {
    collection[name.toLowerCase()] = [];
  }
}

// GET LIST NAMES


const getListNames = () => {
  return Object.keys(collection);
}

const hasList = (name) => {
  return (collection[name.toLowerCase()] !== undefined);
}


// ADD POINT OF INTEREST

const addPointOfInterest = (listName, data) => {

  if (data.coordenadas === undefined ||
    data.concello === undefined ||
    data.provincia === undefined ||
    data.web === undefined) {
    throw 'missing-data'
  }

  if (collection[listName().toLowerCase()] === undefined) {
    throw 'unknow-list'
  }

  const isEqual = (item) => {
    // ...
    // return (true|false) 
    // TODO!!!
    return false
  }

  // comprobar si el nuevo elemento ya existía
  const equalElements = collection[listName].filter(isEqual);
  if (equalElements.length !== 0) {
    res.status(409).send();
    return;
  }

  let formattedData = {
    id: globalId++,
    concello: data.concello,
    coordenadas: data.coordenadas,
    web: data.body.web,
    provincia: data.provincia,
    datos: {
      nome: data.nome
    }
  }

  collection[listName].push(formattedData);

  return formattedData.id;

}

// DELETE POINT OF INTEREST


const deletePointOfInterest = (collectionName, id) => {

  if (collection[collectionName] === undefined) {
    throw 'unknow-list';
  }

  if (collection[collectionName].find(item => item.id === id) === undefined) {
    throw 'unknow-point';
  }

  collection[collectionName] = collection[collectionName].filter(item => item.id !== id);

}

// TODO A CORREGIR EN CLASE

const updatePointOfInterest = (collectionName, id, data) => {

  if (collection[collectionName] === undefined) {
    throw 'unknow-collection' // 400
  }

  if (data.coordenadas === undefined ||
    data.concello === undefined ||
    data.provincia === undefined ||
    data.web === undefined) {
    throw 'undefined-body-parameter' // 404
  }

  let searchedElement = collection[collectionName].find(item => item.id === id);
  if (searchedElement === undefined) {
    throw ('undefined searched-element') // 404
  }

  searchedElement.concello = data.concello;
  searchedElement.coordenadas = data.coordenadas;
  searchedElement.web = data.web;
  searchedElement.provincia = data.provincia;
  searchedElement.datos = data.datos;

  return data;
}

const patchPointOfInterest = (collectionName, id, data) => {

  if (collection[collectionName] === undefined) {
    throw 'unknow-collection' // 404
  }

    let searchedElement = collection[collectionName].find(item => item.id === id);
    if (searchedElement === undefined) {
      throw 'unknow-searched-element' // 404
    }

    const bodyParams = Object.keys(data);

    for (let param of bodyParams) {
      searchedElement[param] = data[param];
    }

    return data;
  }


module.exports = {
  getListNames,
  createList,
  addPointOfInterest,
  deletePointOfInterest,
  updatePointOfInterest,
  patchPointOfInterest
}