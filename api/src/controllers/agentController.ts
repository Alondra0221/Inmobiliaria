import { Request, Response } from 'express';
import pb from '../utils/pb';

// Obtener todos los agentes
export const getAgents = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Obtener todos los agentes desde PocketBase
    const agents = await pb.collection('users').getFullList(200,{
      sort: '-created',
    });
    res.json(agents);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error al obtener los agentes', error: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido al obtener los agentes' });
    }
  }
};

// Registrar venta de un agente
export const updateAgentSales = async (req: Request, res: Response): Promise<void> => {
  const { agentId, saleAmount } = req.body;

  try {
    // Obtener el agente desde PocketBase
    const agent = await pb.collection('users').getOne(agentId);

    // Actualizar las ventas del agente
    const updatedAgent = await pb.collection('users').update(agentId, {
      totalSales: agent.totalSales + saleAmount,
    });

    res.json({ message: 'Ventas actualizadas!', agent: updatedAgent });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error al actualizar las ventas del agente', error: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido al actualizar las ventas' });
    }
  }
};
