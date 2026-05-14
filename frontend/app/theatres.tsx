import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { api } from '@/app/api';
import { Ionicons } from '@expo/vector-icons';

export default function TheatresScreen() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      const response = await api.get('/theatres');
      setTheatres(response.data);
    } catch (error) {
      setErrorMessage('Αδύνατη σύνδεση με τον server. Ελέγξτε τη διεύθυνση ή το δίκτυο.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTheatres = theatres.filter((item: any) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/shows', params: { id: item.theatre_id, name: item.name } })}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="business" size={24} color="#E94560" />
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.description}>{item.location}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="people" size={16} color="#E94560" />
          <Text style={styles.metaText}>Χωρητικότητα {item.capacity ?? '–'}</Text>
        </View>
        <View style={styles.metaItemSecondary}>
          <Text style={styles.ctaText}>Δες παραστάσεις</Text>
          <Ionicons name="chevron-forward" size={20} color="#E94560" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Επιλέξτε Θέατρο</Text>
          <Text style={styles.subtitle}>Δείτε τις διαθέσιμες παραστάσεις στο κοντινότερο θέατρο.</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Αναζήτηση θεάτρου"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#E94560" style={styles.loader} />
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : filteredTheatres.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Δεν βρέθηκαν θέατρα.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTheatres}
            keyExtractor={(item: any) => item.theatre_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 6, marginBottom: 18, lineHeight: 22 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', borderRadius: 16, paddingHorizontal: 14, height: 50 },
  searchInput: { marginLeft: 10, flex: 1, color: '#0F172A', fontSize: 16 },
  loader: { marginTop: 40 },
  listContent: { padding: 20, paddingBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 18, elevation: 7 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginLeft: 10, flex: 1 },
  description: { fontSize: 14, color: '#475569', marginBottom: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { color: '#64748B', marginLeft: 6, fontSize: 14 },
  metaItemSecondary: { flexDirection: 'row', alignItems: 'center' },
  ctaText: { color: '#E94560', fontWeight: '700', marginRight: 6 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyText: { color: '#475569', fontSize: 16 },
  errorText: { color: '#E11D48', fontSize: 16, textAlign: 'center' },
});
