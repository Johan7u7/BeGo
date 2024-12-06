import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define el tipo de JwtPayload
interface CustomJwtPayload {
  userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Decodificar el token con type assertion
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey') as CustomJwtPayload;
    
    // Ahora TypeScript sabe que decoded tiene un userId
    req.userId = decoded.userId;

    // Llamar al siguiente middleware o ruta
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
