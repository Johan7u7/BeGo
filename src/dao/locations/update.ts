import Location from '../../models/locations.js';
import { ILocation } from '../../interfaces/ILocation.js';

// Actualizar una location
export const updateLocation = async (
    place_id: string,
    address: string,
    latitude: number,
    longitude: number
) => {
    return Location.findOneAndUpdate(
        { place_id },
        { address, latitude, longitude },
        { new: true }
    ).exec();
};
