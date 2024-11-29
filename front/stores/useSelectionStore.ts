// src/store/useSelectionStore.ts
import { create } from "zustand";

interface Property {
  id: string;
  name: string;
  description: string;
  cost: number;
  location: string;
  image?: string;
}

interface Item {
  id: string;
  name: string;
  cost: number;
  skill: string;
  image?: string;
}

interface Builder {
  id: string;
  name: string;
  cost: number;
  experience: string;
  estimated_time: string;
  skill: string;
  image?: string;
}

interface SelectionStore {
  selectedProperty: Property | null;
  selectedItems: Item[];
  selectedBuilders: Builder[];
  currentBudget: string; // Presupuesto como texto plano
  totalCost: () => number;
  generateBudget: () => void;
  resetSelections: () => void;
  updateSelectedProperty: (property: Property) => void;
  updateSelectedItems: (items: Item[]) => void;
  updateSelectedBuilders: (builders: Builder[]) => void;
}

const useSelectionStore = create<SelectionStore>((set, get) => ({
  selectedProperty: null,
  selectedItems: [],
  selectedBuilders: [],
  currentBudget: "",

  // Calcula el costo total
  totalCost: () => {
    const { selectedProperty, selectedItems, selectedBuilders } = get();
    const propertyCost = selectedProperty?.cost || 0;
    const itemsCost = selectedItems.reduce((sum, item) => sum + item.cost, 0);
    const buildersCost = selectedBuilders.reduce((sum, builder) => sum + builder.cost, 0);
    return propertyCost + itemsCost + buildersCost;
  },

  // Genera el presupuesto en texto plano
  generateBudget: () => {
    const { selectedProperty, selectedItems, selectedBuilders, totalCost } = get();
  
    let budget = "";
  
    if (selectedProperty) {
      budget += `Propiedad seleccionada: ${selectedProperty.name}, Costo: $${selectedProperty.cost}, Ubicación: ${selectedProperty.location}\n`;
    }
  
    if (selectedItems.length > 0) {
      budget += "Ítems seleccionados:\n";
      selectedItems.forEach((item) => {
        budget += ` - ${item.name}, Costo: $${item.cost}, Habilidad: ${item.skill}\n`;
      });
    }
  
    if (selectedBuilders.length > 0) {
      budget += "Albañiles seleccionados:\n";
      selectedBuilders.forEach((builder) => {
        budget += ` - ${builder.name}, Experiencia: ${builder.experience} años, Habilidad: ${builder.skill}, Costo: $${builder.cost}\n`;
      });
    }
  
    budget += `\nPrecio total: $${totalCost()}`;
  
    set({ currentBudget: budget });
  },
  
  
  // Reinicia las selecciones
  resetSelections: () =>
    set({
      selectedProperty: null,
      selectedItems: [],
      selectedBuilders: [],
      currentBudget: "",
    }),

  // Actualiza la propiedad seleccionada
  updateSelectedProperty: (property) => set({ selectedProperty: property }),

  // Actualiza los ítems seleccionados
  updateSelectedItems: (items) => set({ selectedItems: items }),

  // Actualiza los albañiles seleccionados
  updateSelectedBuilders: (builders) => set({ selectedBuilders: builders }),
}));

export default useSelectionStore;
