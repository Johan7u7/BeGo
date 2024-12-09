import express from 'express';
import { verificaToken } from '../middlewares/authentication.js';  // Middleware de autenticación
import { validaHeaders } from '../middlewares/validate.js';  // Middleware de validación de headers
import { createLocation, getAllLocations, updateLocation, deleteLocation } from '../controllers/locationsController.js';  // Controladores

const router = express.Router();

// Crear una nueva location
router.post('/create', validaHeaders, verificaToken, createLocation);

// Obtener todas las locations
router.get('/list', validaHeaders, verificaToken, getAllLocations);

// Obtener una location por su place_id
router.get('/:place_id', validaHeaders, verificaToken, getLocationByPlaceId);

// Actualizar una location por su place_id
router.put('/:place_id/update', validaHeaders, verificaToken, updateLocation);

// Eliminar una location por su place_id
router.delete('/:place_id/delete', validaHeaders, verificaToken, deleteLocation);

export default router;
