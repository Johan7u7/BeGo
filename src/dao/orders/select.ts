import { Types } from 'mongoose';

export const selectOrderByIdQuery = (orderId: string | Types.ObjectId) => {
    return {
        _id: orderId,  // Filtra por ID de la orden
    };
};
