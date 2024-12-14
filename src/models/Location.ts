import mongoose, { Schema, Document, Types } from 'mongoose'; // Importamos Types para un tipado más claro
import { ILocation } from '../interfaces/ILocation.js';


// Esquema del modelo Location
const LocationSchema = new Schema<ILocation>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Relación con el modelo de usuario
            required: true,
        },
        place_id: {
            type: String,
            required: true,
            unique: true, // Garantiza que no se repitan los place_id
        },
        address: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    }, { timestamps: true });


const Location = mongoose.model<ILocation>('Location', LocationSchema);

console.log('Modelo Location creado:', Location);


export default Location;