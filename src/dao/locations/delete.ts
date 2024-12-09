import Location from '../../models/locations.js';
import { ILocation } from '../../interfaces/ILocation.js';

export const deleteLocation = async (place_id: string) => {
    return Location.findOneAndDelete({ place_id }).exec();
};