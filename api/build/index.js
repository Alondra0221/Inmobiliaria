"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const agentRoutes_1 = __importDefault(require("./routes/agentRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const customItemRoutes_1 = __importDefault(require("./routes/customItemRoutes"));
const builderRoutes_1 = __importDefault(require("./routes/builderRoutes"));
const pb_1 = __importDefault(require("./utils/pb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Verificar la conexión a PocketBase
pb_1.default.health.check().then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
}).catch((error) => {
    console.error('Error de conexión con la base de datos:', error);
});
// Rutas
app.use('/auth', authRoutes_1.default);
app.use('/agents', agentRoutes_1.default);
app.use('/clients', clientRoutes_1.default);
app.use('/properties', propertyRoutes_1.default);
app.use('/custom-items', customItemRoutes_1.default);
app.use('/builders', builderRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
