import mongoose, { Document, Schema, model } from 'mongoose';
import { IOrder } from '../interfaces/IOrder';
import User from './userModel.js';
const orderSchema = new Schema<IOrder>({
    truck: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Truck', // Referencia al modelo de camión
    },
    pickup: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Location', // Referencia al modelo de ubicación
    },
    dropoff: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Location', // Referencia al modelo de ubicación
    },
    delivery_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: 'created',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true,
});

const Order = model<IOrder>('Order', orderSchema);

export default Order;
