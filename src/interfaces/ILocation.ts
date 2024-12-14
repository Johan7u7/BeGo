import { Types } from 'mongoose';
import mongoose from 'mongoose';
// Interfaz para el modelo de Location
export interface ILocation {
    user: mongoose.Schema.Types.ObjectId; // ID del usuario como ObjectId
    place_id: string;
    address: string;
    latitude: number;
    longitude: number;

}

export interface ILocationResponse {
    address: string;
    place_id: string;
    latitude: number;
    longitude: number;

}
