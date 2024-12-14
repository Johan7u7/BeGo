import express from 'express';
import { verificaToken } from '../middlewares/authentication.js';
import { validaHeaders } from '../middlewares/validate.js';
import { createLocation, deleteLocation, getLocationById, getLocations, updateLocation } from '../controllers/locationController.js';

const router = express.Router();

// Crear una location
router.post('/create', validaHeaders, verificaToken, createLocation);

// Obtener todos las location
router.get('/list', validaHeaders, verificaToken, getLocations);

// Obtener una location por su ID
router.get('/:id', validaHeaders, verificaToken, getLocationById);

// Actualizar una location por su ID
router.put('/:id/update', validaHeaders, verificaToken, updateLocation);

// Eliminar una location por su ID
router.delete('/:id/delete', validaHeaders, verificaToken, deleteLocation);

export default router;
