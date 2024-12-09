*** Descripción del Proyecto ***
Esta API fue desarrollada para gestionar locations, usuarios y trucks,
permitiendo vincular ubicaciones como origen o destino en órdenes de transporte.

*** Funcionalidades principales: ***

*** Gestión de Usuarios ***

- Registro y autenticación de usuarios con JWT.
- Registro unico de usuario.
- Login regresa JWT del usuario

*** Gestión de Trucks ***

- Asociar vehículos a los usuarios registrados.
- CRUD completo para administrar la información de los trucks.
- Validaciones para un solo camion con las mismas placas.

*** Gestión de Locations: ***

- Crear locations a partir de place_id de Google Maps.
- Validar que no existan duplicados en la base de datos.



*** Cómo se desarrolló ***

*** Enfoque del desarrollo: ***

Arquitectura:
La API sigue una estructura modular con separación de responsabilidades 
en controladores, modelos, rutas y middlewares.

***  Validación de Datos *** 

- Uso de middlewares para validar los datos enviados en las solicitudes y asegurar la integridad.
- Validación de tokens JWT para proteger rutas sensibles.
- Integración con Google Maps API

Para obtener información de las locations a partir de place_id, se implementó un DAO encargado de interactuar con la API de Google Maps.


*** Modelo de Datos ***

- Usuarios: Gestión de información y autenticación.
- Locations: Manejo de coordenadas, direcciones y place_id.
- Trucks: Asociación de vehículos a usuarios con validaciones específicas.


*** Cómo usar la API ***

Requisitos

Node.js (versión 16 o superior)
MongoDB (instancia local o en la nube)


.env

PORT=5001
MONGO_URI=mongodb+srv://JohanBeGo:D4C7DD5880@bego2024.lku7k.mongodb.net/?retryWrites=true&w=majority&appName=BeGo2024
JWT_SECRET=643066ea9e47ae386d13ea73f766e6e44466bf1bc4b08bce65b7b7f9ab8b57dad010f6cee4f59d2841bbfde8de3752c56cc380379b720d44de457c05f541a4c6
GOOGLE_MAPS_API_KEY=AIzaSyDooQU6uVkyL3pvlMyBFGUCFgGCFo9r5lY



*** Instalación ***

*** Clona este repositorio:***

https://github.com/Johan7u7/BeGo.git



*** Instala las dependencias: ***

npm install


*** Configura las variables de entorno en un archivo .env: ***

env

PORT=3000
MONGO_URI=mongodb://localhost:27017/projectDB
JWT_SECRET=clave_secreta_para_jwt
GOOGLE_API_KEY=tu_clave_api_de_google_maps


*** Realiza la build de el proyecto ***

npm run build


*** Inicia el servidor: ***

npm run dev



*** Rutas y Endpoints ***

*** Usuarios *** 
Registro: POST /api/users/register
Login: POST /api/users/login

*** Trucks ***
Crear un truck: POST /api/trucks/create
Listar trucks: GET /api/trucks/list
Obtener truck por ID: GET /api/trucks/:id
Actualizar truck: PUT /api/trucks/:id/update
Eliminar truck: DELETE /api/trucks/:id/delete

*** Locations ***  {NO FUNCTIONAL}
Crear una location: POST /api/locations/create
Listar locations: GET /api/locations/list
Obtener location por place_id: GET /api/locations/:place_id
Actualizar location: PUT /api/locations/:place_id/update
Eliminar location: DELETE /api/locations/:place_id/delete


*** Headers en postman ***
Es necesario el uso de estos headers para el correcto uso de la API y no haya problemas recuerda 
el contenido del .env

key                           Value

idsession                   JWT VALUE
identificador_usuario       id_user
nombre_aplicativo           Postman


*** Bodies para Postman *** 

*** Usuarios ***

Registro:

Ruta: POST /api/users/register
Body:
{
    "username": "usuario1",
    "password": "password123",
    "email": "usuario@example.com"
}

Login:

{
    "email": "usuario@example.com",
    "password": "password123"
}


Trucks

Crear:
{
    "userId": "id_usuario",
    "year": "2022",
    "color": "Rojo",
    "plates": "ABC1234"
}

Actualizar:
{
    "year": "2023",
    "color": "Azul",
    "plates": "DEF5678"
}


*** Cómo probar la API *** 
1.- Usa herramientas como Postman o Insomnia.
2.- Inicia sesión con un usuario registrado para obtener el token JWT.
3.- Usa el token en el encabezado idsession: <JWT> para acceder a las rutas protegidas.
4.- Prueba las rutas

*** Conclusión ***

Desafíos abordados:
Garantizar la unicidad de las locations usando place_id.
Integrar la API de Google Maps para obtener datos en tiempo real.
Implementar autenticación JWT para proteger recursos.

Ventajas:
Arquitectura modular y escalable.
Uso de TypeScript para mejorar la robustez del código.
CRUD completo para cada dominio, con validaciones específicas.

¡Gracias por revisar este proyecto!

*** Dejo la coleccion de POSTMAN para su correcta revision ***

BeGo.postman_collection.json

Johan Ali Leon Miranda 👍