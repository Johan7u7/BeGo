import mongoose, { Types } from 'mongoose';
import Order from '../../models/Order.js';
// Nombre de la colección
const collectionName = 'orders';

// Consulta para obtener una orden por su ID
export const selectOrderByIdQuery = (orderId: string | Types.ObjectId) => {
    return {
        _id: orderId, // Filtra por ID de la orden
    };
};

// Consulta para insertar una nueva orden
// Definimos un tipo para orderData para mayor claridad
interface OrderData {
    user: string | Types.ObjectId;
    truck: string | Types.ObjectId;
    status: string; // [created, in transit, completed]
    pickup: string | Types.ObjectId; // ID de la location de pickup
    dropoff: string | Types.ObjectId; // ID de la location de dropoff
}

export const insertOrderQuery = async (orderData: OrderData) => {
    try {
        const newOrder = new Order(orderData);  // Crea un nuevo documento con los datos de la orden
        const result = await newOrder.save();  // Guarda la orden en la base de datos

        // Devuelve la respuesta de la inserción, incluyendo el ID insertado
        return {
            acknowledged: result !== null,  // Confirma si la operación fue exitosa
            insertedId: result?._id,  // Devuelve el ID del documento insertado
            order: result,  // También puedes devolver el objeto completo de la orden
        };
    } catch (error: any) {
        throw new Error(`Error al insertar la orden: ${error.message}`);
    }
};

// Consulta para actualizar el estado de una orden por su ID
export const updateOrderStatusQuery = (orderId: string | Types.ObjectId, status: string) => {
    return {
        $set: {
            status, // Cambia el estado de la orden
        },
    };
};

// Consulta para actualizar los detalles de una orden por su ID
export const updateOrderQuery = (orderId: string | Types.ObjectId, orderData: OrderData) => {
    return {
        $set: {
            truck: orderData.truck,
            status: orderData.status,
            pickup: orderData.pickup,
            dropoff: orderData.dropoff,
        },
    };
};

// Consulta para eliminar una orden por su ID
export const deleteOrderQuery = (orderId: string | Types.ObjectId) => {
    return {
        _id: orderId, // Filtra por el ID de la orden
    };
};
