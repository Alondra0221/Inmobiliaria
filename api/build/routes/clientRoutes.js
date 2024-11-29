"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para obtener todos los clientes con sus presupuestos (protegida)
router.get('/with-quotes', authMiddleware_1.authMiddleware, clientController_1.getClientsWithQuotes);
// Ruta para obtener un cliente específico con sus presupuestos (protegida)
router.get('/:id', authMiddleware_1.authMiddleware, clientController_1.getClientWithQuotes);
// Rutas adicionales
router.post('/quote', authMiddleware_1.authMiddleware, clientController_1.saveQuote);
router.post('/sendReminder', authMiddleware_1.authMiddleware, clientController_1.sendReminderEmail);
exports.default = router;
