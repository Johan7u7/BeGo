import mongoose, { Document, Schema } from 'mongoose';
import { ILocation } from '../interfaces/ILocation.js'; // Importar la interfaz de Location

interface ILocationDocument extends ILocation, Document {
    createdAt: Date;
    updatedAt: Date;
}

const LocationSchema = new Schema<ILocationDocument>(
    {
        place_id: {
            type: String,
            required: true,
            unique: true,
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
    },
    { timestamps: true } // Agrega `createdAt` y `updatedAt` automáticamente
);

const Location = mongoose.model<ILocationDocument>('Location', LocationSchema);

export default Location;
