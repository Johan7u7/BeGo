import express from 'express';
import { verifyJWT, validateHeader } from '../middlewares/authentication.js';
import { createTruck, getTrucks, getTruckById, updateTruck, deleteTruck } from '../controllers/truckController.js';

const router = express.Router();

// Crear un nuevo truck
router.post('/create', validateHeader, verifyJWT, createTruck);

// Obtener todos los trucks
router.get('/list', validateHeader, verifyJWT, getTrucks);

// Obtener un truck por su ID
router.get('/:id', validateHeader, verifyJWT, getTruckById);

// Actualizar un truck por su ID
router.put('/:id/update', validateHeader, verifyJWT, updateTruck);

// Eliminar un truck por su ID
router.delete('/:id/delete', validateHeader, verifyJWT, deleteTruck);

export default router;
