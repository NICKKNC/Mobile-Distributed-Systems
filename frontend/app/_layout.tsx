import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '@/app/context/auth';

function NavigationGuard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationGuard />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1A2332' },
          headerTintColor: '#93C5FD',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          contentStyle: { backgroundColor: '#141A28' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ title: 'Εγγραφή', headerBackTitle: 'Πίσω' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="shows" options={{ title: 'Παραστάσεις', headerBackTitle: 'Θέατρα' }} />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
