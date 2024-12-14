import { Types } from 'mongoose';

// Nombre de la colección
const collectionName = 'locations';

// Consulta para obtener una ubicación por su ID
export const selectLocationByIdQuery = (locationId: string | Types.ObjectId) => {
    return {
        _id: locationId, // Filtra por ID de la ubicación
    };
};

// Consulta para insertar una nueva ubicación
// Definimos un tipo para locationData para mayor claridad
interface LocationData {
    user: string | Types.ObjectId;
    place_id: string;
    address: string;
    latitude: number;
    longitude: number;
}

export const insertLocationQuery = (locationData: LocationData) => {
    return {
        user: locationData.user,
        place_id: locationData.place_id,
        address: locationData.address,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
    };
};

// Consulta para actualizar una ubicación por su ID
export const updateLocationQuery = (
    locationId: string | Types.ObjectId,
    locationData: LocationData
) => {
    return {
        filter: { _id: locationId },  // Filtro para encontrar el documento por ID
        update: {
            $set: {
                user: locationData.user,  // Aseguramos que se esté pasando el 'user'
                place_id: locationData.place_id,
                address: locationData.address,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
            },
        },
    };
};

// Consulta para eliminar una ubicación por su ID
export const deleteLocationQuery = (locationId: string | Types.ObjectId) => {
    return {
        _id: locationId, // Filtra por el ID de la ubicación
    };
};
