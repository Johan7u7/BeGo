import { Request, Response } from 'express';
import Location from '../models/locations.js';
import { dao } from '../dao/locations/index.js';
import { ILocationResponse } from '../interfaces/ILocation.js';

// Crear una nueva location
export const createLocation = async (req: Request, res: Response): Promise<Response> => {
    const { place_id } = req.body;

    try {
        const existingLocation = await Location.findOne({ place_id });
        if (existingLocation) {
            return res.status(400).json({ message: 'La location ya existe.' });
        }

        // Obtener los detalles de la location desde Google Maps a través del dao
        const locationDetails = await dao.select.findLocationByPlaceId(place_id);
        if (!locationDetails) {
            return res.status(404).json({ message: 'No se pudo encontrar información para el place_id proporcionado.' });
        }

        // Crear la nueva location
        const newLocation = new Location({
            place_id,
            address: locationDetails.address,
            latitude: locationDetails.latitude,
            longitude: locationDetails.longitude,
        });

        await newLocation.save();

        // Formatear la respuesta
        const response: ILocationResponse = {
            address: newLocation.address,
            place_id: newLocation.place_id,
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            createdAt: newLocation.createdAt.toISOString(),
            updatedAt: newLocation.updatedAt.toISOString(),
        };

        return res.status(201).json(response);
    } catch (error) {
        console.error('Error al crear la location:', error);
        return res.status(500).json({ message: 'Error interno al crear la location.' });
    }
};

// Obtener todas las locations
export const getAllLocations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const locations = await Location.find();
        return res.status(200).json(locations);
    } catch (error) {
        console.error('Error al obtener las locations:', error);
        return res.status(500).json({ message: 'Error al obtener las locations.' });
    }
};

// Actualizar una location
export const updateLocation = async (req: Request, res: Response): Promise<Response> => {
    const { place_id } = req.params;
    const { address, latitude, longitude } = req.body;

    try {
        const updatedLocation = await Location.findOneAndUpdate(
            { place_id },
            { address, latitude, longitude },
            { new: true }
        );

        if (!updatedLocation) {
            return res.status(404).json({ message: 'Location no encontrada.' });
        }

        return res.status(200).json(updatedLocation);
    } catch (error) {
        console.error('Error al actualizar la location:', error);
        return res.status(500).json({ message: 'Error al actualizar la location.' });
    }
};

// Eliminar una location
export const deleteLocation = async (req: Request, res: Response): Promise<Response> => {
    const { place_id } = req.params;

    try {
        const deletedLocation = await Location.findOneAndDelete({ place_id });
        if (!deletedLocation) {
            return res.status(404).json({ message: 'Location no encontrada.' });
        }
        return res.status(200).json({ message: 'Location eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar la location:', error);
        return res.status(500).json({ message: 'Error al eliminar la location.' });
    }
};
