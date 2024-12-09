import { Request, Response, NextFunction } from 'express';
import Truck from '../models/Truck.js';  // Asegúrate de importar el modelo de Truck
import esquema from '../utils/validateesquema.js';  // Suponiendo que tienes una validación de esquema
import schema from '../config/esquemas/generales.js';
import { HTTP_CODIGOS } from '../config/codigos_http.js';  // Asegúrate de tener tus códigos HTTP definidos
import dao from '../dao/trucks/index.js';
import { Types } from 'mongoose';
import tokenApi from '../utils/token.js';  // Asegúrate de importar la función para validar el token

interface Respuesta {
    codigo: string;
    mensaje: string;
    errores?: any;
    resultado?: any;
}

// Crear un truck
export const createTruck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let respuesta: Respuesta = {
        codigo: HTTP_CODIGOS._200.contexto._000.codigo,
        mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
    };

    try {
        // Obtenemos el token de los headers
        const userToken = req.get('idsession') || '';  // Token enviado en el encabezado 'idsession'
        const idUser = req.headers.identificador_usuario as string;  // ID del usuario en los headers

        // Verificamos si se pasaron el token y el identificador de usuario
        if (!userToken || !idUser) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._012.codigo,
                mensaje: 'Faltan datos requeridos: idsession o identificador_usuario',
            };
            res.status(400).json(respuesta);
            return;
        }

        // Verificamos el token utilizando el JWT_SECRET
        const decoded = tokenApi.comprobarToken(userToken);

        if (!decoded) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._401.contexto._001.codigo,
                mensaje: 'Token inválido o expirado',
            };
            res.status(401).json(respuesta);
            return;
        }

        // Asegurarnos de que el 'user' sea un ObjectId válido
        if (!Types.ObjectId.isValid(idUser)) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._012.codigo,
                mensaje: 'ID de usuario no válido.',
            };
            res.status(400).json(respuesta);
            return;
        }

        const { year, color, plates } = req.body;

        // Verificar si el camión ya existe con las mismas placas
        const existingTruck = await Truck.findOne({ plates });
        if (existingTruck) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._011.codigo,
                mensaje: 'El camión con estas placas ya existe.',
            };
            res.status(400).json(respuesta);
            return;
        }

        // Validar el esquema de los datos del camión
        const resBody = await esquema.validarSchema(req.body, schema.truckEsquema);
        if (resBody.error) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._011.codigo,
                mensaje: HTTP_CODIGOS._400.contexto._011.mensaje,
                errores: resBody.error,  // Agregar los errores de validación
            };
            res.status(400).json(respuesta);
            return;
        }

        // Crear el camión
        const truckData = { user: idUser, year, color, plates };  // Incluimos el usuario como un ObjectId
        const truck = await dao.insert.insertTruck(truckData);

        // Responder con el camión creado
        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._200.contexto._000.codigo,
            mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
            resultado: truck,
        };
        res.status(201).json(respuesta);
    } catch (error) {
        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._500.contexto._100.codigo,
            mensaje: HTTP_CODIGOS._500.contexto._100.mensaje,
        };
        res.status(500).json(respuesta);
        next(error);  // Pasamos el error al manejador global de errores
    }
};

// Obtener todos los trucks
export const getTrucks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const trucks = await Truck.find().populate('user', 'name email'); // Poblamos el campo user con los datos del usuario
        console.log('Trucks encontrados:', trucks);
        res.status(200).json(trucks);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};

// Obtener un truck por ID
export const getTruckById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const truck = await Truck.findById(req.params.id).populate('user', 'name email');
        if (!truck) {
            res.status(404).json({ message: 'Truck not found' });
            return;
        }
        res.status(200).json(truck);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};

// Actualizar un truck
export const updateTruck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { year, color, plates } = req.body;
        const updatedTruck = await Truck.findByIdAndUpdate(
            req.params.id,
            { year, color, plates },
            { new: true }
        );
        if (!updatedTruck) {
            res.status(404).json({ message: 'Truck not found' });
            return;
        }
        res.status(200).json(updatedTruck);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};

// Eliminar un truck
export const deleteTruck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deletedTruck = await Truck.findByIdAndDelete(req.params.id);
        if (!deletedTruck) {
            res.status(404).json({ message: 'Truck not found' });
            return;
        }
        res.status(200).json({ message: 'Truck deleted successfully' });
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};
