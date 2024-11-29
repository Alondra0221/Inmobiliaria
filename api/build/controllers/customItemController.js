"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomItem = exports.updateCustomItem = exports.createCustomItem = exports.getCustomItems = void 0;
const form_data_1 = __importDefault(require("form-data"));
const pb_1 = __importDefault(require("../utils/pb"));
// Obtener todos los ítems personalizables
const getCustomItems = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield pb_1.default.collection('customizable_items').getFullList({ sort: '-created' });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los ítems', error: error instanceof Error ? error.message : '' });
    }
});
exports.getCustomItems = getCustomItems;
// Crear un ítem personalizable con imagen
const createCustomItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = new form_data_1.default();
        formData.append('name', req.body.name);
        formData.append('category', req.body.category);
        formData.append('cost', req.body.cost);
        if (req.file) {
            formData.append('image', req.file.buffer, req.file.originalname);
        }
        const newItem = yield pb_1.default.collection('customizable_items').create(formData);
        res.status(201).json({ message: 'Ítem creado con éxito', item: newItem });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear el ítem', error: error instanceof Error ? error.message : '' });
    }
});
exports.createCustomItem = createCustomItem;
// Actualizar un ítem personalizable con imagen
const updateCustomItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = new form_data_1.default();
        formData.append('name', req.body.name);
        formData.append('category', req.body.category);
        formData.append('cost', req.body.cost);
        if (req.file) {
            formData.append('image', req.file.buffer, req.file.originalname);
        }
        const updatedItem = yield pb_1.default.collection('customizable_items').update(req.params.id, formData);
        res.json({ message: 'Ítem actualizado con éxito', item: updatedItem });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el ítem', error: error instanceof Error ? error.message : '' });
    }
});
exports.updateCustomItem = updateCustomItem;
// Eliminar un ítem personalizable
const deleteCustomItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield pb_1.default.collection('customizable_items').delete(id);
        res.json({ message: 'Ítem eliminado con éxito' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el ítem', error: error instanceof Error ? error.message : '' });
    }
});
exports.deleteCustomItem = deleteCustomItem;
