import { Request, Response } from 'express';
import pb from '../utils/pb'; // Asegúrate de que este archivo exporte la instancia de PocketBase

// Registrar un agente
export const registerAgent = async (req: Request, res: Response): Promise<void> => {
  const { username, name, email, password, passwordConfirm } = req.body;

  try {
    // Verificar si el agente ya existe en PocketBase
    try {
      const existingAgent = await pb.collection('users').getFirstListItem(`email="${email}"`);
      if (existingAgent) {
        res.status(400).json({ message: 'Agente ya registrado' });
        return;
      }
    } catch (error) {
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

    const newAgent = await pb.collection('users').create(newAgentData);

    // (Opcional) Enviar un correo de verificación si lo deseas
    await pb.collection('users').requestVerification(email);

    res.status(201).json({ message: 'Agente registrado exitosamente', agent: newAgent });
  } catch (error) {
    console.error('Error al registrar agente:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error al registrar agente', error: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido al registrar agente' });
    }
  }
};

// Iniciar sesión para un agente
export const loginAgent = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Autenticar el agente usando PocketBase
    const authData = await pb.collection('users').authWithPassword(email, password);

    // Obtener el token generado por PocketBase y la información del agente
    const token = pb.authStore.token;
    const agent = authData.record;

    res.json({ message: 'Inicio de sesión exitoso', token, agent });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: 'Credenciales inválidas', error: error.message });
    } else {
      res.status(400).json({ message: 'Error desconocido al iniciar sesión' });
    }
  }
};
