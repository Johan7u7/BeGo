import Location from '../../models/Location.js';
import { selectLocationByIdQuery } from '../location/listaQueries.js';
import { Types } from 'mongoose';

// Función para obtener un camión por su ID
export const getLocationById = async (locationId: string | Types.ObjectId) => {
    try {
        const location = await Location.findOne(selectLocationByIdQuery(locationId));  // Realizamos la consulta para obtener el camión
        if (!location) {
            throw new Error('Location not found');
        }
        return location;  // Retorna el camión encontrado
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Error al obtener la location: ' + error.message);
        } else {
            throw new Error('Error desconocido al obtener la location');
        }
    }
};
