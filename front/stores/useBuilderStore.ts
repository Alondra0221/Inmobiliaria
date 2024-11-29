import { create } from "zustand";
import pb from "~/lib/pb";

interface Builder {
    id: string;
    name: string;
    cost: number;
    experience: string; // Años de experiencia, ejemplo: "5 años"
    estimated_time: string; // Tiempo estimado, ejemplo: "2 semanas"
    skill: string; // Habilidad principal
    image?: string | File | Array<string | File>;
}

interface BuilderStore {
    builders: Builder[];
    selectedBuilder: Builder | null;
    isLoading: boolean;
    fetchBuilders: () => Promise<void>;
    fetchBuilderById: (id: string) => Promise<void>;
    createBuilder: (builderData: Omit<Builder, "id">) => Promise<void>;
    updateBuilder: (id: string, builderData: Omit<Builder, "id">) => Promise<void>;
    deleteBuilder: (id: string) => Promise<void>;
}

const useBuilderStore = create<BuilderStore>((set) => ({
    builders: [],
    selectedBuilder: null,
    isLoading: false,

    // Obtener todos los constructores
    fetchBuilders: async () => {
        set({ isLoading: true });
        try {
            const records = await pb.collection("builders").getFullList({
                sort: "-created",
            });
            const builders = records.map((record) => ({
                id: record.id,
                name: record.name,
                cost: record.cost,
                experience: record.experience,
                estimated_time: record.estimated_time,
                skill: record.skill,
                image: record.image,
            }));
            set({ builders, isLoading: false });
        } catch (error) {
            console.error("Error al obtener los constructores:", error);
            set({ isLoading: false });
        }
    },

    // Obtener un constructor por ID
    fetchBuilderById: async (id) => {
        set({ isLoading: true });
        try {
            const record = await pb.collection("builders").getOne(id);
            const builder = {
                id: record.id,
                name: record.name,
                cost: record.cost,
                experience: record.experience,
                estimated_time: record.estimated_time,
                skill: record.skill,
                image: record.image,
            };
            set({ selectedBuilder: builder, isLoading: false });
        } catch (error) {
            console.error(`Error al obtener el constructor con ID ${id}:`, error);
            set({ isLoading: false });
        }
    },

    // Crear un nuevo constructor
    createBuilder: async (builderData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("name", builderData.name);
            formData.append("cost", builderData.cost.toString());
            formData.append("experience", builderData.experience);
            formData.append("estimated_time", builderData.estimated_time);
            formData.append("skill", builderData.skill);
            if (Array.isArray(builderData.image)) {
                builderData.image.forEach((img, index) => {
                    formData.append(`image_${index}`, img);
                });
            } else if (builderData.image) {
                formData.append("image", builderData.image);
            }

            await pb.collection("builders").create(formData);
            set({ isLoading: false });
            await useBuilderStore.getState().fetchBuilders();
        } catch (error) {
            console.error("Error al crear el constructor:", error);
            set({ isLoading: false });
        }
    },

    // Actualizar un constructor existente
    updateBuilder: async (id, builderData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("name", builderData.name);
            formData.append("cost", builderData.cost.toString());
            formData.append("experience", builderData.experience);
            formData.append("estimated_time", builderData.estimated_time);
            formData.append("skill", builderData.skill);
            if (Array.isArray(builderData.image)) {
                builderData.image.forEach((img, index) => {
                    formData.append(`image_${index}`, img);
                });
            } else if (builderData.image) {
                formData.append("image", builderData.image);
            }

            await pb.collection("builders").update(id, formData);
            set({ isLoading: false });
            await useBuilderStore.getState().fetchBuilders();
        } catch (error) {
            console.error("Error al actualizar el constructor:", error);
            set({ isLoading: false });
        }
    },

    // Eliminar un constructor por ID
    deleteBuilder: async (id) => {
        set({ isLoading: true });
        try {
            await pb.collection("builders").delete(id);
            set({ isLoading: false });
            await useBuilderStore.getState().fetchBuilders();
        } catch (error) {
            console.error("Error al eliminar el constructor:", error);
            set({ isLoading: false });
        }
    },
}));

export default useBuilderStore;
