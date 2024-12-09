import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Función para verificar el token de manera síncrona
const comprobarToken = (userToken: string): any => {
    try {
        // Verificación síncrona del token utilizando la clave secreta desde .env
        console.log('La clave secreta es:', process.env.JWT_SECRET || 'default_secret');
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET || 'default_secret');
        return decoded; // Devuelve el token decodificado si es válido
    } catch (err) {
        return false; // Devuelve false si hay un error (token inválido o expirado)
    }
};

// Función para firmar un token con fecha de expiración y configuración
const signToken = (expires: string, config: object): string => {
    return jwt.sign(
        { config }, // Información a incluir en el payload
        process.env.JWT_SECRET || 'default_secret', // Clave secreta para firmar el token desde .env
        { expiresIn: expires } // Tiempo de expiración
    );
}

export default { comprobarToken, signToken };
