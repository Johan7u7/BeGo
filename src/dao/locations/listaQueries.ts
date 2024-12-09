import Location from '../../models/locations.js';
import { ILocation } from '../../interfaces/ILocation.js';

// Consultar una location por `place_id`
export const findLocationByPlaceId = async (place_id: string): Promise<ILocation | null> => {
    return Location.findOne({ place_id }).exec();
};

// Crear una nueva location
export const createLocation = async (
    place_id: string,
    address: string,
    latitude: number,
    longitude: number
): Promise<ILocation> => {
    const newLocation = new Location({
        place_id,
        address,
        latitude,
        longitude,
    });
    return newLocation.save();
};

// Obtener todas las locations
export const getAllLocations = async (): Promise<ILocation[]> => {
    return Location.find().exec();
};

// Actualizar una location por `place_id`
export const updateLocation = async (
    place_id: string,
    address: string,
    latitude: number,
    longitude: number
): Promise<ILocation | null> => {
    return Location.findOneAndUpdate(
        { place_id },
        { address, latitude, longitude },
        { new: true }
    ).exec();
};

// Eliminar una location por `place_id`
export const deleteLocation = async (place_id: string): Promise<ILocation | null> => {
    return Location.findOneAndDelete({ place_id }).exec();
};
