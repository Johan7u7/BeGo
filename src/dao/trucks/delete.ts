import Truck from '../../models/Truck.js';
import { deleteTruckQuery } from '../trucks/listaQueries.js';
import { Types } from 'mongoose';

// Función para eliminar un camión por su ID
export const deleteTruck = async (truckId: string | Types.ObjectId) => {
    try {
        const truck = await Truck.findOneAndDelete(deleteTruckQuery(truckId));  // Realizamos la eliminación del camión
        if (!truck) {
            throw new Error('Truck not found');
        }
        return truck;  // Retorna el camión eliminado
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Error al eliminar el camión: ' + error.message);
        } else {
            throw new Error('Error desconocido al eliminar el camión');
        }
    }
};
