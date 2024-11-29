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
exports.getClientWithQuotes = exports.getClientsWithQuotes = exports.sendReminderEmail = exports.saveQuote = void 0;
const pb_1 = __importDefault(require("../utils/pb"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Guardar un presupuesto
const saveQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, quote } = req.body;
    try {
        // Crear un nuevo cliente con presupuesto en PocketBase
        const newClientData = {
            name,
            email,
            quote,
        };
        const newClient = yield pb_1.default.collection('clients').create(newClientData);
        // Configurar el transporte de correo usando nodemailer
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        // Configurar el contenido del correo de confirmación
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmación de Registro de Presupuesto',
            text: `Hola ${name},\n\nTu presupuesto ha sido registrado exitosamente. Un agente se pondrá en contacto contigo pronto.\n\nDetalles del presupuesto:\n${JSON.stringify(quote, null, 2)}\n\nGracias por elegir nuestros servicios.\n\nEta Carinae Inmobiliaria`,
        };
        // Enviar el correo de confirmación al cliente
        yield transporter.sendMail(mailOptions);
        // Responder al cliente indicando éxito en el guardado y en el envío de correo
        res.status(201).json({ message: 'Presupuesto guardado y correo de confirmación enviado!', client: newClient });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al guardar el presupuesto o enviar el correo de confirmación', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error desconocido al guardar el presupuesto' });
        }
    }
});
exports.saveQuote = saveQuote;
// Enviar recordatorio por correo
const sendReminderEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientEmail, quote } = req.body;
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: clientEmail,
            subject: 'Recordatorio de tu presupuesto',
            text: `Hola,\n\nAquí está tu presupuesto: ${JSON.stringify(quote)}\n\nGracias por elegirnos.`,
        };
        yield transporter.sendMail(mailOptions);
        res.send('Correo enviado exitosamente!');
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error desconocido al enviar el correo' });
        }
    }
});
exports.sendReminderEmail = sendReminderEmail;
// Obtener todos los clientes con sus presupuestos
const getClientsWithQuotes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Usar `expand` para traer todos los presupuestos asociados a cada cliente en una sola consulta
        const clients = yield pb_1.default.collection('clients').getFullList({
            sort: '-created',
            expand: 'quotes', // `quotes` es el nombre del campo de relación con los presupuestos
        });
        res.json(clients);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al obtener clientes con presupuestos', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error desconocido al obtener clientes con presupuestos' });
        }
    }
});
exports.getClientsWithQuotes = getClientsWithQuotes;
// Obtener un solo cliente con sus presupuestos expandidos
const getClientWithQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // ID del cliente
    try {
        // Obtener el cliente específico con presupuestos expandidos
        const client = yield pb_1.default.collection('clients').getOne(id, {
            expand: 'quotes', // `quotes` es el nombre del campo de relación con los presupuestos
        });
        res.json(client);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: 'Cliente no encontrado', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error desconocido al obtener el cliente' });
        }
    }
});
exports.getClientWithQuotes = getClientWithQuotes;
