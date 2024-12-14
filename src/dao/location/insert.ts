import mongoose, { Types } from 'mongoose';  // Importamos mongoose y Types
import { insertLocationQuery } from '../location/listaQueries.js';  // Importamos la consulta de inserción
import Location from '../../models/Location.js';


// Función para insertar un camión
export const insertLocation = async (locationData: { user: string | Types.ObjectId, place_id: string, address: string, latitude: number, longitude: number }) => {
    try {
        const locationQuery = insertLocationQuery(locationData);  // Obtenemos la consulta de inserción
        const newLocation = new Location(locationQuery);  // Creamos un nuevo documento de camión
        await newLocation.save();  // Guardamos el camión en la base de datos
        return newLocation;  // Retorna el camión recién creado
    } catch (error: unknown) {  // Declaramos que el tipo de error es 'unknown'
        if (error instanceof Error) {  // Verificamos que el error sea una instancia de 'Error'
            throw new Error('Error al insertar el camión: ' + error.message);  // Accedemos a 'message' si el error es del tipo correcto
        } else {
            throw new Error('Error desconocido al insertar el camión');  // Si el error no es una instancia de Error, lanzamos un error genérico
        }
    }
};
