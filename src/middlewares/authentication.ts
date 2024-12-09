import tokenApi from '../utils/token.js';  // Importa tu función para verificar tokens
const BASE_URL = process.env.BASE_API || '/api/trucks';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const ERROR_MESSAGES = {
    NO_TOKEN_PROVIDED: 'Acceso denegado. No se proporcionó el token.',
    INVALID_TOKEN_PAYLOAD: 'Invalid token payload',
    INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token',
    ERROR_VALIDATING_TOKEN: 'Error al validar el token',
};

export const handleError = (res: Response, error: any, statusCode: number) => {
    res.status(statusCode).json({ message: ERROR_MESSAGES.ERROR_VALIDATING_TOKEN, error });
};

export const castToError = (error: any): Error => {
    return error as Error;
};

export const validateHeader = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader: string | undefined = req.headers['authorization'];
        console.log(`Auth Header: ${authHeader}`);  // Log the authorization header
        const token: string | undefined = authHeader?.split(' ')[1];
        console.log(`Token from Header: ${token}`);  // Log the extracted token

        if (!token) {
            console.log(ERROR_MESSAGES.NO_TOKEN_PROVIDED);
            res.status(403).json({ message: ERROR_MESSAGES.NO_TOKEN_PROVIDED });
            return;
        }

        req.token = token;
        next();
    } catch (error) {
        console.error(`Error in validateHeader: ${error}`);  // Log the error
        handleError(res, error, 500);
    }
};

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token: string | undefined = req.token;
        console.log(`Token to Verify: ${token}`);  // Log the token to be verified

        if (!token) {
            console.log(ERROR_MESSAGES.NO_TOKEN_PROVIDED);
            res.status(401).json({ message: ERROR_MESSAGES.NO_TOKEN_PROVIDED });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log(`Decoded Token: ${JSON.stringify(decoded)}`);  // Log the decoded token

        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
            req.userId = (decoded as { userId: string }).userId;
            req.token = token;
            next();
        } else {
            console.log(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD);
            res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD });
        }
    } catch (error) {
        const errorCast: Error = castToError(error);
        console.error(`Error in verifyJWT: ${errorCast.message}`);  // Log the error
        res.status(401).json({ message: ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN, error: errorCast.message });
    }
};
export const verificaToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const mensajeError = 'Al menos existe un error.';
    const mensajeNoAuth = '"El usuario no tiene los permisos para el recurso."';

    try {
        const { method, route, headers } = req;  // Desestructuración para hacer el código más limpio
        let userToken = headers.idsession;  // Token enviado en el encabezado 'idsession'

        // Log: Verifica el token recibido
        console.log('Token recibido en el encabezado "idsession":', userToken);

        // Verifica si userToken es un arreglo, toma el primer valor si es el caso
        if (Array.isArray(userToken)) {
            userToken = userToken[0];
        }

        // Log: Verifica el tipo de token
        console.log('Token después de verificar su tipo:', userToken);

        // Si el userToken es undefined o no es un string, devuelve error
        if (typeof userToken !== 'string') {
            console.error('Error: El token no es válido o no fue proporcionado');
            res.status(400).json({
                codigo: 400,
                mensaje: mensajeError,
                errores: {
                    code: 400,
                    message: "El token de usuario no es válido o no fue proporcionado."
                }
            });
            return;
        }

        const idUser = headers.identificador_usuario as string;

        // Log: Verifica si el identificador de usuario está presente
        console.log('Identificador de usuario recibido:', idUser);

        // Verificar si se pasó el id del usuario
        if (!idUser) {
            console.error('Error: El identificador del usuario no fue proporcionado');
            res.status(400).json({
                codigo: 400,
                mensaje: mensajeError,
                errores: {
                    code: 400,
                    message: "El identificador del usuario no fue proporcionado."
                }
            });
            return;
        }

        // Verificar que el JWT_SECRET esté definido en el archivo .env
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error('Error: No se encontró la clave secreta JWT en las variables de entorno');
            res.status(500).json({
                codigo: 500,
                mensaje: mensajeError,
                errores: {
                    code: 500,
                    message: "No se encontró la clave secreta JWT en las variables de entorno."
                }
            });
            return;
        }

        // Log: Verifica si la clave secreta está correctamente cargada
        console.log('Clave secreta JWT cargada correctamente.');

        // Verificación del token
        const decoded = tokenApi.comprobarToken(userToken);  // Verifica el token con la clave de .env

        // Log: Verifica si el token es válido o no
        console.log('Decoded token:', decoded);

        if (decoded) {
            const fullUrl = `${BASE_URL}${route.path}`;
            console.log(`URL: ${fullUrl}, Metodo: ${method.toUpperCase()}`);  // Logs para depuración
            next();  // Si el token es válido, pasa al siguiente middleware
        } else {
            console.error('Error: El token no es válido');
            res.status(401).json({
                codigo: 401,
                mensaje: mensajeError,
                errores: {
                    code: 401,
                    message: mensajeNoAuth
                }
            });
        }
    } catch (error) {
        console.error('Error en el procesamiento del middleware:', error);
        res.status(500).json({
            codigo: 500,
            mensaje: mensajeError,
            errores: {
                code: 500,
                message: "Error Interno."
            }
        });
    }
};
