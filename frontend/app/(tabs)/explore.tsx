import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList,
  ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { api } from '@/app/api';
import { useAuth } from '@/app/context/auth';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function BookingsScreen() {
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) fetchBookings();
    }, [isAuthenticated])
  );

  const fetchBookings = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await api.get('/my-bookings');
      setBookings(response.data);
    } catch {
      setErrorMessage('Αδύνατη φόρτωση κρατήσεων.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (bookingId: number) => {
    Alert.alert(
      'Ακύρωση Κράτησης',
      'Είστε σίγουροι ότι θέλετε να ακυρώσετε αυτή την κράτηση;',
      [
        { text: 'Όχι', style: 'cancel' },
        {
          text: 'Ακύρωση', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/bookings/${bookingId}`);
              Toast.show({ type: 'success', text1: 'Ακυρώθηκε', text2: 'Η κράτηση ακυρώθηκε επιτυχώς.' });
              fetchBookings();
            } catch {
              Toast.show({ type: 'error', text1: 'Σφάλμα', text2: 'Αδυναμία ακύρωσης κράτησης.' });
            }
          },
        },
      ]
    );
  };

  const formatDate = (raw: string) => {
    if (!raw) return '–';
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('el-GR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.iconBox}>
          <Ionicons name="ticket" size={20} color="#3B82F6" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.showTitle} numberOfLines={1}>{item.title || 'Παράσταση'}</Text>
          <Text style={styles.theatreName}>{item.theatre_name}</Text>
        </View>
        <Text style={styles.price}>{item.price ? `${item.price}€` : '–'}</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color="#64748B" />
          <Text style={styles.detailText}>{formatDate(item.date)}</Text>
        </View>
        {item.location ? (
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color="#64748B" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.booking_id)} activeOpacity={0.8}>
        <Ionicons name="close-circle-outline" size={16} color="#E11D48" />
        <Text style={styles.cancelText}>Ακύρωση</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Οι Κρατήσεις μου</Text>
          <Text style={styles.subtitle}>
            {user ? `Γεια σου, ${user.name}!` : 'Ιστορικό κρατήσεών σας'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#E94560" style={styles.loader} />
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-offline-outline" size={56} color="#CBD5E1" />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchBookings}>
              <Text style={styles.retryText}>Δοκιμάστε ξανά</Text>
            </TouchableOpacity>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Δεν έχετε κρατήσεις</Text>
            <Text style={styles.emptySubtitle}>Επιλέξτε θέατρο και κάντε την πρώτη σας κράτηση!</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.booking_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onRefresh={fetchBookings}
            refreshing={loading}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EEF3FA' },
  container: { flex: 1, backgroundColor: '#EEF3FA' },
  header: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2EAF4',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  loader: { marginTop: 60 },
  listContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06, shadowRadius: 14, elevation: 5,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#DBEAFE',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  cardInfo: { flex: 1 },
  showTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  theatreName: { fontSize: 13, color: '#64748B', marginTop: 2 },
  price: { fontSize: 17, fontWeight: '800', color: '#16A34A' },
  detailsRow: { gap: 6, marginBottom: 14 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { color: '#475569', fontSize: 13, marginLeft: 6 },
  cancelButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FECDD3', borderRadius: 12,
    paddingVertical: 10, gap: 6,
  },
  cancelText: { color: '#DC2626', fontSize: 14, fontWeight: '600' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#94A3B8', marginTop: 8, textAlign: 'center', lineHeight: 20 },
  errorText: { color: '#DC2626', fontSize: 15, marginTop: 12, textAlign: 'center' },
  retryButton: { marginTop: 16, backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
