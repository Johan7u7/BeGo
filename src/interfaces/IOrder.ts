import { Types } from 'mongoose';

export interface IOrder {
    truck: Types.ObjectId;  // Referencia a un camión
    pickup: Types.ObjectId;  // Referencia a la ubicación de origen
    dropoff: Types.ObjectId;  // Referencia a la ubicación de destino
    delivery_date: Date;  // Fecha de entrega
    status: 'created' | 'inProgress' | 'completed' | 'canceled';  // Estado de la orden
    user: Types.ObjectId;  // Referencia al usuario que crea la orden
}
