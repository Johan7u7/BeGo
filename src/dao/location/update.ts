import Location from '../../models/Location.js';  // Importamos el modelo de Location
import { updateLocationQuery } from '../location/listaQueries.js';  // Importamos la consulta de actualización
import { Types } from 'mongoose';  // Importamos Types de mongoose

// Función para actualizar una ubicación por su ID
export const updateLocation = async (
    locationId: string | Types.ObjectId,
    locationData: {
        user: string | Types.ObjectId;  // Asegúrate de incluir la propiedad 'user'
        place_id: string;
        address: string;
        latitude: number;
        longitude: number;
    }
) => {
    try {
        // Obtenemos la consulta de actualización utilizando los datos de location
        const { filter, update } = updateLocationQuery(locationId, locationData);  // Desestructuramos correctamente

        // Realizamos la actualización de la ubicación por ID
        const updatedLocation = await Location.findOneAndUpdate(
            filter,  // Filtro para encontrar la ubicación por su ID
            update,  // Aplicamos la actualización
            { new: true }  // Retorna el documento actualizado
        );

        // Si no se encontró la ubicación, lanzamos un error
        if (!updatedLocation) {
            throw new Error('Location not found');
        }

        return updatedLocation;  // Retorna la ubicación actualizada
    } catch (error: unknown) {
        // Manejo de errores
        if (error instanceof Error) {
            throw new Error('Error al actualizar la ubicación: ' + error.message);
        } else {
            throw new Error('Error desconocido al actualizar la ubicación');
        }
    }
};
