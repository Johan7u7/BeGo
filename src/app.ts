import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

export default app;
