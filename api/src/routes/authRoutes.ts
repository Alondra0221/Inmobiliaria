import express from 'express';
import { registerAgent, loginAgent } from '../controllers/authController';

const router = express.Router();

// Ruta para registrar un agente
router.post('/register', registerAgent);

// Ruta para loguear un agente
router.post('/login', loginAgent);

export default router;