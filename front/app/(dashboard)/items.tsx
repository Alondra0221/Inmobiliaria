import React, { useEffect, useState } from "react";
import { View, Alert, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
//import * as ImagePicker from 'react-native-image-crop-picker';
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
import useCustomItemStore from "~/stores/useCustomItemStore";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function Items() {
  const { items, fetchItems, createItem, updateItem, deleteItem, isLoading } =
    useCustomItemStore();

  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    skill: "",
    image: undefined as string | File | undefined,
  });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchItems();
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

      setFormData({ ...formData, image: file });
    }
  };
  /*const handleSelectImage = async () => {
    try {
      // Abre la galería con la opción de recorte
      const image = await ImagePicker.openPicker({
        width: 300, // Ancho del recorte (ajústalo según tus necesidades)
        height: 300, // Altura del recorte
        cropping: true, // Habilita el recorte de la imagen
        includeBase64: false, // No necesitamos la imagen como base64
      });
  
      // Convierte la imagen seleccionada en un objeto File
      const response = await fetch(image.path);
      const blob = await response.blob();
      const file = new File([blob], image.filename || "uploaded_image.jpg", {
        type: image.mime,
      });
  
      // Actualiza el estado con la imagen seleccionada
      setFormData({ ...formData, image: file });
    } catch (error) {
      console.error("Error seleccionando la imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };*/

  const handleSave = async () => {
    if (!formData.name || !formData.cost) {
      Alert.alert("Error", "Los campos nombre y costo son obligatorios.");
      return;
    }

    try {
      if (isEditing && selectedItemId) {
        await updateItem(selectedItemId, {
          ...formData,
          cost: parseFloat(formData.cost),
        });
        Alert.alert("Éxito", "Ítem actualizado correctamente.");
      } else {
        await createItem({
          ...formData,
          cost: parseFloat(formData.cost),
        });
        Alert.alert("Éxito", "Ítem creado correctamente.");
      }
      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Error al guardar el ítem:", error);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      fetchItems();
      Alert.alert("Éxito", "Ítem eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el ítem:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cost: "",
      skill: "",
      image: undefined,
    });
    setIsEditing(false);
    setSelectedItemId(null);
  };

  const startEditing = (item: any) => {
    setFormData({
      name: item.name,
      cost: item.cost.toString(),
      skill: item.skill,
      image: item.image || undefined,
    });
    setIsEditing(true);
    setSelectedItemId(item.id);
  };

  return (
    <ScrollView className="p-4">
      <Text className="text-lg font-bold mb-4">Gestión de Ítems</Text>

      {/* Diálogo para Agregar o Editar */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Text>{isEditing ? "Editar Ítem" : "Agregar Ítem"}</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle className="text-white font-bold">
              {isEditing ? "Editar Ítem" : "Nuevo Ítem"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edita el ítem seleccionado."
                : "Completa los datos para agregar un nuevo ítem."}
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nombre"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            className="border p-2 mb-2 rounded"
          />
          <Input
            placeholder="Costo"
            value={formData.cost}
            onChangeText={(value) => handleInputChange("cost", value)}
            className="border p-2 mb-2 rounded"
            keyboardType="numeric"
          />
          <Input
            placeholder="Tipo de habilidad"
            value={formData.skill}
            onChangeText={(value) => handleInputChange("skill", value)}
          />
          <Button onPress={handleSelectImage} className="mt-2">
            <Text>Seleccionar Imagen</Text>
          </Button>
          {formData.image && typeof formData.image === "string" ? (
            <Image
              source={{ uri: formData.image }}
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

      {/* Listado de Ítems */}
      {isLoading ? (
        <Text>Cargando ítems...</Text>
      ) : (
        items.map((item) => (
          <Card key={item.id} className="mb-4">
            <CardHeader>
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Costo: ${item.cost}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Tipo de habilidad: {item.skill}
              </Text>
            </CardHeader>
            <CardContent>
              {item.image && (
                <Image
                  source={{
                    uri: `https://lomi.pockethost.io/api/files/54cr34lt398qc46/${item.id}/${item.image}`,
                  }}
                  style={{
                    width: "100%",
                    height: 200,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                />
              )}
              <View className="flex-row justify-between mt-2">
                {/* Botón Editar */}
                <Button onPress={() => startEditing(item)}>
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
                      <DialogTitle>Eliminar Ítem</DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar este ítem?
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
                        onPress={() => handleDelete(item.id)}
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
