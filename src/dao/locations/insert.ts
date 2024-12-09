import Location from '../../models/locations.js';
import { ILocation } from '../../interfaces/ILocation';

export const createLocation = async (place_id: string, address: string, latitude: number, longitude: number): Promise<ILocation> => {
    const newLocation = await Location.create({ place_id, address, latitude, longitude });
    return newLocation.toObject() as ILocation; // Retorna un objeto plano
};
