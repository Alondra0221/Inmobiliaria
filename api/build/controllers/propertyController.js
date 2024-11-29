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
exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getPropertyById = exports.getProperties = void 0;
const form_data_1 = __importDefault(require("form-data"));
const pb_1 = __importDefault(require("../utils/pb"));
// Obtener todas las propiedades
const getProperties = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield pb_1.default.collection('properties').getFullList({ sort: '-created' });
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener las propiedades', error: error instanceof Error ? error.message : '' });
    }
});
exports.getProperties = getProperties;
// Obtener una propiedad por ID
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const property = yield pb_1.default.collection('properties').getOne(id);
        res.json(property);
    }
    catch (error) {
        res.status(404).json({ message: 'Propiedad no encontrada', error: error instanceof Error ? error.message : '' });
    }
});
exports.getPropertyById = getPropertyById;
// Crear una nueva propiedad con imagen
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = new form_data_1.default();
        formData.append('name', req.body.name);
        formData.append('description', req.body.description);
        formData.append('cost', req.body.cost);
        formData.append('location', req.body.location);
        if (req.file) {
            formData.append('image', req.file.buffer, req.file.originalname);
        }
        const newProperty = yield pb_1.default.collection('properties').create(formData);
        res.status(201).json({ message: 'Propiedad creada con éxito', property: newProperty });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la propiedad', error: error instanceof Error ? error.message : '' });
    }
});
exports.createProperty = createProperty;
// Actualizar una propiedad con imagen
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const formData = new form_data_1.default();
        formData.append('name', req.body.name);
        formData.append('description', req.body.description);
        formData.append('cost', req.body.cost);
        formData.append('location', req.body.location);
        if (req.file) {
            formData.append('image', req.file.buffer, req.file.originalname);
        }
        const updatedProperty = yield pb_1.default.collection('properties').update(id, formData);
        res.json({ message: 'Propiedad actualizada con éxito', property: updatedProperty });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la propiedad', error: error instanceof Error ? error.message : '' });
    }
});
exports.updateProperty = updateProperty;
// Eliminar una propiedad por ID
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield pb_1.default.collection('properties').delete(id);
        res.json({ message: 'Propiedad eliminada con éxito' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar la propiedad', error: error instanceof Error ? error.message : '' });
    }
});
exports.deleteProperty = deleteProperty;
