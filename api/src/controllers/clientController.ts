import { Request, Response } from 'express';
import pb from '../utils/pb';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Guardar un presupuesto
export const saveQuote = async (req: Request, res: Response): Promise<void> => {
  const { name, email, quote } = req.body;

  try {
    // Crear un nuevo cliente con presupuesto en PocketBase
    const newClientData = {
      name,
      email,
      quote,
    };

    const newClient = await pb.collection('clients').create(newClientData);

    // Configurar el transporte de correo usando nodemailer
    const transporter = nodemailer.createTransport({
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
    await transporter.sendMail(mailOptions);

    // Responder al cliente indicando éxito en el guardado y en el envío de correo
    res.status(201).json({ message: 'Presupuesto guardado y correo de confirmación enviado!', client: newClient });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error al guardar el presupuesto o enviar el correo de confirmación', error: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido al guardar el presupuesto' });
    }
  }
};

// Enviar recordatorio por correo
export const sendReminderEmail = async (req: Request, res: Response): Promise<void> => {
  const { clientEmail, quote } = req.body;

  try {
    const transporter = nodemailer.createTransport({
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

    await transporter.sendMail(mailOptions);

    res.send('Correo enviado exitosamente!');
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido al enviar el correo' });
    }
  }
};

// Obtener todos los clientes con sus presupuestos
export const getClientsWithQuotes = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Usar `expand` para traer todos los presupuestos asociados a cada cliente en una sola consulta
    const clients = await pb.collection('clients').getFullList({
      sort: '-created',
      expand: 'quotes', // `quotes` es el nombre del campo de relación con los presupuestos
    });

    res.json(clients);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error al obtener clientes con presupuestos', error: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido al obtener clientes con presupuestos' });
    }
  }
};

// Obtener un solo cliente con sus presupuestos expandidos
export const getClientWithQuotes = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // ID del cliente

  try {
    // Obtener el cliente específico con presupuestos expandidos
    const client = await pb.collection('clients').getOne(id, {
      expand: 'quotes', // `quotes` es el nombre del campo de relación con los presupuestos
    });

    res.json(client);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: 'Cliente no encontrado', error: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido al obtener el cliente' });
    }
  }
};