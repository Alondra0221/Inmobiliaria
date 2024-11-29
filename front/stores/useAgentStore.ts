import { create } from "zustand";
import pb from "~/lib/pb";

interface User {
    id: string;
    username: string;
    email: string;
    emailVisibility: boolean;
    password?: string;
    passwordConfirm?: string;
    name: string;
    totalSales: number;
    image?: string | File | Array<string | File>;
}

interface UserStore {
    users: User[];
    selectedUser: User | null;
    isLoading: boolean;
    fetchUsers: () => Promise<void>;
    fetchUserById: (id: string) => Promise<void>;
    createUser: (userData: Omit<User, "id">) => Promise<void>;
    updateUser: (id: string, userData: Omit<User, "id">) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
    users: [],
    selectedUser: null,
    isLoading: false,

    // Obtener todos los usuarios
    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            const records = await pb.collection("users").getFullList({
                sort: "-created",
            });
            const users = records.map((record) => ({
                id: record.id,
                username: record.username,
                email: record.email,
                emailVisibility: record.emailVisibility,
                name: record.name,
                totalSales: record.totalSales,
                image: record.image,
            }));
            set({ users, isLoading: false });
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            set({ isLoading: false });
        }
    },

    // Obtener un usuario por ID
    fetchUserById: async (id) => {
        set({ isLoading: true });
        try {
            const record = await pb.collection("users").getOne(id);
            const user = {
                id: record.id,
                username: record.username,
                email: record.email,
                emailVisibility: record.emailVisibility,
                name: record.name,
                totalSales: record.totalSales,
                image: record.image,
            };
            set({ selectedUser: user, isLoading: false });
        } catch (error) {
            console.error(`Error al obtener el usuario con ID ${id}:`, error);
            set({ isLoading: false });
        }
    },

    // Crear un nuevo usuario
    createUser: async (userData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("username", userData.username);
            formData.append("email", userData.email);
            formData.append("emailVisibility", userData.emailVisibility.toString());
            if (userData.password) formData.append("password", userData.password);
            if (userData.passwordConfirm)
                formData.append("passwordConfirm", userData.passwordConfirm);
            formData.append("name", userData.name);
            formData.append("totalSales", userData.totalSales.toString());
            if (Array.isArray(userData.image)) {
                userData.image.forEach((img, index) =>
                    formData.append(`image_${index}`, img)
                );
            } else if (userData.image) {
                formData.append("image", userData.image);
            }

            await pb.collection("users").create(formData);
            set({ isLoading: false });
            await useUserStore.getState().fetchUsers();
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            set({ isLoading: false });
        }
    },

    // Actualizar un usuario existente
    updateUser: async (id, userData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("username", userData.username);
            formData.append("emailVisibility", userData.emailVisibility.toString());
            if (userData.password) formData.append("password", userData.password);
            if (userData.passwordConfirm)
                formData.append("passwordConfirm", userData.passwordConfirm);
            formData.append("name", userData.name);
            formData.append("totalSales", userData.totalSales.toString());
            if (Array.isArray(userData.image)) {
                userData.image.forEach((img, index) =>
                    formData.append(`image_${index}`, img)
                );
            } else if (userData.image) {
                formData.append("image", userData.image);
            }

            await pb.collection("users").update(id, formData);
            set({ isLoading: false });
            await useUserStore.getState().fetchUsers();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            set({ isLoading: false });
        }
    },

    // Eliminar un usuario por ID
    deleteUser: async (id) => {
        set({ isLoading: true });
        try {
            await pb.collection("users").delete(id);
            set({ isLoading: false });
            await useUserStore.getState().fetchUsers();
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            set({ isLoading: false });
        }
    },
}));

export default useUserStore;
