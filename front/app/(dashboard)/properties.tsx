import React, { useEffect, useState } from "react";
import { View, TextInput, Alert, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import usePropertyStore from "~/stores/usePropertyStore";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function Properties() {
  const {
    properties,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    isLoading,
  } = usePropertyStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
    location: "",
    image: undefined as string | File | undefined,
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;

      // Convertir URI a un archivo válido (File)
      const response = await fetch(uri);
      const blob = await response.blob();
      const file = new File([blob], "uploaded_image.jpg", { type: blob.type });

      // Actualizar formData con el archivo
      setFormData({ ...formData, image: file });
    }
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.cost ||
      !formData.location
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      if (isEditing && selectedPropertyId) {
        await updateProperty(selectedPropertyId, {
          ...formData,
          cost: parseFloat(formData.cost),
        });
        Alert.alert("Éxito", "Propiedad actualizada correctamente.");
      } else {
        await createProperty({
          ...formData,
          cost: parseFloat(formData.cost),
        });
        Alert.alert("Éxito", "Propiedad creada correctamente.");
      }
      resetForm();
      fetchProperties();
    } catch (error) {
      console.error("Error al guardar la propiedad:", error);
    }
  };

  const handleDelete = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId);
      fetchProperties();
      Alert.alert("Éxito", "Propiedad eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la propiedad:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      cost: "",
      location: "",
      image: undefined,
    });
    setIsEditing(false);
    setSelectedPropertyId(null);
  };

  const startEditing = (property: any) => {
    setFormData({
      name: property.name,
      description: property.description,
      cost: property.cost.toString(),
      location: property.location,
      image: property.image || undefined, // Usar URL o undefined
    });
    setIsEditing(true);
    setSelectedPropertyId(property.id);
  };

  return (
    <ScrollView className="p-4">
      <Text className="text-lg font-bold mb-4">Gestión de Propiedades</Text>

      {/* Diálogo para Agregar o Editar */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Text>{isEditing ? "Editar Propiedad" : "Agregar Propiedad"}</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle className="text-white font-bold">
              {isEditing ? "Editar Propiedad" : "Nueva Propiedad"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edita la propiedad seleccionada."
                : "Completa los datos para agregar una nueva propiedad."}
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nombre"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            className="border p-2 mb-2 rounded"
          />
          <Input
            placeholder="Descripción"
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
            className="border p-2 mb-2 rounded"
            multiline
          />
          <Input
            placeholder="Costo"
            value={formData.cost}
            onChangeText={(value) => handleInputChange("cost", value)}
            className="border p-2 mb-2 rounded"
            keyboardType="numeric"
          />
          <Input
            placeholder="Ubicación"
            value={formData.location}
            onChangeText={(value) => handleInputChange("location", value)}
            className="border p-2 mb-2 rounded"
          />
          <Button onPress={handleSelectImage} className="mt-2">
            <Text>Seleccionar Imagen</Text>
          </Button>
          {formData.image && typeof formData.image === "string" ? (
            <Image
              source={{ uri: `https://lomi.pockethost.io/api/files/f8thakhtternzyt/${selectedPropertyId}/${formData.image}` }}
              style={{
                width: "100%",
                height: 150,
                marginTop: 10,
                borderRadius: 8,
              }}
            />
          ) : formData.image instanceof File ? (
            <Text>Imagen seleccionada: {formData.image.name}</Text>
          ) : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onPress={resetForm}>
                <Text>Cancelar</Text>
              </Button>
            </DialogClose>
            <Button onPress={handleSave}>
              <Text>{isEditing ? "Actualizar" : "Guardar"}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Listado de Propiedades */}
      {isLoading ? (
        <Text>Cargando propiedades...</Text>
      ) : (
        properties.map((property) => (
          <Card key={property.id} className="mb-4">
            <CardHeader>
              <Text className="text-lg font-semibold">{property.name}</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                {property.description}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Ubicacion: {property.location}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Costo: ${property.cost}
              </Text>
            </CardHeader>
            <CardContent>
              {/* {property.image && (
                <Image
                  source={{
                    uri: `https://lomi.pockethost.io/api/files/f8thakhtternzyt/${property.id}/${property.image}`,
                  }}
                  style={{ width: "100%", height: 150, marginTop: 10, borderRadius: 8 }}
                />
              )} */}
              {property.image &&
              Array.isArray(property.image) &&
              property.image.length > 0 ? (
                <Image
                  source={{
                    uri: `https://lomi.pockethost.io/api/files/f8thakhtternzyt/${
                      property.id
                    }/${property.image.slice(-1)[0]}`,
                  }}
                  style={{
                    width: "100%",
                    height: 150,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                />
              ) : property.image && typeof property.image === "string" ? (
                <Image
                  source={{
                    uri: `https://lomi.pockethost.io/api/files/f8thakhtternzyt/${property.id}/${property.image}`,
                  }}
                  style={{
                    width: "100%",
                    height: 150,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                />
              ) : null}
              <View className="flex-row justify-between mt-2">
                {/* Botón Editar */}
                <Button onPress={() => startEditing(property)}>
                  <Text>Editar</Text>
                </Button>

                {/* Diálogo para Eliminar */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Text className="text-white">Eliminar</Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Eliminar Propiedad</DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar esta propiedad?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">
                          <Text className="text-black">Cancelar</Text>
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onPress={() => handleDelete(property.id)}
                      >
                        <Text className="text-white">Eliminar</Text>
                        
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </View>
            </CardContent>
          </Card>
        ))
      )}
    </ScrollView>
  );
}
