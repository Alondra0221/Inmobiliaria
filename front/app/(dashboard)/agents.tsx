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
import useUserStore from "~/stores/useAgentStore";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function Agents() {
  const {
    users,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    isLoading,
  } = useUserStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    emailVisibility: true,
    password: "",
    passwordConfirm: "",
    name: "",
    totalSales: "",
    image: undefined as string | File | undefined,
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
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
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirm ||
      !formData.name ||
      !formData.totalSales
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      if (isEditing && selectedUserId) {
        await updateUser(selectedUserId, {
          ...formData,
          totalSales: parseFloat(formData.totalSales),
        });
        Alert.alert("Éxito", "Usuario actualizado correctamente.");
      } else {
        await createUser({
          ...formData,
          totalSales: parseFloat(formData.totalSales),
        });
        Alert.alert("Éxito", "Usuario creado correctamente.");
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      fetchUsers();
      Alert.alert("Éxito", "Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      emailVisibility: true,
      password: "",
      passwordConfirm: "",
      name: "",
      totalSales: "",
      image: undefined,
    });
    setIsEditing(false);
    setSelectedUserId(null);
  };

  const startEditing = (user: any) => {
    setFormData({
      username: user.username,
      email: user.email,
      emailVisibility: user.emailVisibility,
      password: "",
      passwordConfirm: "",
      name: user.name,
      totalSales: user.totalSales.toString(),
      image: user.image || undefined,
    });
    setIsEditing(true);
    setSelectedUserId(user.id);
  };

  return (
    <ScrollView className="p-4">
      <Text className="text-lg font-bold mb-4">Gestión de Usuarios</Text>

      {/* Diálogo para Agregar o Editar */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Text>{isEditing ? "Editar Usuario" : "Agregar Usuario"}</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle className="text-white font-bold">
              {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edita el usuario seleccionado."
                : "Completa los datos para agregar un nuevo usuario."}
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nombre de usuario"
            value={formData.username}
            onChangeText={(value) => handleInputChange("username", value)}
            className="border p-2 mb-2 rounded"
          />
          <Input
            placeholder="Correo electrónico"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            className="border p-2 mb-2 rounded"
          />
          <Input
            placeholder="Contraseña"
            value={formData.password}
            secureTextEntry
            onChangeText={(value) => handleInputChange("password", value)}
            className="border p-2 mb-2 rounded"
          />
          <Input
            placeholder="Confirmar contraseña"
            value={formData.passwordConfirm}
            secureTextEntry
            onChangeText={(value) => handleInputChange("passwordConfirm", value)}
            className="border p-2 mb-2 rounded"
          />
          <Input
            placeholder="Nombre"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            className="border p-2 mb-2 rounded"
          />
          <Input
            placeholder="Total de ventas"
            value={formData.totalSales}
            onChangeText={(value) => handleInputChange("totalSales", value)}
            className="border p-2 mb-2 rounded"
            keyboardType="numeric"
          />
          <Button onPress={handleSelectImage} className="mt-2">
            <Text>Seleccionar Imagen</Text>
          </Button>
          {formData.image && typeof formData.image === "string" ? (
            <Image
              source={{
                uri: `https://lomi.pockethost.io/api/files/users/${selectedUserId}/${formData.image}`,
              }}
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

      {/* Listado de Usuarios */}
      {isLoading ? (
        <Text>Cargando usuarios...</Text>
      ) : (
        users.map((user) => (
          <Card key={user.id} className="mb-4">
            <CardHeader>
              <Text className="text-lg font-semibold">{user.username}</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Correo: {user.email}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Nombre: {user.name}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Ventas totales: ${user.totalSales}
              </Text>
            </CardHeader>
            <CardContent>
              {user.image && (
                <Image
                  source={{
                    uri: `https://lomi.pockethost.io/api/files/users/${user.id}/${user.image}`,
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
                {/* <Button onPress={() => startEditing(user)}>
                  <Text>Editar</Text>
                </Button> */}

                {/* Diálogo para Eliminar */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Text className="text-white">Eliminar</Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Eliminar Usuario</DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar este usuario?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">
                          <Text>Cancelar</Text></Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onPress={() => handleDelete(user.id)}
                      >
                        <Text>Eliminar</Text>
                        
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
