import Truck from '../../models/Truck.js';
import { updateTruckQuery } from '../trucks/listaQueries.js';
import { Types } from 'mongoose';

// Función para actualizar un camión por su ID
export const updateTruck = async (truckId: string | Types.ObjectId, truckData: { user: string | Types.ObjectId; year: string; color: string; plates: string }) => {
    try {
        const updateQuery = updateTruckQuery(truckId, truckData);  // Obtenemos la consulta de actualización
        const updatedTruck = await Truck.findOneAndUpdate({ _id: truckId }, updateQuery, { new: true });  // Realizamos la actualización
        if (!updatedTruck) {
            throw new Error('Truck not found');
        }
        return updatedTruck;  // Retorna el camión actualizado
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Error al actualizar el camión: ' + error.message);
        } else {
            throw new Error('Error desconocido al actualizar el camión');
        }
    }
};
