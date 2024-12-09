import Truck from '../../models/Truck.js';
import { selectTruckByIdQuery } from '../trucks/listaQueries.js';
import { Types } from 'mongoose';

// Función para obtener un camión por su ID
export const getTruckById = async (truckId: string | Types.ObjectId) => {
    try {
        const truck = await Truck.findOne(selectTruckByIdQuery(truckId));  // Realizamos la consulta para obtener el camión
        if (!truck) {
            throw new Error('Truck not found');
        }
        return truck;  // Retorna el camión encontrado
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Error al obtener el camión: ' + error.message);
        } else {
            throw new Error('Error desconocido al obtener el camión');
        }
    }
};
