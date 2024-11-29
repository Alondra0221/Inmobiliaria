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
exports.updateAgentSales = exports.getAgents = void 0;
const pb_1 = __importDefault(require("../utils/pb"));
// Obtener todos los agentes
const getAgents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener todos los agentes desde PocketBase
        const agents = yield pb_1.default.collection('users').getFullList(200, {
            sort: '-created',
        });
        res.json(agents);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al obtener los agentes', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error desconocido al obtener los agentes' });
        }
    }
});
exports.getAgents = getAgents;
// Registrar venta de un agente
const updateAgentSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId, saleAmount } = req.body;
    try {
        // Obtener el agente desde PocketBase
        const agent = yield pb_1.default.collection('users').getOne(agentId);
        // Actualizar las ventas del agente
        const updatedAgent = yield pb_1.default.collection('users').update(agentId, {
            totalSales: agent.totalSales + saleAmount,
        });
        res.json({ message: 'Ventas actualizadas!', agent: updatedAgent });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al actualizar las ventas del agente', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error desconocido al actualizar las ventas' });
        }
    }
});
exports.updateAgentSales = updateAgentSales;
