import express from 'express';
import asyncHandler from 'express-async-handler'; // Importa asyncHandler
import { verificaToken } from '../middlewares/authentication.js';
import { validaHeaders } from '../middlewares/validate.js';
import { createOrder, deleteOrder, getOrderById, updateOrderStatus, updateOrder } from '../controllers/orderController.js';

const router = express.Router();

// Crear una orden
router.post('/create', validaHeaders, verificaToken, asyncHandler(createOrder));

// Obtener una orden por su ID
router.get('/:id', validaHeaders, verificaToken, asyncHandler(getOrderById));

// Actualizar el estado de una orden por su ID
router.put('/:id/update-status', validaHeaders, verificaToken, asyncHandler(updateOrderStatus));

// Actualizar una orden por su ID
router.put('/:id/update', validaHeaders, verificaToken, asyncHandler(updateOrder));

// Eliminar una orden por su ID
router.delete('/:id/delete', validaHeaders, verificaToken, asyncHandler(deleteOrder));

export default router;
