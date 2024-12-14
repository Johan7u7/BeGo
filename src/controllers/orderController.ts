import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import orderDao from '../dao/orders/index.js'; // Importamos el DAO de órdenes
import { HTTP_CODIGOS } from '../config/codigos_http.js';
import tokenApi from '../utils/token.js';
import esquema from '../utils/validateesquema.js';
import schema from '../config/esquemas/generales.js';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import { logger } from '../utils/logger.js';  // Importa el logger
dotenv.config();

interface Respuesta {
    codigo: string;
    mensaje: string;
    errores?: any;
    resultado?: any;
}

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let respuesta: Respuesta = {
        codigo: HTTP_CODIGOS._200.contexto._000.codigo,
        mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
    };

    try {
        // Obtenemos el token de los headers
        const userToken = req.get('idsession') || '';
        const idUser = req.headers.identificador_usuario as string;

        logger.info(`Inicio de la creación de orden. idUser: ${idUser}, userToken: ${userToken}`);

        if (!userToken || !idUser) {
            logger.error('Faltan datos requeridos: idsession o identificador_usuario');
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._012.codigo,
                mensaje: 'Faltan datos requeridos: idsession o identificador_usuario',
            };
            res.status(400).json(respuesta);
            return;
        }

        // Verificamos el token
        const decoded = tokenApi.comprobarToken(userToken);
        if (!decoded) {
            logger.error('Token inválido o expirado');
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._401.contexto._001.codigo,
                mensaje: 'Token inválido o expirado',
            };
            res.status(401).json(respuesta);
            return;
        }

        logger.info(`Token verificado exitosamente para el usuario: ${idUser}`);

        // Asegurarnos de que el 'user' sea un ObjectId válido
        if (!Types.ObjectId.isValid(idUser)) {
            logger.error(`ID de usuario no válido: ${idUser}`);
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._012.codigo,
                mensaje: 'ID de usuario no válido.',
            };
            res.status(400).json(respuesta);
            return;
        }

        const { truck, status = 'created', delivery_date, pickup, dropoff } = req.body;

        // Validar el esquema de los datos de la orden
        const resBody = await esquema.validarSchema(req.body, schema.orderEsquema);
        if (resBody.error) {
            logger.error('Errores en la validación del esquema de la orden', resBody.error);
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._011.codigo,
                mensaje: HTTP_CODIGOS._400.contexto._011.mensaje,
                errores: resBody.error,
            };
            res.status(400).json(respuesta);
            return;
        }

        // Validar que las ubicaciones no sean iguales
        if (pickup === dropoff) {
            logger.error('Las ubicaciones de pickup y dropoff no pueden ser iguales');
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._012.codigo,
                mensaje: 'Las ubicaciones de pickup y dropoff no pueden ser iguales.',
            };
            res.status(400).json(respuesta);
            return;
        }

        // Asegurarse de que los IDs de 'pickup' y 'dropoff' sean válidos
        if (!Types.ObjectId.isValid(pickup) || !Types.ObjectId.isValid(dropoff)) {
            logger.error(`ID de ubicación inválido para pickup: ${pickup}, dropoff: ${dropoff}`);
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._012.codigo,
                mensaje: 'ID de ubicación inválido para pickup o dropoff.',
            };
            res.status(400).json(respuesta);
            return;
        }

        const newOrderData = {
            user: idUser,
            truck,
            status,
            delivery_date,
            pickup,
            dropoff
        };

        // Guardamos la nueva orden directamente en la base de datos
        logger.info('Creando nueva orden...');
        const newOrder = await Order.create(newOrderData); // Usamos Mongoose para crear la orden

        logger.info(`Orden creada con éxito. ID de orden: ${newOrder._id}`);

        // Convertir el resultado a un objeto y retornarlo
        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._200.contexto._000.codigo,
            mensaje: 'Orden creada con éxito',
            resultado: newOrder, // Retornamos la nueva orden completa
        };
        res.status(201).json(respuesta);
    } catch (error) {
        logger.error('Error al crear la orden', error);
        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._500.contexto._100.codigo,
            mensaje: HTTP_CODIGOS._500.contexto._100.mensaje,
        };
        res.status(500).json(respuesta);
        next(error);
    }
};

