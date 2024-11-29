// routes/propertyRoutes.ts

import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController';
// import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Rutas públicas: No requieren autenticación
router.get('/', getProperties);          
router.get('/:id', getPropertyById);     

// Rutas protegidas: Requieren autenticación
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;
