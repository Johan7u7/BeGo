import mongoose, { Document, Schema } from 'mongoose';

interface ITruck extends Document {
    user: mongoose.Schema.Types.ObjectId; // Referencia al usuario
    year: string;
    color: string;
    plates: string;
}

const TruckSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    year: { type: String, required: true },
    color: { type: String, required: true },
    plates: { type: String, required: true },
}, { timestamps: true });

const Truck = mongoose.model<ITruck>('Truck', TruckSchema);

export default Truck;
