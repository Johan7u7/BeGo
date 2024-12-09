import express from 'express';
import userRoutes from './routes/userRoutes.js';
import truckRoutes from './routes/trucksRoutes.js';

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/trucks', truckRoutes);
export default app;
