import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import agentRoutes from './routes/agentRoutes';
import clientRoutes from './routes/clientRoutes';
import propertyRoutes from './routes/propertyRoutes';
import authRoutes from './routes/authRoutes';
import customItemRoutes from './routes/customItemRoutes';
import builderRoutes from './routes/builderRoutes';
import pb from './utils/pb'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Verificar la conexión a PocketBase
pb.health.check().then(() => {
  console.log('Conexión a la base de datos establecida correctamente.');
}).catch((error:any) => {
  console.error('Error de conexión con la base de datos:', error);
});

// Rutas
app.use('/auth', authRoutes);
app.use('/agents', agentRoutes);
app.use('/clients', clientRoutes);
app.use('/properties', propertyRoutes);
app.use('/custom-items', customItemRoutes);
app.use('/builders', builderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
