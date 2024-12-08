import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import esquema from '../utils/validateesquema.js';
import headers from '../config/esquemas/generales.js';
import { HTTP_CODIGOS } from '../config/codigos_http.js';
import respJSON, { ErrorDetail } from '../config/respuesta.js';

export const validaHeaders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Log de parámetros para depuración
    const parametros = {
      "query": req.query,
      "path": req.params,
      "body": req.body,
      "headers": req.headers
    };
    logger.debug('Parametros:' + JSON.stringify(parametros));

    // Validación de los headers con el esquema correspondiente
    const respuesta = await esquema.validarSchema(req.headers, headers.headerEsquema);
    const respApiJson = { ...respJSON };

    // Si hay un error en la validación, enviar respuesta con código 400
    if (respuesta.error && Array.isArray(respuesta.error)) {
      // Mapeamos los errores de validación y los añadimos al arreglo 'errores'
      const errores: ErrorDetail[] = respuesta.error.map((err: any) => ({
        code: err.code || '000',  // Ajusta según tu esquema de error
        message: err.message || 'Error en los headers'
      }));

      respApiJson.codigo = HTTP_CODIGOS._400.contexto._010.codigo;
      respApiJson.mensaje = HTTP_CODIGOS._400.contexto._010.mensaje;
      respApiJson.errores = errores;

      res.status(HTTP_CODIGOS._400.estatus).send(respApiJson);
    } else {
      next();
    }
  } catch (error) {
    const respApiJson = { ...respJSON };
    respApiJson.codigo = HTTP_CODIGOS._500.contexto._010.codigo;
    respApiJson.mensaje = HTTP_CODIGOS._500.contexto._010.mensaje;
    respApiJson.errores = [{ code: '500', message: 'Error interno del servidor' }];
    res.status(HTTP_CODIGOS._500.estatus).send(respApiJson);
  }
};

export default { validaHeaders };
