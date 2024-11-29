import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useAuthStore from "~/stores/useAuthStore";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    // Validar campos antes de enviar la solicitud
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      await login(email, password);
      router.replace("/quoter");
    } catch (err) {
      console.error("Error al iniciar sesión:", err); // Manejar errores
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/quoter");
    }
  }, [isAuthenticated, router]);

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-4 dark:text-white">
        Inicio de Sesión
      </Text>

      {/* Campo de Correo Electrónico */}
      <Input
        className="border w-3/4 p-2 mb-4"
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      {/* Campo de Contraseña */}
      <Input
        className="border w-3/4 p-2 mb-4"
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Mostrar un indicador de carga o botón */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button onPress={handleLogin} className="bg-primary w-3/4 ">
          <Text className="text-white font-bold">
            Iniciar Sesión
          </Text>
        </Button>
      )}

      {/* Mostrar errores, si los hay */}
      {error && <Text className="text-red-500 mt-2">{error}</Text>}
    </View>
  );
}
