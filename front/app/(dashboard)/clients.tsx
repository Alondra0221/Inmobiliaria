import React, { useEffect, useState } from "react";
import { View, Alert, ScrollView } from "react-native";
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
import useClientStore from "~/stores/useClientStore";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { send } from "@emailjs/react-native";
import useUserStore from "~/stores/useAgentStore";


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function Clients() {
  const { clients, fetchClients, deleteClient, isLoading, updateClient } = useClientStore();
  const { users, fetchUsers, updateUser } = useUserStore();

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);



  useEffect(() => {
    fetchClients();
    fetchUsers();
  }, []);

  const handleDelete = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      fetchClients();
      Alert.alert("Éxito", "Cliente eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const handleReminder = async (client: any) => {
    try {
      const emailData = {
        name: client.name,
        email: client.email,
        message: `Hola ${
          client.name
        }, este es un recordatorio de tu cotización:\n\nCotización: ${
          client.quote
        }\nTotal: $${client.total || "N/A"}`,
      };

      await send(
        "service_77vplk7", // Reemplaza con tu Service ID
        "template_p0ylq2o", // Reemplaza con tu Template ID
        emailData,
        {
          publicKey: "VxyXSihiETsAlMFnX", // Reemplaza con tu Public Key
        }
      );

      Alert.alert("Éxito", `Recordatorio enviado a ${client.name}.`);
    } catch (error) {
      console.error("Error al enviar recordatorio:", error);
      Alert.alert("Error", "No se pudo enviar el recordatorio.");
    }
  };

  const handleAssignSale = (client: any, agentId: string | null) => {
    if (!agentId) {
      console.log("Por favor selecciona un agente antes de asignar.");
      return;
    }
    
    const totalMatch = client.quote.match(/Precio total: \$(\d+)/);
    const total = totalMatch ? parseInt(totalMatch[1], 10) : 0;
  
    console.log(`Cliente: ${client.name} (ID: ${client.id})`);
    console.log(`Agente seleccionado: ${agentId}`);
    console.log(`Total: ${total}`);

    const selectedAgent = users.find((user) => user.id === agentId);
    if (!selectedAgent) {
      console.log("No se encontró el agente seleccionado.");
      return;
      
    }

    //suma el total de la venta al totalSales del agente
    const newTotalSales = selectedAgent.totalSales + total;
    console.log(`Nuevo total de ventas: ${newTotalSales}`);
    
    try {
      updateUser(agentId, {
        ...selectedAgent,
        totalSales: newTotalSales,
      });

      updateClient(client.id, {
        ...client,
        assigned: true,
      });

      setSelectedAgent(null);
    } catch (error) {
      console.error("Error al actualizar la venta:", error);
    }


    
  };



  return (
    <ScrollView className="p-4">
      <Text className="text-lg font-bold mb-4">Gestión de Clientes</Text>

      {/* Listado de Clientes */}
      {isLoading ? (
        <Text>Cargando clientes...</Text>
      ) : (
        clients.map((client) => (
          <Card key={client.id} className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {client.name}
              </CardTitle>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                {client.email}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-100">
                Cotización: {client.quote}
              </Text>
            </CardHeader>
            <CardContent>
              <View className="flex-row justify-between mt-2">
                {/* Botón Recordatorio */}
                <Button onPress={() => handleReminder(client)}
                  variant="secondary"
                  >
                  <Text>Recordatorio</Text>
                </Button>

                {/* Dialogo para asignar ventas */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"default"}
                      disabled={client.assigned}
                    >
                      <Text className="text-white">
                        {client.assigned ? "Asignada" : "Venta"}
                      </Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-">
                    <DialogHeader>
                      <DialogTitle>Asignar ventas</DialogTitle>
                      <DialogDescription>
                        Asigna esta venta a un agente para que se sume a su
                        total de ventas.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="text-black dark:text-white"
                        >
                          <Text>Cancelar</Text>
                        </Button>
                      </DialogClose>
                      {/* Aqui va el select de los agentes */}

                      <Button
                        variant="default"
                        className="mt-2"
                        onPress={() => {handleAssignSale(client, selectedAgent)}}
                      >
                        <Text className="dark:text-white text-black">
                          Asignar
                        </Text>
                      </Button>
                      <Select
                        onValueChange={(option) => {
                          if (option) {
                            setSelectedAgent(option.value);
                            console.log(option.value) 
                          } else {
                            setSelectedAgent(null);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un agente" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectGroup>
                            <SelectLabel>Agentes</SelectLabel>
                            {users.map((user) => (
                              <SelectItem
                                label={user.name}
                                key={user.id}
                                value={user.id}
                              >
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {/* Aqui termina el select de los agentes */}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Diálogo para Eliminar */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Text className="text-white">Eliminar</Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full">
                    <DialogHeader>
                      <DialogTitle>Eliminar Cliente</DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar este cliente?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">
                          <Text className="dark:text-white text-black">
                            Cancelar
                          </Text>
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onPress={() => handleDelete(client.id)}
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
