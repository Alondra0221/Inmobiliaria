import { Response } from 'express';
import FormData from 'form-data';
import pb from '../utils/pb';
import CustomRequest from '../utils/customReq'; // Asegúrate de ajustar la ruta de importación

// Obtener todas las propiedades
export const getProperties = async (_req: CustomRequest, res: Response): Promise<void> => {
  try {
    const properties = await pb.collection('properties').getFullList({ sort: '-created' });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las propiedades', error: error instanceof Error ? error.message : '' });
  }
};

// Obtener una propiedad por ID
export const getPropertyById = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const property = await pb.collection('properties').getOne(id);
    res.json(property);
  } catch (error) {
    res.status(404).json({ message: 'Propiedad no encontrada', error: error instanceof Error ? error.message : '' });
  }
};

// Crear una nueva propiedad con imagen
export const createProperty = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('name', req.body.name);
    formData.append('description', req.body.description);
    formData.append('cost', req.body.cost);
    formData.append('location', req.body.location);

    if (req.file) {
      formData.append('image', req.file.buffer, req.file.originalname);
    }

    const newProperty = await pb.collection('properties').create(formData);
    res.status(201).json({ message: 'Propiedad creada con éxito', property: newProperty });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la propiedad', error: error instanceof Error ? error.message : '' });
  }
};

// Actualizar una propiedad con imagen
export const updateProperty = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const formData = new FormData();
    formData.append('name', req.body.name);
    formData.append('description', req.body.description);
    formData.append('cost', req.body.cost);
    formData.append('location', req.body.location);

    if (req.file) {
      formData.append('image', req.file.buffer, req.file.originalname);
    }

    const updatedProperty = await pb.collection('properties').update(id, formData);
    res.json({ message: 'Propiedad actualizada con éxito', property: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la propiedad', error: error instanceof Error ? error.message : '' });
  }
};

// Eliminar una propiedad por ID
export const deleteProperty = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await pb.collection('properties').delete(id);
    res.json({ message: 'Propiedad eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la propiedad', error: error instanceof Error ? error.message : '' });
  }
};
