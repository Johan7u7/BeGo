import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/userRoutes'; // Asegúrate de importar las rutas

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

    // Aquí puedes agregar las rutas de tu API
    app.use('/api/users', userRoutes); // Asegúrate de que esta ruta esté bien configurada

    // Configurar el puerto y el servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🔗 Endpoints disponibles:`);
      console.log(`   POST: http://localhost:${PORT}/api/users/register - Registro de usuarios`);
      console.log(`   POST: http://localhost:${PORT}/api/users/login - Inicio de sesión`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });
