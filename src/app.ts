import express from 'express';
import truckRoutes from './routes/locations.js';

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/trucks', truckRoutes);

export default app;
