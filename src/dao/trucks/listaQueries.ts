import mongoose, { Types } from 'mongoose';

// Nombre de la colección
const collectionName = 'trucks';

// Consulta para obtener un camión por su ID
export const selectTruckByIdQuery = (truckId: string | Types.ObjectId) => {
    return {
        _id: truckId, // Filtra por ID del camión
    };
};

// Consulta para insertar un camión
// Definimos un tipo para truckData para mayor claridad
interface TruckData {
    user: string | Types.ObjectId;
    year: string;
    color: string;
    plates: string;
}

export const insertTruckQuery = (truckData: TruckData) => {
    return {
        user: truckData.user,
        year: truckData.year,
        color: truckData.color,
        plates: truckData.plates,
    };
};

// Consulta para actualizar un camión por su ID
export const updateTruckQuery = (truckId: string | Types.ObjectId, truckData: TruckData) => {
    return {
        $set: {
            year: truckData.year,
            color: truckData.color,
            plates: truckData.plates,
        },
    };
};

// Consulta para eliminar un camión por su ID
export const deleteTruckQuery = (truckId: string | Types.ObjectId) => {
    return {
        _id: truckId, // Filtra por el ID del camión
    };
};
