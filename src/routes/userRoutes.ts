import express from 'express';
import { registerUser, loginUser } from '../controllers/usersController';
import { authMiddleware } from '../middlewares/authMiddleware'; // Importa tu middleware de autenticación

const router = express.Router();

router.post('/register', registerUser); // Ruta para registrar un usuario
router.post('/login', loginUser); // Ruta para iniciar sesión

export default router;
