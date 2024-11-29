import express from 'express';
import { saveQuote, sendReminderEmail, getClientsWithQuotes, getClientWithQuotes } from '../controllers/clientController';
// import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para obtener todos los clientes con sus presupuestos (protegida)
router.get('/with-quotes', getClientsWithQuotes);

// Ruta para obtener un cliente específico con sus presupuestos (protegida)
router.get('/:id', getClientWithQuotes);

// Rutas adicionales
router.post('/quote', saveQuote);
router.post('/sendReminder', sendReminderEmail);

export default router;
