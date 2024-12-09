"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaToken = void 0;
const token_js_1 = __importDefault(require("../utils/token.js")); // Importa tu función para verificar tokens
const BASE_URL = process.env.BASE_API || '/api/trucks';
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verificaToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mensajeError = 'Al menos existe un error.';
    const mensajeNoAuth = '"El usuario no tiene los permisos para el recurso."';
    try {
        const { method, route, headers } = req; // Desestructuración para hacer el código más limpio
        let userToken = headers.idsession; // Token enviado en el encabezado 'idsession'
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
        const idUser = headers.identificador_usuario;
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
        const decoded = token_js_1.default.comprobarToken(userToken); // Verifica el token con la clave de .env
        // Log: Verifica si el token es válido o no
        console.log('Decoded token:', decoded);
        if (decoded) {
            const fullUrl = `${BASE_URL}${route.path}`;
            console.log(`URL: ${fullUrl}, Metodo: ${method.toUpperCase()}`); // Logs para depuración
            next(); // Si el token es válido, pasa al siguiente middleware
        }
        else {
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
    }
    catch (error) {
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
});
exports.verificaToken = verificaToken;
