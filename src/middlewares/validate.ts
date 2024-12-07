import { Request, Response, NextFunction } from 'express';

const validateHeader = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Obtener el token del encabezado Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // El formato esperado es "Bearer <token>"

    if (!token) {
      res.status(403).json({ message: 'Acceso denegado. No se proporcionó el token.' });
      return; // Detener la ejecución
    }

    // Agregar el token al objeto request
    req.token = token;

    // Pasar al siguiente middleware
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al validar el token', error });
  }
};

export default { validateHeader };
