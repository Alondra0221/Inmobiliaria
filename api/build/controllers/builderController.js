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
exports.deleteBuilder = exports.updateBuilder = exports.createBuilder = exports.getBuilders = void 0;
const form_data_1 = __importDefault(require("form-data"));
const pb_1 = __importDefault(require("../utils/pb"));
// Obtener todos los maestros albañiles
const getBuilders = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const builders = yield pb_1.default.collection('builders').getFullList({ sort: '-created' });
        res.json(builders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los maestros albañiles', error: error instanceof Error ? error.message : '' });
    }
});
exports.getBuilders = getBuilders;
// Crear un maestro albañil con foto
const createBuilder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = new form_data_1.default();
        formData.append('name', req.body.name);
        formData.append('skills', JSON.stringify(req.body.skills));
        formData.append('rate', req.body.rate);
        formData.append('experience', req.body.experience);
        formData.append('estimated_time', req.body.estimated_time);
        if (req.file) {
            formData.append('photo', req.file.buffer, req.file.originalname);
        }
        const newBuilder = yield pb_1.default.collection('builders').create(formData);
        res.status(201).json({ message: 'Maestro albañil creado con éxito', builder: newBuilder });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear el maestro albañil', error: error instanceof Error ? error.message : '' });
    }
});
exports.createBuilder = createBuilder;
// Actualizar un maestro albañil con foto
const updateBuilder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = new form_data_1.default();
        formData.append('name', req.body.name);
        formData.append('skills', JSON.stringify(req.body.skills));
        formData.append('rate', req.body.rate);
        formData.append('experience', req.body.experience);
        formData.append('estimated_time', req.body.estimated_time);
        if (req.file) {
            formData.append('photo', req.file.buffer, req.file.originalname);
        }
        const updatedBuilder = yield pb_1.default.collection('builders').update(req.params.id, formData);
        res.json({ message: 'Maestro albañil actualizado con éxito', builder: updatedBuilder });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el maestro albañil', error: error instanceof Error ? error.message : '' });
    }
});
exports.updateBuilder = updateBuilder;
// Eliminar un maestro albañil
const deleteBuilder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield pb_1.default.collection('builders').delete(id);
        res.json({ message: 'Maestro albañil eliminado con éxito' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el maestro albañil', error: error instanceof Error ? error.message : '' });
    }
});
exports.deleteBuilder = deleteBuilder;
