import { Request, Response, NextFunction } from 'express';
import pb from '../utils/pb';

// Definir la interfaz extendida para incluir el usuario autenticado
interface AuthRequest extends Request {
  user?: any; // Puedes ajustar el tipo según la estructura de tu usuario
}

// Middleware de autenticación
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Acceso denegado. Token faltante.' });
    return;
  }

  try {
    // Intentar verificar el token usando PocketBase
    pb.authStore.save(token, null); // Guarda el token en la authStore para validarlo
    const user = pb.authStore.model; // Obtener el usuario autenticado

    if (!pb.authStore.isValid || !user) {
      res.status(401).json({ message: 'Token inválido o expirado.' });
      return;
    }

    // Asignar el usuario a la solicitud para usarlo en las rutas protegidas
    req.user = user;
    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    res.status(400).json({ message: 'Error al verificar el token.', error });
  }
};
