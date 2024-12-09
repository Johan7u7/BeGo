import Ajv, { ValidateFunction } from 'ajv';
import { logger } from '../utils/logger.js';
import esquemasGenerales from '../config/esquemas/generales.js';
import { HTTP_CODIGOS } from '../config/codigos_http.js';

// Definir los tipos para los errores
interface ErrorDetail {
    code: string;
    message: string;
}

// Definir el tipo para la respuesta de la validación
interface ValidacionRespuesta {
    bodyJson: any;
    error?: ErrorDetail[];
}

// Función para validar parámetros generales
async function validaParametrosGrl(bodyJson: any, esquema: keyof typeof esquemasGenerales): Promise<ValidacionRespuesta> {
    const detalles: ErrorDetail[] = [];
    const ajv = new Ajv({ allErrors: true });
    const schema = esquemasGenerales[esquema];

    if (!schema) {
        throw new Error(`El esquema '${esquema}' no existe en los esquemas generales.`);
    }

    const valido = ajv.validate(schema, bodyJson);

    if (!valido && ajv.errors) {
        ajv.errors.forEach((error: any) => {
            logger.debug('Error en schema: ' + JSON.stringify(error));
            detalles.push({ code: error.keyword || '000', message: error.message || 'Error desconocido' });
        });
    }

    return valido
        ? { bodyJson }
        : { bodyJson, error: detalles };
}

// Función para validar los parámetros en el body, headers y query
const validarParametros = async function (bodyJson: any, dato: any): Promise<any> {
    const respuesta = {
        body: undefined as ValidacionRespuesta | undefined,
        header: undefined as ValidacionRespuesta | undefined,
        query: undefined as ValidacionRespuesta | undefined,
    };

    if (dato.header?.requerido) {
        respuesta.header = await validaParametrosGrl(bodyJson.headers, dato.header.valor);
        if (respuesta.header?.error) {
            return {
                codigo: HTTP_CODIGOS._400.contexto._010.codigo,
                mensaje: HTTP_CODIGOS._400.contexto._010.mensaje,
                detalle: respuesta.header.error,
            };
        }
    }

    if (dato.body?.requerido) {
        respuesta.body = await validaParametrosGrl(bodyJson.body, dato.body.valor);
        if (respuesta.body?.error) {
            return {
                codigo: HTTP_CODIGOS._400.contexto._011.codigo,
                mensaje: HTTP_CODIGOS._400.contexto._011.mensaje,
                detalle: respuesta.body.error,
            };
        }
    }

    if (dato.query?.requerido) {
        respuesta.query = await validaParametrosGrl(bodyJson.query, dato.query.valor);
        if (respuesta.query?.error) {
            return {
                codigo: HTTP_CODIGOS._400.contexto._011.codigo,
                mensaje: HTTP_CODIGOS._400.contexto._011.mensaje,
                detalle: respuesta.query.error,
            };
        }
    }

    return respuesta;
};


// Función para validar el esquema completo
const validarSchema = async function (bodyJson: any, esquema: object): Promise<ValidacionRespuesta> {
    const detalles: ErrorDetail[] = [];
    const ajv = new Ajv({ allErrors: true });

    const valido = ajv.validate(esquema, bodyJson);

    if (!valido && ajv.errors) {
        ajv.errors.forEach((error: any) => {
            logger.debug('Error en schema: ' + JSON.stringify(error));
            detalles.push({ code: error.keyword || '000', message: error.message || 'Error desconocido' });
        });
    }

    return valido
        ? { bodyJson }
        : { bodyJson, error: detalles };
};

export default { validarParametros, validaParametrosGrl, validarSchema };
