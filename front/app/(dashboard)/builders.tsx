import React, { useEffect, useState } from "react";
import { View, Alert, Image, ScrollView } from "react-native";
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
import useBuilderStore from "~/stores/useBuilderStore";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function Builders() {
  const {
    builders,
    fetchBuilders,
    createBuilder,
    updateBuilder,
    deleteBuilder,
    isLoading,
  } = useBuilderStore();

  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    experience: "",
    estimated_time: "",
    skill: "",
    image: undefined as string | File | undefined,
  });

  const [selectedBuilderId, setSelectedBuilderId] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBuilders();
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

      const response = await fetch(uri);
      const blob = await response.blob();
      const file = new File([blob], "uploaded_image.jpg", { type: blob.type });

      setFormData({ ...formData, image: file });
    }
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.cost ||
      !formData.experience ||
      !formData.estimated_time ||
      !formData.skill
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      if (isEditing && selectedBuilderId) {
        await updateBuilder(selectedBuilderId, {
          ...formData,
          cost: parseFloat(formData.cost),
        });
        Alert.alert("Éxito", "Constructor actualizado correctamente.");
      } else {
        await createBuilder({
          ...formData,
          cost: parseFloat(formData.cost),
        });
        Alert.alert("Éxito", "Constructor creado correctamente.");
      }
      resetForm();
      fetchBuilders();
      
    } catch (error) {
      console.error("Error al guardar el constructor:", error);
    }
  };

  const handleDelete = async (builderId: string) => {
    try {
      await deleteBuilder(builderId);
      fetchBuilders();
      Alert.alert("Éxito", "Constructor eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el constructor:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cost: "",
      experience: "",
      estimated_time: "",
      skill: "",
      image: undefined,
    });
    setIsEditing(false);
    setSelectedBuilderId(null);
  };

  const startEditing = (builder: any) => {
    setFormData({
      name: builder.name,
      cost: builder.cost.toString(),
      experience: builder.experience,
      estimated_time: builder.estimated_time,
      skill: builder.skill,
      image: builder.image || undefined,
    });
    setIsEditing(true);
    setSelectedBuilderId(builder.id);
  };

  return (
    <ScrollView className="p-4">
      <Text className="text-lg font-bold mb-4">Gestión de Constructores</Text>

      {/* Diálogo para Agregar o Editar */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Text>
              {isEditing ? "Editar Constructor" : "Agregar Constructor"}
            </Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle className="text-white font-bold">
              {isEditing ? "Editar Constructor" : "Nuevo Constructor"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edita el constructor seleccionado."
                : "Completa los datos para agregar un nuevo constructor."}
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
            placeholder="Experiencia"
            value={formData.experience}
            onChangeText={(value) => handleInputChange("experience", value)}
            className="border p-2 mb-2 rounded"
          />
          <Input
            placeholder="Tiempo estimado"
            value={formData.estimated_time}
            onChangeText={(value) => handleInputChange("estimated_time", value)}
            className="border p-2 mb-2 rounded"
          />
          <Input
            placeholder="Habilidad"
            value={formData.skill}
            onChangeText={(value) => handleInputChange("skill", value)}
            className="border p-2 mb-2 rounded"
          />
          <Button onPress={handleSelectImage} className="mt-2">
            <Text>Seleccionar Imagen</Text>
          </Button>
          {formData.image && typeof formData.image === "string" ? (
    <Image
        source={{
            uri: `https://lomi.pockethost.io/api/files/8t9ixccabcayim7/${selectedBuilderId}/${formData.image}`,
        }}
        style={{
            width: "100%",
            height: 200,
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

      {/* Listado de Constructores */}
      {isLoading ? (
        <Text>Cargando constructores...</Text>
      ) : (
        builders.map((builder) => (
          <Card key={builder.id} className="mb-4">
            <CardHeader>
              <Text className="text-lg font-semibold">{builder.name}</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Costo: ${builder.cost}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Experiencia: {builder.experience}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Tiempo estimado: {builder.estimated_time}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Habilidad: {builder.skill}
              </Text>
            </CardHeader>
            <CardContent>
              {builder.image && (
                <Image
                  source={{
                    uri: `https://lomi.pockethost.io/api/files/8t9ixccabcayim7/${builder.id}/${builder.image}`,
                  }}
                  style={{
                    width: "100%",
                    height: 150,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                />
              )}
              <View className="flex-row justify-between mt-2">
                {/* Botón Editar */}
                <Button onPress={() => startEditing(builder)}>
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
                      <DialogTitle>Eliminar Constructor</DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar este constructor?
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
                        onPress={() => handleDelete(builder.id)}
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
