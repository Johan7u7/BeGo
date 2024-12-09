import mongoose, { Document, Schema } from 'mongoose';
import User from './userModel.js';
import { ITruck } from '../interfaces/ITruck';



const TruckSchema = new Schema<ITruck>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    year: {
        type: String,
        required: true,
        match: /^\d{4}$/
    },
    color: {
        type: String,
        required: true
    },
    plates: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Z0-9]{6,8}$/
    },
}, { timestamps: true });

const Truck = mongoose.model<ITruck>('Truck', TruckSchema);

console.log('Modelo Truck creado:', Truck);

export default Truck;
