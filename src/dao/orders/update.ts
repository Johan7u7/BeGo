import { Types } from 'mongoose';

export const updateOrderStatusQuery = (orderId: string | Types.ObjectId, status: string) => {
    return {
        $set: {
            status: status,
        },
    };
};

export const updateOrderQuery = (orderId: string | Types.ObjectId, orderData: any) => {
    return {
        $set: {
            truck: orderData.truck,
            status: orderData.status,
            pickup: orderData.pickup,
            dropoff: orderData.dropoff,
        },
    };
};
