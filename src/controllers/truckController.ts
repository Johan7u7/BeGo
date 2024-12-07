import { Request, Response, NextFunction } from 'express';
import Truck from '../models/Truck.js';

// Crear un truck
export const createTruck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { user, year, color, plates } = req.body;

        // Verificar si el truck ya existe con las mismas placas
        const existingTruck = await Truck.findOne({ plates });
        if (existingTruck) {
            res.status(400).json({ message: 'Truck with these plates already exists.' });
            return;
        }

        const truck = new Truck({ user, year, color, plates });
        await truck.save();
        res.status(201).json(truck);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};

// Obtener todos los trucks
export const getTrucks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const trucks = await Truck.find().populate('user', 'email'); // Poblamos el campo user con los datos del usuario
        res.status(200).json(trucks);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};

// Obtener un truck por ID
export const getTruckById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const truck = await Truck.findById(req.params.id).populate('user', 'email');
        if (!truck) {
            res.status(404).json({ message: 'Truck not found' });
            return;
        }
        res.status(200).json(truck);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};

// Actualizar un truck
export const updateTruck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { year, color, plates } = req.body;
        const updatedTruck = await Truck.findByIdAndUpdate(
            req.params.id,
            { year, color, plates },
            { new: true }
        );
        if (!updatedTruck) {
            res.status(404).json({ message: 'Truck not found' });
            return;
        }
        res.status(200).json(updatedTruck);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};

// Eliminar un truck
export const deleteTruck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deletedTruck = await Truck.findByIdAndDelete(req.params.id);
        if (!deletedTruck) {
            res.status(404).json({ message: 'Truck not found' });
            return;
        }
        res.status(200).json({ message: 'Truck deleted successfully' });
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};
