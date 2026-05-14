import React, { useState, useEffect } from 'react';
import {
  StatusBar, StyleSheet, Text, View,
  FlatList, ActivityIndicator, TouchableOpacity, TextInput, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { api } from '@/app/api';
import { Ionicons } from '@expo/vector-icons';

export default function TheatresScreen() {
  const [theatres, setTheatres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    setErrorMessage('');
    try {
      const response = await api.get('/theatres');
      setTheatres(response.data);
    } catch {
      setErrorMessage('Αδύνατη σύνδεση με τον server. Ελέγξτε τη σύνδεσή σας.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTheatres();
  };

  const filteredTheatres = theatres.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/shows', params: { id: item.theatre_id, name: item.name } })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name="film" size={22} color="#E94560" />
        </View>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={14} color="#64748B" />
        <Text style={styles.location}>{item.location}</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.badge}>
          <Ionicons name="globe-outline" size={14} color="#2563EB" />
          <Text style={styles.badgeText}>{item.location?.split(',')[0] ?? '–'}</Text>
        </View>
        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>Παραστάσεις</Text>
          <Ionicons name="chevron-forward" size={18} color="#3B82F6" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF3FA" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Θέατρα & Κινηματογράφοι</Text>
          <Text style={styles.subtitle}>Βρείτε παραστάσεις κοντά σας</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Αναζήτηση ονόματος ή τοποθεσίας..."
              placeholderTextColor="#94A3B8"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#E94560" style={styles.loader} />
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-offline-outline" size={56} color="#CBD5E1" />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTheatres}>
              <Text style={styles.retryText}>Δοκιμάστε ξανά</Text>
            </TouchableOpacity>
          </View>
        ) : filteredTheatres.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={56} color="#CBD5E1" />
            <Text style={styles.emptyText}>Δεν βρέθηκαν θέατρα.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTheatres}
            keyExtractor={(item) => item.theatre_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EEF3FA' },
  container: { flex: 1, backgroundColor: '#EEF3FA' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2EAF4' },
  title: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 16 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF3FA',
    borderRadius: 14, paddingHorizontal: 14, height: 48,
  },
  searchInput: { marginLeft: 10, flex: 1, color: '#1E293B', fontSize: 15 },
  loader: { marginTop: 60 },
  listContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06, shadowRadius: 14, elevation: 5,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconBox: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#DBEAFE',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  name: { fontSize: 18, fontWeight: '700', color: '#1E293B', flex: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  location: { color: '#64748B', fontSize: 13, marginLeft: 4, flex: 1 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#DBEAFE',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  badgeText: { color: '#2563EB', fontSize: 13, fontWeight: '600', marginLeft: 5 },
  ctaRow: { flexDirection: 'row', alignItems: 'center' },
  ctaText: { color: '#3B82F6', fontWeight: '700', fontSize: 14, marginRight: 2 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyText: { color: '#94A3B8', fontSize: 16, marginTop: 12, textAlign: 'center' },
  errorText: { color: '#DC2626', fontSize: 15, marginTop: 12, textAlign: 'center' },
  retryButton: { marginTop: 16, backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
