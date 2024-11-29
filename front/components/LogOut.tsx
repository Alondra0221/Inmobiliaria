import { View, Pressable } from 'react-native'
import React from 'react'
import { cn } from '~/lib/utils';
import { LogOutIcon } from 'lucide-react-native';
import useAuthStore from '~/stores/useAuthStore';
import { useRouter } from 'expo-router';

export default function LogOut() {
    const router = useRouter();
    const { logout } = useAuthStore();
  
    const handleLogout = () => {
      logout(); // Llama a la función logout del AuthStore
      router.replace("/"); // Redirige a la pantalla de inicio de sesión
    };
  return (
    <Pressable
        className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
        onPress={handleLogout}
    >
            {({ pressed }) => (
        <View
          className={cn(
            'flex-1 aspect-square pt-0.5 justify-center items-start web:px-5',
            pressed && 'opacity-70'
          )}
        >
            <LogOutIcon className='text-foreground' size={23} strokeWidth={1.25} />

        </View>
      )}
    </Pressable>
  )
}