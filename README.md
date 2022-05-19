# DESARROLLO DE UNA APLICACIÓN DE VISITAS PARA EL REAL JARDÍN BOTÁNICO

Este trabajo tiene como objetivo proporcionar a los visitantes del Real Jardín Botánico de Madrid una mejor experiencia durante el recorrido dentro de las instalaciones, y a su vez facilitar una herramienta donde consultar sus últimas novedades e información relativa a la gran colección de plantas que contiene.

Existe una serie de necesidades con las que se pueden encontrar los visitantes del Real Jardín Botánico de Madrid, que actualmente se están cubriendo con elementos analógicos como pueden ser mapas físicos o carteles informativos. Dado que aunque hace tiempo existieron herramientas digitales que se usaron para este fin, ya no están en uso. Entonces surgeuna necesidad a cubrir, puesto que la tecnología puede ayudar a resolver estas necesidades.

Gracias a este trabajo, los usuarios disponen de una forma sencilla de acceso a una lista de plantas, puntos de interés e itinerarios con información característica, junto con la opción de visualizar su posición en el mapa o iniciar una ruta guiada. Además, el usuario tiene la posibilidad de buscar cuál es la planta que tiene delante mediante la realización de una fotografía.

Para la implementación de este trabajo de fin de grado se ha desarrollado un sistema compuesto por una aplicación para dispositivos Android que hace uso de la información añadida en la base de datos mediante una aplicación web que funciona como gestor de contenidos.


### Pre-requisitos 📋



### Instalación 🔧



## Construido con 🛠️

* [React](https://es.reactjs.org/) es una biblioteca de código abierto creada por Meta Platforms para el lenguaje Javascript diseñada para crear interfaces de usuario para aplicaciones web de una sola página de forma sencilla. Está basada en componentes, que representan elementos de la interfaz que manejan su propio estado y se actualizan y renderizan al cambiar sus propiedades.
En este proyecto se utiliza React como base de la aplicación web de gestión de contenido, para poder hacer una aplicación de una sola página, se decidió hacer uso de esta famosa librería dado su alto nivel de uso y la cantidad de guías y documentación que pone a disposición del desarrollador.

* [React Native](https://reactnative.dev/) es un framework de código abierto creado por Meta Platforms para el lenguaje Javascript pensado para crear aplicaciones para dispositivos móviles con independencia de su sistema operativo, pudiendo ser este Android, Android TV, iOS, macOS o tvOS. Las principales ventajas que otorga este marco de desarrollo son similares a las que presenta React, dado que comparten la forma de desarrollo basada en componentes, añadiendo la posibilidad de utilizar módulos nativos escritos directamente en Android o iOS. React Native supone el marco de trabajo de la aplicación móvil de este proyecto, habiendo sido seleccionada debido a sus similitudes con React y a la pequeña curva de aprendizaje que este framework presenta.

* [Redux](https://es.redux.js.org/) es una librería Javascript de código abierto para el manejo del estado global de las aplicaciones. Sigue un flujo en el que un componente recibe un evento y emite una acción que es enviada a la store donde se almacena el estado global. La store comunica la acción junto con el estado actual de los reducers y estos a su vez, devuelven un nuevo estado modificado en base a la acción. Por último los componentes se actualizan con el nuevo estado de la store. Esta librería es utilizada comúnmente junto con React debido a que React no cuenta con un sistema para gestionar el estado global de la aplicación, tan solo el de los componentes, por lo que en este proyecto se hace uso de la misma para gestionar el estado global de la aplicación de gestión de contenido, en la que se almacena la información de la sesión del usuario administrador, que es común a cualquier componente de la aplicación.


* [JQuery](https://es.wikipedia.org/wiki/HTML5) es una biblioteca creada por John Resig que permite simplificar la forma de interactuar con los documentos HTML y el manipulado del DOM de la página. Además, esta permite el manejo de eventos, desarrollo de animaciones y el uso de Javascript asíncrono (AJAX) de una manera simplificada para los desarrolladores. Esta librería se utiliza en la aplicación de gestión de contenido para manipular algunos componentes de Bootstrap de forma más sencilla.

* [Firebase](https://firebase.google.com/) es una plataforma para el desarrollo de aplicaciones tanto web como móviles perteneciente a Google. Está ubicada en la nube e integrada con Google Cloud Platform, ya que usa un conjunto de herramientas del mismo para la creación y sincronización de proyectos. Cuenta con un gran número de ventajas como: una sencilla sincronización de los datos de los proyectos sin necesidad de escribir una lógica compleja, el uso de herramientas multiplataforma, el uso de la infrastructura de Google para un escalado automático para cualquier tipo de aplicación y su característica más destacable, poder crear proyectos sin necesidad de mantener un servidor. Dentro de Firebase existen varios servicios, de entre los que se utilizan en este proyecto: Firestore (base de datos no relacional basada en documentos), Storage (almacenamiento de ficheros), Hosting (alojamiento de aplicaciones web) y Authentication (autenticación de usuarios).

* [Mapbox](https://www.mapbox.com/) es un proveedor de mapas en linea realizados por encargo para diversas páginas web. Esta empresa pone a disposición de los desarrolladores un gran número de herramientas, tanto para la creación de mapas personalizados con Mapbox Studio como para añadir mapas a tus aplicaciones o guías de navegación con instrucciones paso por paso mediante su SDK. En este proyecto se hace uso de varias librerías que consultan a Mapbox la información geográfica correspondiente y su posterior renderización en un mapa.

* [Plant.id](https://plant.id/) es un servicio de identificación de plantas basado en machine learning. Consiste en realizar una fotografía, enviarla a su servidor y obtener posteriormente una respuesta con varias opciones posibles ordenadas por un valor de probabilidad. En la funcionalidad de reconocimiento de plantas de la aplicación móvil se hace uso de la API que ofrece esta empresa.

* [Axios](https://axios-http.com/docs/intro) es una librería Javascript que puede ejecutarse en el navegador y permite hacer cualquier operación HTTP, siendo común su uso para el consumo de API REST que devuelvan datos JSON por la simplicidad que ofrece a la hora de hacer peticiones. Esta librería se utiliza para hacer consultas a algunas APIs como Google Translate en la aplicación móvil.
