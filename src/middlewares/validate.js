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
exports.validaHeaders = void 0;
const logger_js_1 = require("../utils/logger.js");
const validateesquema_js_1 = __importDefault(require("../utils/validateesquema.js"));
const generales_js_1 = __importDefault(require("../config/esquemas/generales.js"));
const codigos_http_js_1 = require("../config/codigos_http.js");
const respuesta_js_1 = __importDefault(require("../config/respuesta.js"));
const validaHeaders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log de parámetros para depuración
        const parametros = {
            "query": req.query,
            "path": req.params,
            "body": req.body,
            "headers": req.headers
        };
        logger_js_1.logger.debug('Parametros:' + JSON.stringify(parametros));
        // Validación de los headers con el esquema correspondiente
        const respuesta = yield validateesquema_js_1.default.validarSchema(req.headers, generales_js_1.default.headerEsquema);
        const respApiJson = Object.assign({}, respuesta_js_1.default);
        // Si hay un error en la validación, enviar respuesta con código 400
        if (respuesta.error && Array.isArray(respuesta.error)) {
            // Mapeamos los errores de validación y los añadimos al arreglo 'errores'
            const errores = respuesta.error.map((err) => ({
                code: err.code || '000', // Ajusta según tu esquema de error
                message: err.message || 'Error en los headers'
            }));
            respApiJson.codigo = codigos_http_js_1.HTTP_CODIGOS._400.contexto._010.codigo;
            respApiJson.mensaje = codigos_http_js_1.HTTP_CODIGOS._400.contexto._010.mensaje;
            respApiJson.errores = errores;
            res.status(codigos_http_js_1.HTTP_CODIGOS._400.estatus).send(respApiJson);
        }
        else {
            next();
        }
    }
    catch (error) {
        const respApiJson = Object.assign({}, respuesta_js_1.default);
        respApiJson.codigo = codigos_http_js_1.HTTP_CODIGOS._500.contexto._010.codigo;
        respApiJson.mensaje = codigos_http_js_1.HTTP_CODIGOS._500.contexto._010.mensaje;
        respApiJson.errores = [{ code: '500', message: 'Error interno del servidor' }];
        res.status(codigos_http_js_1.HTTP_CODIGOS._500.estatus).send(respApiJson);
    }
});
exports.validaHeaders = validaHeaders;
exports.default = { validaHeaders: exports.validaHeaders };
