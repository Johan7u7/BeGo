import express from 'express';
import truckRoutes from './routes/trucksRoutes.js';

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/trucks', truckRoutes);

export default app;
