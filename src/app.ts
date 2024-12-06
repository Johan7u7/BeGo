import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

export default app;
