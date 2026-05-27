import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '@/app/context/auth';

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!hasMounted.current) {
      hasMounted.current = true;
      if (!isAuthenticated) router.replace('/login');
      return;
    }
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1B2232', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }
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
