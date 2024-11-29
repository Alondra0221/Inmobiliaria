import { create } from 'zustand';
import axios from '../lib/axiosInstance';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  totalSales: number;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { agent: user } = response.data;

      // Guardar el usuario y cambiar el estado de autenticación
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al iniciar sesión',
        isLoading: false,
      });
    }
  },

  logout: () => {
    // Limpiar el estado al cerrar sesión
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;