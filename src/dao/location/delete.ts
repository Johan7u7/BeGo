import Location from '../../models/Location.js';
import { deleteLocationQuery } from '../location/listaQueries.js';
import { Types } from 'mongoose';

// Función para eliminar un camión por su ID
export const deleteLocation = async (userId: string | Types.ObjectId) => {
    try {
        const location = await Location.findOneAndDelete(deleteLocationQuery(userId));  // Realizamos la eliminación del camión
        if (!location) {
            throw new Error('Truck not found');
        }
        return location;  // Retorna el camión eliminado
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Error al eliminar el camión: ' + error.message);
        } else {
            throw new Error('Error desconocido al eliminar el camión');
        }
    }
};
