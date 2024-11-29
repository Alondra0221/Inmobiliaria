"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const builderController_1 = require("../controllers/builderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authMiddleware, builderController_1.getBuilders);
router.post('/', authMiddleware_1.authMiddleware, builderController_1.createBuilder);
router.put('/:id', authMiddleware_1.authMiddleware, builderController_1.updateBuilder);
router.delete('/:id', authMiddleware_1.authMiddleware, builderController_1.deleteBuilder);
exports.default = router;
