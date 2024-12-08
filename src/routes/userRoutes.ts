import express from 'express';
import { registerUser, loginUser } from '../controllers/usersController.js';
import { validateHeader, verifyJWT } from '../middlewares/authentication.js';

const router = express.Router();

// Ruta para registrar un usuario (no requiere autenticación)
router.post('/register', registerUser);

// Ruta para iniciar sesión (no requiere autenticación)
router.post('/login', loginUser);

// Ejemplo de una ruta protegida (requiere autenticación)
router.get('/profile', validateHeader, verifyJWT, (req, res) => {
    // Aquí puedes acceder a req.userId para obtener el ID del usuario autenticado
    res.status(200).json({ message: 'Ruta protegida', userId: req.userId });
});

export default router;
