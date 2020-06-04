const turf = require('@turf/turf');

function calculateDistance(longitude, latitude, longitude2, latitude2) {
    const point1 = turf.point([longitude, latitude]);
    const point2 = turf.point([longitude2, latitude2]);
  
    return turf.distance(point1, point2);
}
  
/**
 * 
 * Devuelve la playa más cercana a las coordenadas indicadas
 * 
 */
function getCloseBeachTo(lines, longitude, latitude) {
// recorro todas las playas. En cada uno comparo si la distancia
// es mayor o menor que la que hasta ese momento sé que es la más corta

const COORDINATES_POSITION = 9;
const BEACH_NAME_POSITION = 4;

// Voy a guardar el índice de la playa más cercana. Cada vez
// que encuentre alguna otra más cercana, la actualizo.
// Este índice lo inicializo a 1, porque es donde está la primera playa
// (el 0 es la cabecera)
let shortestBeachIndex = 1;
let minDistance = 100000000000;

for (let lineIndex = 2; lineIndex < lines.length; lineIndex++) {
    const fields = lines[lineIndex].split(';');

    if (fields.length < 2) {
    // línea con separadores pero sin datos
    continue;
    }

    const coordinates = fields[COORDINATES_POSITION].split(',');

    if (coordinates.length < 2) {
    // línea sin coordenadas
    continue
    }
    const lineLongitude = coordinates[1];
    const lineLatitude = coordinates[0];

    const distance = calculateDistance(longitude, latitude, lineLongitude, lineLatitude)

    if (distance < minDistance) {
    minDistance = distance;
    shortestBeachIndex = lineIndex;
    }

}

return lines[shortestBeachIndex].split(';')[BEACH_NAME_POSITION];
}
  
function getTotalNumberOfBeaches(lines) {
// sabiendo que cada línea contiene una sola playa, 
// el problema consiste en contar cuántas líneas hay.
// Sin embargo, hay línea que no debemos contar:
//     - la primera, ya que es la cabecera del fichero
//     - las que están vacías
//     - las que tienen separadores pero no tienen playa (;;;;;;)
let counter = 0;

for (let lineIndex = 1; lineIndex < lines.length; lineIndex++) {
    let fields = lines[lineIndex].split(';');

    // si el split nos da una sola entrada, es que no había campos, así que
    // no cuento esta línea
    // if (fields.length <= 1) {
    //  continue; // instrucción para pasar a la siguiente iteracción del bucle.
    //}

    // Si habiendo campos, están vacíos, no los contamos tampoco.
    // Vamos a coger el primer campo como referencia
    // Uso la función 'trim()', que elimina espacios al principio
    // y al final de la palabra. De esta forma, me da igual que haya '   ' o '',
    // ya que después de aplicar el trim() su longitud será 0
    if (fields[0].trim().length == 0) {
        continue;
    }

}

return counter;
}

/**
 * 
 * Devuelve un array con los `count` ayuntamientos
 * con más playas. 
 * 
 * Es decir, el primer elemento del array será el nombre
 * del ayuntamiento con más playas, el segundo elemento 
 * tendrá el nombre del segundo ayuntamiento con más playas, 
 * y así hasta `count`
 */
function getCouncilsWithMoreFlags(lines, count) {
// a priori no sabemos qué ayuntamientos hay, por tanto no podemos
// crear variables de tipo contador_Vigo, contador_Moaña, etc. En su 
// lugar crearemos un objeto al cual iremos añadiendo ayuntamientos 
// conforme los vayamos encontrando.
const COUNCIL_POSITION = 2;

let counters = {}

for (let line of lines) {
    const fields = line.split(';');
    const currentCouncil = fields[COUNCIL_POSITION];

    // comprobamos si nuestro objeto de contadores
    // ya tiene una entrada para el ayuntamiento de esta línea
    if (counters[currentCouncil] != undefined) {
    // como counters[currentCouncil] existe, entonces es que ya habíamos
    // encontramos antes una línea para este ayuntamiento, así que simplemente
    // incrementamos el contador
    counters[currentCouncil]++;
    } else {
    // en este caso es la primera vez que una línea contiene este ayuntamiento, 
    // así que inicializamos su contador a 1
    counters[currentCouncil] = 1;
    }
}

    // en este instante el objeto `counters` contiene el número de playas
    // de cada ayuntamiento. Por ejemplo, podría tener un aspecto así:
    // counters = {
    //     'Vigo': 10,
    //     'Nigrán': 8
    //}

    // lo que queremos ahora es quedarnos con aquellos de más playas. Si el parámetro
    // 'count' es, por ejemplo, 2, tendremos que devolver una array con los dos ayuntamientos
    // con más playas.

    // ¿Cómo buscamos en el objeto los ayuntamientos con más playas? Vamos a crear un array
    // de pares [ayuntamiento, número de playas]. Como los arrays tienen la función 'sort'
    // podremos usarla para ordenarla por número de playas.
    const listOfBeachesPerCouncil = Object.entries(counters);  // probad a pintar en pantalla esta variable
    console.log(listOfBeachesPerCouncil);

    // ordenamos por número de playas
    const listOfBeachesSorted = listOfBeachesPerCouncil.sort( (a,b) => b[1] - a[1]);

    // ahora que la lista está ordenada, nos quedamos con los primeros 'count' ayuntamientos
    const firstCountCouncils = listOfBeachesSorted.slice(0, count);

    // devolvemos solo los nombres
    return firstCountCouncils.map( council => council[0]);
}


/**
 * Devuelve el número de banderas azules para el 
 * ayuntamiento indicado
 * 
 * @param flags - Array con las líneas del CSV descargado
 * @param council - nombre del ayuntamiento buscado 
 */
function getNumberOfFlagsByCouncil(lines, council) {
    const COUNCIL_POSITION = 2;
    let contador = 0;

    // vamos a recorrer todas las líneas
    // en las que el ayuntamiento sea igual al que nos pasan como parámetro,
    // incrementaremos en uno el contador
    for (let line of lines) {

    let campos = line.split(';');    // para obtener el ayuntamiento, partimos la línea en sus campos

    if (campos[COUNCIL_POSITION] != undefined && campos[COUNCIL_POSITION].toUpperCase() == council.toUpperCase()) {

        // incrementamos el contador solo si el campo en la posición 2 coincide con el ayuntamiento
        // la comparación se hace en mayúsculas para asegurar que se contabilizan incluso 
        // si los nombres no coinciden exactamente (por ejemplo, que en el fichero ponga Vigo, 
        // y a la función le pasan vIGo como parámetro)
        contador++;
    }
    }

    return contador;
}

module.exports = {
    getNumberOfFlagsByCouncil,
    getCouncilsWithMoreFlags,
    getTotalNumberOfBeaches,
    getCloseBeachTo
}