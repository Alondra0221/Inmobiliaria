import { create } from 'zustand';
import pb from '~/lib/pb';

interface Property {
    id: string;
    name: string;
    description: string;
    cost: number;
    location: string;
    image?: string | File | Array<string | File>;
}

interface PropertyStore {
    properties: Property[];
    selectedProperty: Property | null;
    isLoading: boolean;
    fetchProperties: () => Promise<void>;
    fetchPropertyById: (id: string) => Promise<void>;
    createProperty: (propertyData: Omit<Property, 'id'>) => Promise<void>;
    updateProperty: (id: string, propertyData: Omit<Property, 'id'>) => Promise<void>;
    deleteProperty: (id: string) => Promise<void>;
}

const usePropertyStore = create<PropertyStore>((set) => ({
    properties: [],
    selectedProperty: null,
    isLoading: false,

    // Obtener todas las propiedades
    fetchProperties: async () => {
        set({ isLoading: true });
        try {
            const records = await pb.collection('properties').getFullList({ sort: '-created' });
            const properties = records.map((record) => ({
                id: record.id,
                name: record.name,
                description: record.description,
                cost: record.cost,
                location: record.location,
                image: record.image, // Ajusta según el campo de tu base de datos
            }));
            set({ properties, isLoading: false });
        } catch (error) {
            console.error('Error al obtener propiedades:', error);
            set({ isLoading: false });
        }
    },

    // Obtener una propiedad por ID
    fetchPropertyById: async (id) => {
        set({ isLoading: true });
        try {
            const record = await pb.collection('properties').getOne(id);
            const property = {
                id: record.id,
                name: record.name,
                description: record.description,
                cost: record.cost,
                location: record.location,
                image: record.image, // Ajusta según el campo de tu base de datos
            };
            set({ selectedProperty: property, isLoading: false });
        } catch (error) {
            console.error(`Error al obtener la propiedad con ID ${id}:`, error);
            set({ isLoading: false });
        }
    },

    // Crear una nueva propiedad
    createProperty: async (propertyData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append('name', propertyData.name);
            formData.append('description', propertyData.description);
            formData.append('cost', propertyData.cost.toString());
            formData.append('location', propertyData.location);
        // Subir cada imagen del arreglo
        if (Array.isArray(propertyData.image)) {
          propertyData.image.forEach((img, index) => {
              formData.append(`image_${index}`, img); // Asignar un nombre único
          });
      } else if (propertyData.image) {
          formData.append('image', propertyData.image);
      }

            await pb.collection('properties').create(formData);
            set({ isLoading: false });
            await usePropertyStore.getState().fetchProperties(); // Actualizar lista de propiedades
        } catch (error) {
            console.error('Error al crear la propiedad:', error);
            set({ isLoading: false });
        }
    },

    // Actualizar una propiedad existente
    updateProperty: async (id, propertyData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append('name', propertyData.name);
            formData.append('description', propertyData.description);
            formData.append('cost', propertyData.cost.toString());
            formData.append('location', propertyData.location);
        // Subir cada imagen del arreglo
        if (Array.isArray(propertyData.image)) {
          propertyData.image.forEach((img, index) => {
              formData.append(`image_${index}`, img); // Asignar un nombre único
          });
      } else if (propertyData.image) {
          formData.append('image', propertyData.image);
      }

            await pb.collection('properties').update(id, formData);
            set({ isLoading: false });
            await usePropertyStore.getState().fetchProperties(); // Actualizar lista de propiedades
        } catch (error) {
            console.error('Error al actualizar la propiedad:', error);
            set({ isLoading: false });
        }
    },

    // Eliminar una propiedad por ID
    deleteProperty: async (id) => {
        set({ isLoading: true });
        try {
            await pb.collection('properties').delete(id);
            set({ isLoading: false });
            await usePropertyStore.getState().fetchProperties(); // Actualizar lista de propiedades
        } catch (error) {
            console.error('Error al eliminar la propiedad:', error);
            set({ isLoading: false });
        }
    },
}));

export default usePropertyStore;
