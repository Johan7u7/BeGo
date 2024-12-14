import express from 'express';
import asyncHandler from 'express-async-handler'; // Importa asyncHandler
import { verificaToken } from '../middlewares/authentication.js';
import { validaHeaders } from '../middlewares/validate.js';
import { createLocation, deleteLocation, getLocationById, getLocations, updateLocation } from '../controllers/locationController.js';

const router = express.Router();

// Crear una location
router.post('/create', validaHeaders, verificaToken, asyncHandler(createLocation));

// Obtener todas las location
router.get('/list', validaHeaders, verificaToken, asyncHandler(getLocations));

// Obtener una location por su ID
router.get('/:id', validaHeaders, verificaToken, asyncHandler(getLocationById));

// Actualizar una location por su ID
router.put('/:id/update', validaHeaders, verificaToken, asyncHandler(updateLocation));

// Eliminar una location por su ID
router.delete('/:id/delete', validaHeaders, verificaToken, asyncHandler(deleteLocation));

export default router;
