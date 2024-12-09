import winston from 'winston';
import 'winston-daily-rotate-file';
import moment from 'moment-timezone';
import httpContext from 'express-http-context';
import os from 'os';

// Extraemos los formatos de winston
const { splat, combine, timestamp, printf } = winston.format;
const hostname = os.hostname();

// Formato personalizado para los logs
const myFormat = printf(({ level, message, meta }) => {
    const idTrackingReq = httpContext.get('idTrackingReq');
    const fecha = moment().tz('America/Mexico_City');
    return `${fecha.format('YYYY-MM-DD HH:mm:ss')}|${level}|${idTrackingReq}|${message}${meta ? JSON.stringify(meta) : ''}`;
});

// Configuración de los transportes
const transports = {
    console: new winston.transports.Console({
        level: 'info',   // Nivel de log en consola
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.colorize(),   // Agrega color a los logs en consola
            winston.format.simple()      // Formato simple para la consola
        )
    }),
    file: new winston.transports.DailyRotateFile({
        filename: './logs/%DATE%/%DATE%_api-service-order_' + hostname + '.log',
        datePattern: 'YYYY-MM-DD',   // Patrón de fecha en los archivos de log
        level: 'debug',              // Nivel de log para archivo
        zippedArchive: true,         // Comprime los archivos antiguos
        maxSize: '20m'               // Tamaño máximo de archivo antes de rotar
    })
};

// Crear el logger con los formatos y transportes configurados
export const logger = winston.createLogger({
    format: combine(
        timestamp(),
        splat(),   // Soporta mensajes con %s de formato
        myFormat   // Nuestro formato personalizado
    ),
    transports: [
        transports.console,
        transports.file
    ]
});

// Configurar el stream para la escritura en logs (para usarse en express)
export const stream = {
    write: function (message: string) {
        logger.info(message);   // Escribe el mensaje de log con nivel 'info'
    }
};
