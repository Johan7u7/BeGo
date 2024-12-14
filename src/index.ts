import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import truckRoutes from './routes/trucksRoutes.js';
import locationRoutes from './routes/locationRoutes.js'; // Corregimos la importación de las rutas de ubicaciones

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

// Crear instancia de Express
const app = express();

// Middleware para analizar JSON
app.use(express.json());

// Conectar a la base de datos
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    console.log('Servidor MongoDB:', MONGO_URI);

    // Agregar las rutas de tu API
    app.use('/api/users', userRoutes);  // Rutas de usuarios
    app.use('/api/trucks', truckRoutes);  // Rutas de camiones
    app.use('/api/locations', locationRoutes);  // Rutas de ubicaciones

    // Configurar el puerto y el servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🔗 Endpoints disponibles:`);

      // Endpoints agrupados por tipo de recurso
      console.log(`--- Usuarios ---`);
      console.log(`   POST: http://localhost:${PORT}/api/users/register - Registro de usuarios`);
      console.log(`   POST: http://localhost:${PORT}/api/users/login - Inicio de sesión`);

      console.log(`--- Camiones ---`);
      console.log(`   POST: http://localhost:${PORT}/api/trucks/create - Crear un nuevo truck`);
      console.log(`   GET: http://localhost:${PORT}/api/trucks/list - Obtener todos los trucks`);
      console.log(`   GET: http://localhost:${PORT}/api/trucks/:id - Obtener un truck por su ID`);
      console.log(`   PUT: http://localhost:${PORT}/api/trucks/:id/update - Actualizar un truck por su ID`);
      console.log(`   DELETE: http://localhost:${PORT}/api/trucks/:id/delete - Eliminar un truck por su ID`);

      console.log(`--- Ubicaciones ---`);
      console.log(`   POST: http://localhost:${PORT}/api/locations/create - Crear una nueva ubicación`);
      console.log(`   GET: http://localhost:${PORT}/api/locations/list - Obtener todas las ubicaciones`);
      console.log(`   PUT: http://localhost:${PORT}/api/locations/:id/update - Actualizar una ubicación`);
      console.log(`   DELETE: http://localhost:${PORT}/api/locations/:id/delete - Eliminar una ubicación`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });
