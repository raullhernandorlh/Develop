// Solo para los usuarios que crea el usuario no para los datos de la Xunta

let collection = {
    'theater': [],
    'beaches': [],
    'council': []
  }


  const createList = () =>{
      collection[collectionName.toLowerCase()] = []
  }

  const getListNames = () => {
    return Object.keys(collection);
  }

  const hasList = (name) =>{
    return (collection[name.toLowerCase()] !== undefined);
  }
  module.exports = {
      getListNames,
      hasList
  }