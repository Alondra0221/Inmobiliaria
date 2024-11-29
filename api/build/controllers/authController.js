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
exports.loginAgent = exports.registerAgent = void 0;
const pb_1 = __importDefault(require("../utils/pb")); // Asegúrate de que este archivo exporte la instancia de PocketBase
// Registrar un agente
const registerAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, name, email, password, passwordConfirm } = req.body;
    try {
        // Verificar si el agente ya existe en PocketBase
        try {
            const existingAgent = yield pb_1.default.collection('users').getFirstListItem(`email="${email}"`);
            if (existingAgent) {
                res.status(400).json({ message: 'Agente ya registrado' });
                return;
            }
        }
        catch (error) {
            // Si la consulta no encuentra un resultado, capturamos el error y procedemos a crear el usuario
            console.log('El agente no fue encontrado, procediendo a crear uno nuevo.');
        }
        // Crear un nuevo agente en PocketBase
        const newAgentData = {
            username,
            email,
            emailVisibility: true, // Visibilidad del email si lo necesitas en el perfil público
            password,
            passwordConfirm,
            name,
            totalSales: 0, // Si tu colección de agentes tiene este campo
        };
        const newAgent = yield pb_1.default.collection('users').create(newAgentData);
        // (Opcional) Enviar un correo de verificación si lo deseas
        yield pb_1.default.collection('users').requestVerification(email);
        res.status(201).json({ message: 'Agente registrado exitosamente', agent: newAgent });
    }
    catch (error) {
        console.error('Error al registrar agente:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al registrar agente', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error desconocido al registrar agente' });
        }
    }
});
exports.registerAgent = registerAgent;
// Iniciar sesión para un agente
const loginAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Autenticar el agente usando PocketBase
        const authData = yield pb_1.default.collection('users').authWithPassword(email, password);
        // Obtener el token generado por PocketBase y la información del agente
        const token = pb_1.default.authStore.token;
        const agent = authData.record;
        res.json({ message: 'Inicio de sesión exitoso', token, agent });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Credenciales inválidas', error: error.message });
        }
        else {
            res.status(400).json({ message: 'Error desconocido al iniciar sesión' });
        }
    }
});
exports.loginAgent = loginAgent;
