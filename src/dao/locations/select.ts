import Location from '../../models/locations.js';
import { ILocation } from '../../interfaces/ILocation';

export const findLocationByPlaceId = async (place_id: string): Promise<ILocation | null> => {
    const location = await Location.findOne({ place_id }).lean();
    if (!location) return null;

    // Garantizar que la estructura coincida con ILocation
    const result: ILocation = {
        place_id: location.place_id,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt,
    };

    return result;
};

export const getAllLocations = async (): Promise<ILocation[]> => {
    const locations = await Location.find().lean();
    return locations.map(location => ({
        place_id: location.place_id,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt,
    }));
};
