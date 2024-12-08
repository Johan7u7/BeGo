import { Request, Response, NextFunction } from 'express';
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
