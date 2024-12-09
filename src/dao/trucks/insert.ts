import mongoose, { Types } from 'mongoose';  // Importamos mongoose y Types
import { insertTruckQuery } from '../trucks/listaQueries.js';  // Importamos la consulta de inserción
import Truck from '../../models/Truck.js';

// Función para insertar un camión
export const insertTruck = async (truckData: { user: string | Types.ObjectId, year: string, color: string, plates: string }) => {
    try {
        const truckQuery = insertTruckQuery(truckData);  // Obtenemos la consulta de inserción
        const newTruck = new Truck(truckQuery);  // Creamos un nuevo documento de camión
        await newTruck.save();  // Guardamos el camión en la base de datos
        return newTruck;  // Retorna el camión recién creado
    } catch (error: unknown) {  // Declaramos que el tipo de error es 'unknown'
        if (error instanceof Error) {  // Verificamos que el error sea una instancia de 'Error'
            throw new Error('Error al insertar el camión: ' + error.message);  // Accedemos a 'message' si el error es del tipo correcto
        } else {
            throw new Error('Error desconocido al insertar el camión');  // Si el error no es una instancia de Error, lanzamos un error genérico
        }
    }
};
