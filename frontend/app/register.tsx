import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { api } from '@/app/api';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Προσοχή', text2: 'Συμπληρώστε όλα τα πεδία.' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Σφάλμα', text2: 'Οι κωδικοί δεν ταιριάζουν.' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Σφάλμα', text2: 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/register', { name: name.trim(), email: email.trim(), password });
      Toast.show({ type: 'success', text1: 'Επιτυχής Εγγραφή!', text2: 'Μπορείτε τώρα να συνδεθείτε.' });
      router.replace('/login');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Σφάλμα εγγραφής. Δοκιμάστε ξανά.';
      Toast.show({ type: 'error', text1: 'Σφάλμα', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { icon: 'person' as const, placeholder: 'Ονοματεπώνυμο', value: name, setter: setName, secure: false, keyboard: 'default' as const },
    { icon: 'mail' as const, placeholder: 'Email', value: email, setter: setEmail, secure: false, keyboard: 'email-address' as const },
    { icon: 'lock-closed' as const, placeholder: 'Κωδικός', value: password, setter: setPassword, secure: true, keyboard: 'default' as const },
    { icon: 'lock-closed' as const, placeholder: 'Επιβεβαίωση Κωδικού', value: confirmPassword, setter: setConfirmPassword, secure: true, keyboard: 'default' as const },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1B2232" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Ionicons name="person-add" size={56} color="#3B82F6" style={styles.icon} />
          <Text style={styles.title}>Εγγραφή</Text>
          <Text style={styles.subtitle}>Δημιουργήστε τον λογαριασμό σας</Text>

          {fields.map((field) => (
            <View key={field.placeholder} style={styles.inputContainer}>
              <Ionicons name={field.icon} size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                keyboardType={field.keyboard}
                secureTextEntry={field.secure}
                value={field.value}
                onChangeText={field.setter}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Δημιουργία Λογαριασμού</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
            <Text style={styles.loginText}>
              Έχετε ήδη λογαριασμό;{'  '}
              <Text style={styles.loginHighlight}>Σύνδεση</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B2232' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#242D3F', padding: 30, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 10, alignItems: 'center',
  },
  icon: { marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E2E8F0', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#94A3B8', marginBottom: 25 },
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
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginLink: { marginTop: 22 },
  loginText: { color: '#94A3B8', fontSize: 14 },
  loginHighlight: { color: '#60A5FA', fontWeight: 'bold' },
});
