import { Types } from 'mongoose';

interface OrderData {
    user: string | Types.ObjectId;
    truck: string | Types.ObjectId;
    status: string;  // [created, in transit, completed]
    pickup: string | Types.ObjectId;
    dropoff: string | Types.ObjectId;
}

export const insertOrderQuery = (orderData: OrderData) => {
    return {
        user: orderData.user,
        truck: orderData.truck,
        status: orderData.status,
        pickup: orderData.pickup,
        dropoff: orderData.dropoff,
    };
};
