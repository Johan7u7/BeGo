import express from 'express';
import { registerUser, loginUser } from '../controllers/usersController';
import { authMiddleware } from '../middlewares/authMiddleware'; // Importa tu middleware de autenticación

const router = express.Router();

router.post('/register', registerUser); // Ruta para registrar un usuario
router.post('/login', loginUser); // Ruta para iniciar sesión

// Ruta protegida: solo accesible con token válido
router.get('/profile', authMiddleware, (req, res) => {
  // Aquí accedes a req.userId gracias al middleware de autenticación
  res.status(200).json({ message: 'User profile', userId: req.userId });
});

export default router;
