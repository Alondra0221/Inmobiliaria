"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agentController_1 = require("../controllers/agentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para obtener todos los agentes (protegida)
router.get('/', authMiddleware_1.authMiddleware, agentController_1.getAgents);
// Ruta para registrar una venta de un agente (protegida)
router.post('/sale', authMiddleware_1.authMiddleware, agentController_1.updateAgentSales);
exports.default = router;
