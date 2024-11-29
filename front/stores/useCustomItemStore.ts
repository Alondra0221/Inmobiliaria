import { create } from "zustand";
import pb from "~/lib/pb";

interface CustomItem {
    id: string;
    name: string;
    cost: number;
    skill: string;
    image?: string | File | Array<string | File>; // Manejo de imágenes
}

interface CustomItemStore {
    items: CustomItem[];
    selectedItem: CustomItem | null;
    isLoading: boolean;
    fetchItems: () => Promise<void>;
    fetchItemById: (id: string) => Promise<void>;
    createItem: (itemData: Omit<CustomItem, "id">) => Promise<void>;
    updateItem: (id: string, itemData: Omit<CustomItem, "id">) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
}

const useCustomItemStore = create<CustomItemStore>((set) => ({
    items: [],
    selectedItem: null,
    isLoading: false,

    // Obtener todos los ítems
    fetchItems: async () => {
        set({ isLoading: true });
        try {
            const records = await pb.collection("customItems").getFullList({
                sort: "-created",
            });
            const items = records.map((record) => ({
                id: record.id,
                name: record.name,
                cost: record.cost,
                skill: record.skill,
                image: record.image, // Ajusta según el campo de tu base de datos
            }));
            set({ items, isLoading: false });
        } catch (error) {
            console.error("Error al obtener los ítems:", error);
            set({ isLoading: false });
        }
    },

    // Obtener un ítem por ID
    fetchItemById: async (id) => {
        set({ isLoading: true });
        try {
            const record = await pb.collection("customItems").getOne(id);
            const item = {
                id: record.id,
                name: record.name,
                cost: record.cost,
                skill: record.skill,
                image: record.image, // Ajusta según el campo de tu base de datos
            };
            set({ selectedItem: item, isLoading: false });
        } catch (error) {
            console.error(`Error al obtener el ítem con ID ${id}:`, error);
            set({ isLoading: false });
        }
    },

    // Crear un nuevo ítem
    createItem: async (itemData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("name", itemData.name);
            formData.append("cost", itemData.cost.toString());
            formData.append("skill", itemData.skill);
            /*if (Array.isArray(itemData.image)) {
                itemData.image.forEach((img, index) => {
                    formData.append(`image_${index}`, img); // Subir múltiples imágenes
                });
            } else if (itemData.image) {
                formData.append("image", itemData.image); // Subir una sola imagen
            }*/
            if (itemData.image) {
                    if (typeof itemData.image === "string") {
                        const response = await fetch(itemData.image);
                        const blob = await response.blob();
                        formData.append("image", blob, "uploaded_image.jpg");
                    } else if (itemData.image instanceof File) {
                        formData.append("image", itemData.image);
                    }
            }
            
           

            await pb.collection("customItems").create(formData);
            set({ isLoading: false });
            await useCustomItemStore.getState().fetchItems(); // Actualizar lista de ítems
        } catch (error) {
            console.error("Error al crear el ítem:", error);
            set({ isLoading: false });
        }
    },

    // Actualizar un ítem existente
    updateItem: async (id, itemData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("name", itemData.name);
            formData.append("cost", itemData.cost.toString());
            formData.append("skill", itemData.skill);
            if (Array.isArray(itemData.image)) {
                itemData.image.forEach((img, index) => {
                    formData.append(`image_${index}`, img); // Subir múltiples imágenes
                });
            } else if (itemData.image) {
                formData.append("image", itemData.image); // Subir una sola imagen
            }

            await pb.collection("customItems").update(id, formData);
            set({ isLoading: false });
            await useCustomItemStore.getState().fetchItems(); // Actualizar lista de ítems
        } catch (error) {
            console.error("Error al actualizar el ítem:", error);
            set({ isLoading: false });
        }
    },

    // Eliminar un ítem por ID
    deleteItem: async (id) => {
        set({ isLoading: true });
        try {
            await pb.collection("customItems").delete(id);
            set({ isLoading: false });
            await useCustomItemStore.getState().fetchItems(); // Actualizar lista de ítems
        } catch (error) {
            console.error("Error al eliminar el ítem:", error);
            set({ isLoading: false });
        }
    },
}));

export default useCustomItemStore;
