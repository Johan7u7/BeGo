import mongoose from 'mongoose';
export interface ITruck {
    user: mongoose.Schema.Types.ObjectId; // Referencia al usuario
    year: string;
    color: string;
    plates: string;
}


