import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import truckRoutes from './routes/trucksRoutes.js';  // Importa tus rutas de trucks
import express from 'express';


dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

// Conectar a la base de datos
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    console.log('Servidor MongoDB:', MONGO_URI);

    // Configurar el puerto y el servidor
    const PORT = process.env.PORT || 3000;

    // Registrar las rutas en la aplicación
    app.use('/api/trucks', truckRoutes);  // Usar las rutas de trucks

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🔗 Endpoints disponibles:`);
      console.log(`   POST: http://localhost:${PORT}/api/trucks/create - Crear un nuevo truck`);
      console.log(`   GET: http://localhost:${PORT}/api/trucks/list - Obtener todos los trucks`);
      console.log(`   GET: http://localhost:${PORT}/api/trucks/:id - Obtener un truck por su ID`);
      console.log(`   PUT: http://localhost:${PORT}/api/trucks/:id/update - Actualizar un truck por su ID`);
      console.log(`   DELETE: http://localhost:${PORT}/api/trucks/:id/delete - Eliminar un truck por su ID`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });
