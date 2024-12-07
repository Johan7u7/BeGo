import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

// Conectar a la base de datos
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    console.log('Servidor MongoDB:', MONGO_URI);

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
