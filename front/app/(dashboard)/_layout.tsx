import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import {
  BrickWallIcon,
  CircleDollarSignIcon,
  HomeIcon,
  ListIcon,
  UsersIcon,
} from "lucide-react-native";
import LogOut from "~/components/LogOut";
import useAuthStore from "~/stores/useAuthStore";
import { ActivityIndicator, View } from "react-native";

export default function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && isLoading) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <Tabs>
      {/* Pantalla de Propiedades */}
      <Tabs.Screen
        name="quoter"
        options={{
          title: "Cotizador",
          headerRight: () => <ThemeToggle />,
          headerLeft: () => <LogOut />,
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => <CircleDollarSignIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="properties"
        options={{
          title: "Propiedades",
          headerRight: () => <ThemeToggle />,
          headerLeft: () => <LogOut />,
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="clients"
        options={{
          title: "Clientes",
          headerRight: () => <ThemeToggle />,
          tabBarIcon: ({ color }) => <UsersIcon color={color} />,
          headerLeft: () => <LogOut />,
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: "Items",
          headerRight: () => <ThemeToggle />,
          tabBarIcon: ({ color }) => <ListIcon color={color} />,
          headerLeft: () => <LogOut />,
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="builders"
        options={{
          title: "Albañiles",
          headerRight: () => <ThemeToggle />,
          tabBarIcon: ({ color }) => <BrickWallIcon color={color} />,
          headerLeft: () => <LogOut />,
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="agents"
        options={{
          title: "Agentes",
          headerRight: () => <ThemeToggle />,
          tabBarIcon: ({ color }) => <UsersIcon color={color} />,
          headerLeft: () => <LogOut />,
          headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
}
