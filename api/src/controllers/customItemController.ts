import { Response } from 'express';
import FormData from 'form-data';
import pb from '../utils/pb';
import CustomRequest from '../utils/customReq'; // Asegúrate de ajustar la ruta de importación

// Obtener todos los ítems personalizables
export const getCustomItems = async (_req: CustomRequest, res: Response): Promise<void> => {
  try {
    const items = await pb.collection('customizable_items').getFullList({ sort: '-created' });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los ítems', error: error instanceof Error ? error.message : '' });
  }
};

// Crear un ítem personalizable con imagen
export const createCustomItem = async (req: CustomRequest, res: Response): Promise<void> => {
  console.log("Archivo recibido:", req.file); // Información sobre el archivo
  console.log("Campos del body:", req.body);
  try {
    const formData = new FormData();
    formData.append('name', req.body.name);
    formData.append('category', req.body.category);
    formData.append('cost', req.body.cost);

    if (req.file) {
      formData.append('image', req.file.buffer, req.file.originalname);
    }
    const newItem = await pb.collection('customizable_items').create(formData);
    res.status(201).json({ message: 'Ítem creado con éxito', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el ítem', error: error instanceof Error ? error.message : '' });
  }
};

// Actualizar un ítem personalizable con imagen
export const updateCustomItem = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('name', req.body.name);
    formData.append('category', req.body.category);
    formData.append('cost', req.body.cost);

    if (req.file) {
      formData.append('image', req.file.buffer, req.file.originalname);
    }

    const updatedItem = await pb.collection('customizable_items').update(req.params.id, formData);
    res.json({ message: 'Ítem actualizado con éxito', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el ítem', error: error instanceof Error ? error.message : '' });
  }
};

// Eliminar un ítem personalizable
export const deleteCustomItem = async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      await pb.collection('customizable_items').delete(id);
      res.json({ message: 'Ítem eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el ítem', error: error instanceof Error ? error.message : '' });
    }
  };