// Obtener una orden por su ID
export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'ID de orden inválido' });
            return;
        }

        const order = await Order.findById(id); // Usamos Mongoose directamente para encontrar la orden
        if (!order) {
            res.status(404).json({ message: 'Orden no encontrada' });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// Eliminar una orden
export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'ID de orden inválido' });
            return;
        }

        const deletedOrder = await Order.findByIdAndDelete(id); // Usamos Mongoose para eliminar la orden

        if (!deletedOrder) {
            res.status(404).json({ message: 'Orden no encontrada' });
            return;
        }

        res.status(200).json({ message: 'Orden eliminada exitosamente' });
    } catch (error) {
        next(error);
    }
};
// Actualizar el estado de una orden
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let respuesta: Respuesta = {
        codigo: HTTP_CODIGOS._200.contexto._000.codigo,
        mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
    };
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'ID de orden inválido' });
            return;
        }

        if (!status) {
            res.status(400).json({ message: 'El estado es obligatorio' });
            return;
        }

        // Validar que el estado esté dentro de los valores permitidos
        const validStatuses = ['created', 'inProgress', 'completed', 'canceled'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: 'Estado no válido' });
            return;
        }

        // Actualizamos el estado de la orden
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedOrder) {
            res.status(404).json({ message: 'Orden no encontrada o no se ha modificado' });
            return;
        }

        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._200.contexto._000.codigo,
            mensaje: 'Estado de la orden actualizado con éxito',
            resultado: updatedOrder, // Devolvemos la orden actualizada
        };
        res.status(200).json(respuesta);
    } catch (error) {
        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._500.contexto._100.codigo,
            mensaje: HTTP_CODIGOS._500.contexto._100.mensaje,
        };
        res.status(500).json(respuesta);
        next(error);
    }
};
// Actualizar los detalles de una orden
export const updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let respuesta: Respuesta = {
        codigo: HTTP_CODIGOS._200.contexto._000.codigo,
        mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
    };
    try {
        const { id } = req.params;
        const { truck, status, pickup, dropoff } = req.body;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'ID de orden inválido' });
            return;
        }

        // Validar que al menos uno de los campos de la orden sea proporcionado
        if (!truck && !status && !pickup && !dropoff) {
            res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
            return;
        }

        // Validar que los IDs de 'pickup' y 'dropoff' sean válidos si están presentes
        if (pickup && !Types.ObjectId.isValid(pickup)) {
            res.status(400).json({ message: 'ID de ubicación de pickup inválido' });
            return;
        }

        if (dropoff && !Types.ObjectId.isValid(dropoff)) {
            res.status(400).json({ message: 'ID de ubicación de dropoff inválido' });
            return;
        }

        // Construir el objeto de actualización con los campos proporcionados
        const updateData: any = {};
        if (truck) updateData.truck = truck;
        if (status) updateData.status = status;
        if (pickup) updateData.pickup = pickup;
        if (dropoff) updateData.dropoff = dropoff;

        // Actualizamos la orden con los nuevos datos
        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedOrder) {
            res.status(404).json({ message: 'Orden no encontrada o no se ha modificado' });
            return;
        }

        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._200.contexto._000.codigo,
            mensaje: 'Orden actualizada con éxito',
            resultado: updatedOrder, // Devolvemos la orden actualizada
        };
        res.status(200).json(respuesta);
    } catch (error) {
        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._500.contexto._100.codigo,
            mensaje: HTTP_CODIGOS._500.contexto._100.mensaje,
        };
        res.status(500).json(respuesta);
        next(error);
    }
};