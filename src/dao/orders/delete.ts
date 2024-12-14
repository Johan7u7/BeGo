import { Types } from 'mongoose';

export const deleteOrderQuery = (orderId: string | Types.ObjectId) => {
    return {
        _id: orderId,  // Filtra por el ID de la orden
    };
};
