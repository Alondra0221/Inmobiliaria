import { Response } from 'express';
import FormData from 'form-data';
import pb from '../utils/pb';
import CustomRequest from '../utils/customReq';

// Obtener todos los maestros albañiles
export const getBuilders = async (_req: CustomRequest, res: Response): Promise<void> => {
  try {
    const builders = await pb.collection('builders').getFullList({ sort: '-created' });
    res.json(builders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los maestros albañiles', error: error instanceof Error ? error.message : '' });
  }
};

// Crear un maestro albañil con foto
export const createBuilder = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('name', req.body.name);
    formData.append('skills', JSON.stringify(req.body.skills));
    formData.append('rate', req.body.rate);
    formData.append('experience', req.body.experience);
    formData.append('estimated_time', req.body.estimated_time);

    if (req.file) {
      formData.append('photo', req.file.buffer, req.file.originalname);
    }

    const newBuilder = await pb.collection('builders').create(formData);
    res.status(201).json({ message: 'Maestro albañil creado con éxito', builder: newBuilder });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el maestro albañil', error: error instanceof Error ? error.message : '' });
  }
};

// Actualizar un maestro albañil con foto
export const updateBuilder = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('name', req.body.name);
    formData.append('skills', JSON.stringify(req.body.skills));
    formData.append('rate', req.body.rate);
    formData.append('experience', req.body.experience);
    formData.append('estimated_time', req.body.estimated_time);

    if (req.file) {
      formData.append('photo', req.file.buffer, req.file.originalname);
    }

    const updatedBuilder = await pb.collection('builders').update(req.params.id, formData);
    res.json({ message: 'Maestro albañil actualizado con éxito', builder: updatedBuilder });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el maestro albañil', error: error instanceof Error ? error.message : '' });
  }
};

// Eliminar un maestro albañil
export const deleteBuilder = async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      await pb.collection('builders').delete(id);
      res.json({ message: 'Maestro albañil eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el maestro albañil', error: error instanceof Error ? error.message : '' });
    }
  };
