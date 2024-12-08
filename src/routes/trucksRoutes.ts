import express from 'express';
import { verificaToken } from '../middlewares/authentication.js';
import { validaHeaders } from '../middlewares/validate.js';
import { createTruck, getTrucks, getTruckById, updateTruck, deleteTruck } from '../controllers/truckController.js';

const router = express.Router();

// Crear un nuevo truck
router.post('/create', validaHeaders, verificaToken, createTruck);

// Obtener todos los trucks
router.get('/list', validaHeaders, verificaToken, getTrucks);

// Obtener un truck por su ID
router.get('/:id', validaHeaders, verificaToken, getTruckById);

// Actualizar un truck por su ID
router.put('/:id/update', validaHeaders, verificaToken, updateTruck);

// Eliminar un truck por su ID
router.delete('/:id/delete', validaHeaders, verificaToken, deleteTruck);

export default router;
