import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { api } from '@/app/api';
import { useAuth } from '@/app/context/auth';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Toast.show({ type: 'error', text1: 'Προσοχή', text2: 'Συμπληρώστε όλα τα πεδία.' });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/login', { email: email.trim(), password });
      const { token, user_id, name } = response.data;
      login(token, user_id, name, email.trim());
      Toast.show({ type: 'success', text1: 'Καλώς ήρθατε!', text2: `Γεια σου, ${name}!` });
      router.replace('/(tabs)');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Σφάλμα σύνδεσης. Ελέγξτε το δίκτυο.';
      Toast.show({ type: 'error', text1: 'Σφάλμα', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1B2232" />
      <View style={styles.card}>
        <Ionicons name="ticket-outline" size={64} color="#3B82F6" style={styles.icon} />
        <Text style={styles.title}>TheatrePass</Text>
        <Text style={styles.subtitle}>Συνδεθείτε για να κάνετε κράτηση</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Κωδικός"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Είσοδος</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/register')}>
          <Text style={styles.registerText}>
            Δεν έχετε λογαριασμό;{'  '}
            <Text style={styles.registerHighlight}>Εγγραφή</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#1B2232', justifyContent: 'center', padding: 20,
  },
  card: {
    backgroundColor: '#242D3F', padding: 30, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 10, alignItems: 'center',
  },
  icon: { marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#E2E8F0', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#94A3B8', marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2744',
    borderRadius: 10, marginBottom: 15, paddingHorizontal: 15, width: '100%', height: 55,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#E2E8F0', fontSize: 16 },
  button: {
    backgroundColor: '#3B82F6', width: '100%', height: 55, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerLink: { marginTop: 22 },
  registerText: { color: '#94A3B8', fontSize: 14 },
  registerHighlight: { color: '#60A5FA', fontWeight: 'bold' },
});
