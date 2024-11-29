"use strict";
// routes/propertyRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("../controllers/propertyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Rutas públicas: No requieren autenticación
router.get('/', propertyController_1.getProperties);
router.get('/:id', propertyController_1.getPropertyById);
// Rutas protegidas: Requieren autenticación
router.post('/', authMiddleware_1.authMiddleware, propertyController_1.createProperty);
router.put('/:id', authMiddleware_1.authMiddleware, propertyController_1.updateProperty);
router.delete('/:id', authMiddleware_1.authMiddleware, propertyController_1.deleteProperty);
exports.default = router;
