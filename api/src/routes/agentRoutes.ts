import express from 'express';
import { getAgents, updateAgentSales } from '../controllers/agentController';
// import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para obtener todos los agentes (protegida)
router.get('/', getAgents);

// Ruta para registrar una venta de un agente (protegida)
router.post('/sale', updateAgentSales);

export default router;
