import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import usePropertyStore from "~/stores/usePropertyStore";
import useCustomItemStore from "~/stores/useCustomItemStore";
import useBuilderStore from "~/stores/useBuilderStore";
import useSelectionStore from "~/stores/useSelectionStore";
import useClientStore from "~/stores/useClientStore";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

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

interface Client {
  id: string;
  name: string;
  email: string;
  quote: Record<string, any>;
}

export default function Quoter() {
  const { properties, fetchProperties } = usePropertyStore();
  const { items, fetchItems } = useCustomItemStore();
  const { builders, fetchBuilders } = useBuilderStore();

  const {
    selectedProperty,
    updateSelectedProperty,
    selectedItems,
    updateSelectedItems,
    selectedBuilders,
    updateSelectedBuilders,
    generateBudget,
    currentBudget,
    resetSelections,
  } = useSelectionStore();

  const { createClient } = useClientStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const totalCost = useSelectionStore((state) => state.totalCost);

  const handleNext = () => {
    setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleConfirm = async () => {
    if (!clientName || !clientEmail) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Generar el presupuesto actual como texto plano
    generateBudget();
    const budget = currentBudget; // Obtener el presupuesto generado

    if (!budget || budget.trim() === "") {
      console.log("No se encontró presupuesto para el cliente.");
      return;
    }

    const data = {
      name: clientName,
      email: clientEmail,
      quote: budget,
      assigned: false,
    };

    try {
      console.log("Enviando datos a PocketBase:", data); // Depuración

      // Enviar a PocketBase
      await createClient(data);
      alert("Cotización agregada correctamente.");

      // Limpiar campos y cerrar diálogo
      setClientName("");
      setClientEmail("");
      setIsDialogOpen(false);

      // Restablecer el formulario de selección
      resetSelections();
      setStep(1);
    } catch (error) {
      console.error("Error al guardar la cotización en PocketBase:", error);
      alert("Hubo un error al guardar la cotización.");
    }
  };

  useEffect(() => {
    fetchProperties(); // Cargar propiedades al montar el componente
    fetchItems(); // Cargar ítems al montar el componente
    fetchBuilders(); // Cargar constructores al montar el componente
  }, []);

  const handleSelectProperty = (property: Property) => {
    updateSelectedProperty(property);
  };

  const handleSelectItem = (item: Item) => {
    const isSelected = selectedItems.some(
      (selected) => selected.id === item.id
    );
    const updatedItems = isSelected
      ? selectedItems.filter((selected) => selected.id !== item.id)
      : [...selectedItems, item];
    updateSelectedItems(updatedItems);
  };

  const handleSelectBuilder = (builder: Builder) => {
    const isSelected = selectedBuilders.some(
      (selected) => selected.id === builder.id
    );
    const updatedBuilders = isSelected
      ? selectedBuilders.filter((selected) => selected.id !== builder.id)
      : [...selectedBuilders, builder];
    updateSelectedBuilders(updatedBuilders);
  };

  const renderStepIndicator = () => {
    const indicators = [];
    for (let i = 1; i <= totalSteps; i++) {
      indicators.push(
        <View key={i} className="flex-row items-center">
          <View
            className={`w-9 h-9 rounded-full border-2 flex justify-center items-center ${
              i <= step
                ? "border-primary bg-primary dark:border-primary dark:bg-primary"
                : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
            }`}
          >
            <Text
              className={`font-bold text-lg ${
                i <= step
                  ? "text-white dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {i}
            </Text>
          </View>
          {i < totalSteps && (
            <View
              className={`w-5 h-0.5 mx-2 ${
                i < step
                  ? "bg-primary dark:bg-primary"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            />
          )}
        </View>
      );
    }
    return <View className="flex-row mb-5">{indicators}</View>;
  };

  const renderPropertyItem = ({ item }: { item: Property }) => {
    const isSelected = selectedProperty?.id === item.id; // Verificar si esta propiedad está seleccionada

    // Obtener la última imagen de la lista
    const lastImage =
      Array.isArray(item.image) && item.image.length > 0
        ? item.image[item.image.length - 1]
        : typeof item.image === "string"
        ? item.image
        : null;

    return (
      <TouchableOpacity onPress={() => handleSelectProperty(item)}>
        <Card
          className={`mb-2 border ${
            isSelected ? "border-primary" : "border-gray-300"
          }`}
          style={{
            width: 320, // Ajusta el ancho de la tarjeta
            alignSelf: "center", // Centra la tarjeta en su contenedor
            borderRadius: 10, // Bordes redondeados para consistencia
          }}
        >
          <CardHeader>
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-100">
              {item.description}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-100">
              Ubicación: {item.location}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-100">
              Costo: ${item.cost}
            </Text>
          </CardHeader>
          <CardContent>
            {lastImage ? (
              <Image
                source={{
                  uri: `https://lomi.pockethost.io/api/files/f8thakhtternzyt/${item.id}/${lastImage}`,
                }}
                alt="propiedad"
                className="w-full h-full object-cover rounded-lg"
                resizeMode="cover"
                style={{
                  width: "100%", // La imagen ocupará todo el ancho de la tarjeta
                  height: 200, // Fijar una altura consistente
                }}
              />
            ) : (
              // <img
              //   src={`https://lomi.pockethost.io/api/files/f8thakhtternzyt/${item.id}/${lastImage}`}
              //   alt="propiedad"
              //   className="w-full h-full object-cover rounded-lg"
              // />

              <Text className="text-gray-500">
                No hay imágenes disponibles.
              </Text>
            )}
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderCustomItemItem = ({ item }: { item: Item }) => {
    const isSelected = selectedItems.some(
      (selected) => selected.id === item.id
    );

    return (
      <TouchableOpacity onPress={() => handleSelectItem(item)}>
        <Card
          className={`mb-2 border ${
            isSelected ? "border-primary bg-primary-light" : "border-gray-300"
          }`}
          style={{
            width: 320, // Ajusta el ancho de la tarjeta
            alignSelf: "center", // Centra la tarjeta en su contenedor
            borderRadius: 10, // Bordes redondeados para consistencia
          }}
        >
          <CardHeader>
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-100">
              Costo: ${item.cost}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-100">
              Habilidad: {item.skill}
            </Text>
          </CardHeader>
          <CardContent>
            {item.image ? (
              // <img
              //   src={`https://lomi.pockethost.io/api/files/customItems/${item.id}/${item.image}`}
              //   alt="item"
              //   className="w-full h-full object-cover rounded-lg"
              // />
              <Image
                source={{
                  uri: `https://lomi.pockethost.io/api/files/customItems/${item.id}/${item.image}`,
                }}
                alt="item"
                className="w-full h-full object-cover rounded-lg"
                resizeMode="cover"
                style={{
                  width: "100%", // La imagen ocupará todo el ancho de la tarjeta
                  height: 200, // Fijar una altura consistente
                }}
              />
            ) : (
              <Text className="text-gray-500">
                No hay imágenes disponibles.
              </Text>
            )}
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderBuilderItem = ({ item }: { item: Builder }) => {
    const isSelected = selectedBuilders.some(
      (selected) => selected.id === item.id
    );

    return (
      <TouchableOpacity onPress={() => handleSelectBuilder(item)}>
        <Card
          className={`mb-2 border ${
            isSelected ? "border-primary bg-primary-light" : "border-gray-300"
          }`}
          style={{
            width: 320, // Ajusta el ancho de la tarjeta
            alignSelf: "center", // Centra la tarjeta en su contenedor
            borderRadius: 10, // Bordes redondeados para consistencia
          }}
        >
          <CardHeader>
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-100">
              Costo: ${item.cost}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-100">
              Experiencia: {item.experience} años
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-100">
              Habilidad: {item.skill}
            </Text>
          </CardHeader>
          <CardContent>
            {item.image ? (
              <Image
                source={{
                  uri: `https://lomi.pockethost.io/api/files/builders/${item.id}/${item.image}`,
                }}
                alt="builder"
                className="w-full h-full object-cover rounded-lg"
                resizeMode="cover"
                style={{
                  width: "100%", // La imagen ocupará todo el ancho de la tarjeta
                  height: 200, // Fijar una altura consistente
                }}
              />
            ) : (
              // <img
              //   src={`https://lomi.pockethost.io/api/files/builders/${item.id}/${item.image}`}
              //   alt="builder"
              //   className="w-full h-full object-cover rounded-lg"
              // />
              <Text className="text-gray-500">
                No hay imágenes disponibles.
              </Text>
            )}
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 pt-5 items-center">
      {renderStepIndicator()}

      <View className="flex-1 justify-center items-center">
        {step === 1 && (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id}
            renderItem={renderPropertyItem}
            ListEmptyComponent={<Text>No se encontraron propiedades.</Text>}
          />
        )}
        {step === 2 && (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderCustomItemItem}
            ListEmptyComponent={<Text>No se encontraron ítems.</Text>}
          />
        )}
        {step === 3 && (
          <FlatList
            data={builders}
            keyExtractor={(item) => item.id}
            renderItem={renderBuilderItem}
            ListEmptyComponent={<Text>No se encontraron albañiles.</Text>}
          />
        )}
        {/* Paso 4 - Mostrar presupuesto */}
        {step === 4 && (
          <ScrollView className="p-4">
            <Text className="text-lg font-bold">Resumen de la selección:</Text>
            <View className="mt-4">
              {selectedProperty && (
                <Text className="mb-2">
                  <Text className="font-semibold">Propiedad:</Text>{" "}
                  {selectedProperty.name}
                </Text>
              )}
              {selectedItems.length > 0 && (
                <Text className="mb-2">
                  <Text className="font-semibold">Ítems:</Text>{" "}
                  {selectedItems.map((item) => item.name).join(", ")}
                </Text>
              )}
              {selectedBuilders.length > 0 && (
                <Text className="mb-2">
                  <Text className="font-semibold">Albañiles:</Text>{" "}
                  {selectedBuilders.map((builder) => builder.name).join(", ")}
                </Text>
              )}
              <Text>
                <Text className="font-semibold">Total:</Text> ${totalCost()}
              </Text>
            </View>
          </ScrollView>
        )}

        <View className="flex-row mb-5">
          {/* Botón "Anterior" */}
          {step > 1 && (
            <Button
              onPress={handlePrevious}
              className="px-5 py-2 rounded-full bg-gray-300 dark:bg-gray-800 mr-2"
            >
              <Text className="font-bold text-gray-600 dark:text-gray-200">
                Anterior
              </Text>
            </Button>
          )}

          {/* Botón "Siguiente" */}
          {step < totalSteps ? (
            <Button
              onPress={handleNext}
              className="px-5 py-2 rounded-full bg-primary dark:bg-primary"
            >
              <Text className="font-bold text-white dark:text-white">
                Siguiente
              </Text>
            </Button>
          ) : (
            // Botón "Agregar Cotización" en el último paso
            <>
              <Button
                onPress={() => setIsDialogOpen(true)}
                className="px-5 py-2 rounded-full bg-primary dark:bg-primary"
              >
                <Text className="font-bold text-white dark:text-white">
                  Agregar Cotización
                </Text>
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirmar acción</DialogTitle>
                    <DialogDescription>
                      ¿Estás seguro de que deseas agregar esta cotización? Esta
                      acción reiniciará el proceso.
                    </DialogDescription>
                  </DialogHeader>
                  <View className="mb-4">
                    {/* Campos para ingresar nombre y correo */}
                    <Input
                      placeholder="Nombre"
                      value={clientName}
                      onChangeText={setClientName}
                      className="border p-2 rounded mb-2 w-full"
                    />
                    <Input
                      placeholder="Correo electrónico"
                      value={clientEmail}
                      onChangeText={setClientEmail}
                      className="border p-2 rounded w-full"
                      keyboardType="email-address"
                    />
                  </View>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        onPress={() => setIsDialogOpen(false)}
                        className="bg-white dark:bg-gray-800"
                      >
                        <Text>Cancelar</Text>
                      </Button>
                    </DialogClose>
                    <Button onPress={handleConfirm}>
                      <Text>Confirmar</Text>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
