import { create } from 'zustand';
import pb from '~/lib/pb';

interface Client {
  id: string;
  name: string;
  email: string;
  quote: string; 
  assigned: boolean;
}

interface ClientStore {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  fetchClients: () => Promise<void>;
  fetchClientById: (id: string) => Promise<void>;
  createClient: (clientData: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, clientData: Omit<Client, 'id'>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,

  // Obtener todos los clientes
  fetchClients: async () => {
    set({ isLoading: true });
    try {
      const records = await pb.collection('clients').getFullList({ sort: '-created' });
      const clients = records.map((record) => ({
        id: record.id,
        name: record.name,
        email: record.email,
        quote: record.quote, 
        assigned: record.assigned,
      }));
      set({ clients, isLoading: false });
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      set({ isLoading: false });
    }
  },

  // Obtener un cliente por ID
  fetchClientById: async (id) => {
    set({ isLoading: true });
    try {
      const record = await pb.collection('clients').getOne(id);
      const client = {
        id: record.id,
        name: record.name,
        email: record.email,
        quote: record.quote,
        assigned: record.assigned,
      };
      set({ selectedClient: client, isLoading: false });
    } catch (error) {
      console.error(`Error al obtener el cliente con ID ${id}:`, error);
      set({ isLoading: false });
    }
  },

  // Crear un cliente
  createClient: async (clientData) => {
    set({ isLoading: true });
    try {
      const data = {
        name: clientData.name,
        email: clientData.email,
        quote: clientData.quote, // Texto plano
        assigned: clientData.assigned,
      };
  
      const record = await pb.collection("clients").create(data);
      console.log("Cliente creado:", record);
  
      set({ isLoading: false });
      await useClientStore.getState().fetchClients(); // Actualizar lista de clientes
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      set({ isLoading: false });
    }
  },
  

  // Actualizar un cliente
  updateClient: async (id, clientData) => {
    set({ isLoading: true });
    try {
      const record = await pb.collection("clients").update(id, clientData);
      console.log("Cliente actualizado:", record);
      set({ isLoading: false });
      await useClientStore.getState().fetchClients(); // Actualizar lista de clientes
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      set({ isLoading: false });
    }
  },

  // Eliminar un cliente
  deleteClient: async (id) => {
    set({ isLoading: true });
    try {
      await pb.collection('clients').delete(id);
      set({ isLoading: false });
      await useClientStore.getState().fetchClients(); // Actualizar lista de clientes
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      set({ isLoading: false });
    }
  },
}));

export default useClientStore;
