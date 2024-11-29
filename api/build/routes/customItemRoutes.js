"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customItemController_1 = require("../controllers/customItemController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authMiddleware, customItemController_1.getCustomItems);
router.post('/', authMiddleware_1.authMiddleware, customItemController_1.createCustomItem);
router.put('/:id', authMiddleware_1.authMiddleware, customItemController_1.updateCustomItem);
router.delete('/:id', authMiddleware_1.authMiddleware, customItemController_1.deleteCustomItem);
exports.default = router;
