Módulo NodeJS
=============

 * Presentación https://docs.google.com/presentation/d/1HpV3orb5CbdugxAnWHa6UgNNcUlVjVtxSa9AQuWa_Ro/edit#slide=id.g8091b3456f_0_0

Contenido del repositorio
=========================

### **Calculadora**
Este proyecto implementa un servicio de calculadora online, accesible mediante una sencilla API REST. Se introduce la lectura de variables de la `querystring` así como la gestión de algunos errores `http` muy comunes, como el `400 - bad request`, usado cuando los parámetros recibidos por el endpoint no son los correctos; o el `404 - not found`, usado para indicar que no se encuentra el recurso buscado.

Desarrollamos también un cliente de consola, que usa `axios` para realizar las peticiones REST y lee parámetros de la línea de comandos con `process.argv`. También vimos `commander` o `yargs` para acceder a la línea de comandos.

### **express-skeleton**
Se trata del código generado automáticamente por el [Generador de aplicaciones Express](https://expressjs.com/es/starter/generator.html). ¿Qué aprendimos aquí?

* uso de la librería `morgan` para hacer logs de las peticiones a la API REST
* uso de `routers express` para agrupar los endpoints en distintos ficheros
* gestión de errores

### **Puntos de interés**
En este proyecto desarrollamos el backend de un sistema que permite al usuario introducir puntos de interés agrupados en colecciones (restaurantes, cines, etc). Además, el sistema proporciona tres colecciones de puntos por defecto, playas con bandera azul, teatros y ayuntamientos, obtenidos de la web de `open data` de la Xunta de Galicia.

El desarrollo de este proyecto lo realizamos de manera incremental: al mismo tiempo que añadimos funcionalidades aprendemos nuevos conceptos/técnicas de `NodeJS` y de `ExpressJS`.

Qué hemos aprendido
==================
A continuación se enumera lo que hemos aprendido en este curso. Usadlo como referencia y buscar la información detallada en la presentación y en el código desarrollado.

* **Versionado**: aprendimos `semantic versioning` como método para versionar las librerías. Se trata del mecanismo usado por `npm` para indicar qué versión de los paquetes debe descargarse.

* **package.json y package-lock.json**: estudiamos cómo gestiona `NodeJS` las versiones de los paquetes gracias a estos dos ficheros. 

* **Patrón petición-respuesta**: el cliente envía un mensaje `http` y el servidor responderá con una respuesta que incluirá un contenido y un código, `status code`.

* **API REST**: los servidores ofrecerán una API, esto es, una definición de cómo acceder a su funcionalidad, de manera que los clientes no tienen que saber los detalles de implementación del servidor, tan solo la definición de su API. En una API REST se modela el sistema en base a una serie de recursos que podemos listar, crear, modificar o eliminar. Estas acciones se corresponden con los métodos REST más usados: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`

* **Middlewares de ExpressJS**. Funciones de callback que se ejecutan en cada endpoint (sin necesidad de añadir código a los endpoints). Lo usamos para CORS, para logging, y veremos que se usan también para cuestiones de autenticación. 

* **CORS**. Mecanismo de seguridad que impide a una página web realizar una petición REST desde Javascript a un servidor distinto al suyo propio (desde una página en www.midominio.com no podemos realizar una petición a www.otrodominio.es). En `expressjs` solucionamos esto con un middleware.

* **Logging**. Hemos estuadiado la importancia de los logs. Si bien no aportan funcionalidad a nuestra aplicación, son de vital importancia para validar, en producción, que todo funciona correctamente y, en su caso, averiguar la causa de los errores reportados. Para esta tarea usamos `winston`. Vimos también `morgan` para el caso concreto de loguear peticiones REST.

* **Caché**, hemos usado una librería que nos proporciona una caché sobre `axios`, esto es, aquellas peticiones a la misma URL realizadas antes que un determinado tiempo, reutilizarán la misma respuesta. De esta manera ahorramos ancho de banda, aunque corremos el riesgo de usar datos que no están actualizados.

* **Adaptación de formatos**. Cuando obtenemos datos de distintas fuentes es probable que su formato no sea uniforme. Hemos sufrido este problema al acceder a distintas ficheros obtenidos de la Xunta. Para facilitar la programación de la aplicación que usará esos datos, programamos conversores que traducen el código a un formato único.

* **Configuración**. Aprendimos a usar variables de entorno desde el código (con `process.env`) y a gestionarlas de manera sencilla desde un fichero `.env` con el paquete `dotenv`. Estudiamos también otros mecanismos de configuración, como por ejemplo, usar `json` distintos para producción y desarrollo, con el paquete `config`.

Entregables
===========
Enunciados de los ejercicios entregables semanales:

* **Semana 1**: Cálculo de cuota mensual de un préstamo. El objetivo del ejercicio es aprender a buscar librerías en `npmjs` y usarlas correctamente desde nuestra aplicación.
* **Semana 2**: Gestión de eventos. El objetivo es entender qué es una `API REST` e implementar un endpoint `GET` y otro `POST`. 
* **Semana 3**:
