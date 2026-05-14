import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, ActivityIndicator,
  TouchableOpacity, Modal, ScrollView, Pressable, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { api } from '@/app/api';
import { useAuth } from '@/app/context/auth';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const POSTER_COLORS = ['#1A2B45', '#2D1B4E', '#1A3A2A', '#3A1A2A', '#1E2A3A', '#2A1A3A'];
const POSTER_ICONS: any[] = ['film', 'musical-notes', 'star', 'mic', 'headset', 'camera'];

export default function ShowsScreen() {
  const { id, name } = useLocalSearchParams();
  const { user } = useAuth();
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingIds, setBookingIds] = useState<Set<number>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedShow, setSelectedShow] = useState<any | null>(null);

  const theatreName = typeof name === 'string' ? name : 'Θέατρο';

  useEffect(() => {
    fetchShows();
  }, [id]);

  const fetchShows = async () => {
    setErrorMessage('');
    try {
      const response = await api.get(`/theatres/${id}/shows`);
      setShows(response.data);
    } catch {
      setErrorMessage('Αδύνατη φόρτωση παραστάσεων. Ελέγξτε τη σύνδεσή σας.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (showId: number) => {
    if (bookingIds.has(showId)) return;
    try {
      await api.post('/bookings', { show_id: showId });
      setBookingIds((prev) => new Set(prev).add(showId));
      setSelectedShow(null);
      Toast.show({ type: 'success', text1: 'Κράτηση Επιτυχής!', text2: 'Το εισιτήριό σας έχει κατοχυρωθεί.' });
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Αδυναμία ολοκλήρωσης κράτησης.';
      Toast.show({ type: 'error', text1: 'Σφάλμα', text2: msg });
    }
  };

  const formatDate = (raw: string) => {
    if (!raw) return null;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('el-GR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const alreadyBooked = bookingIds.has(item.show_id);
    const dateStr = formatDate(item.date);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleBlock}>
            <Text style={styles.showTitle}>{item.title || 'Παράσταση'}</Text>
            {item.location ? (
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={13} color="#64748B" />
                <Text style={styles.showMeta}>{item.location}</Text>
              </View>
            ) : null}
            {dateStr ? (
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={13} color="#64748B" />
                <Text style={styles.showMeta}>{dateStr}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.rightCol}>
            <Text style={styles.showPrice}>{item.price ? `${item.price}€` : '–'}</Text>
            <TouchableOpacity
              style={styles.infoBtn}
              onPress={() => setSelectedShow({ ...item, _index: index })}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="information-circle" size={26} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {item.description ? (
          <Text style={styles.showDescription} numberOfLines={2}>{item.description}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.bookButton, alreadyBooked && styles.bookButtonDone]}
          onPress={() => handleBooking(item.show_id)}
          activeOpacity={0.85}
          disabled={alreadyBooked}
        >
          <Ionicons name={alreadyBooked ? 'checkmark-circle' : 'ticket'} size={18} color="#fff" />
          <Text style={styles.bookButtonText}>
            {alreadyBooked ? 'Κρατήθηκε!' : 'Κράτηση'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const alreadyBooked = selectedShow ? bookingIds.has(selectedShow.show_id) : false;
  const posterColor = selectedShow
    ? POSTER_COLORS[(selectedShow._index ?? 0) % POSTER_COLORS.length]
    : '#1A2B45';
  const posterIcon = selectedShow
    ? POSTER_ICONS[(selectedShow._index ?? 0) % POSTER_ICONS.length]
    : 'film';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <Text style={styles.theatreName}>{theatreName}</Text>
          <Text style={styles.subtitle}>
            {user ? `Συνδεδεμένος ως ${user.name}` : 'Διαθέσιμες παραστάσεις'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-offline-outline" size={56} color="#CBD5E1" />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchShows}>
              <Text style={styles.retryText}>Δοκιμάστε ξανά</Text>
            </TouchableOpacity>
          </View>
        ) : shows.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="sad-outline" size={56} color="#CBD5E1" />
            <Text style={styles.noShows}>Δεν υπάρχουν διαθέσιμες παραστάσεις.</Text>
          </View>
        ) : (
          <FlatList
            data={shows}
            keyExtractor={(item, index) => item.show_id?.toString() ?? index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Info Modal */}
      <Modal
        visible={!!selectedShow}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedShow(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSelectedShow(null)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>

            {/* Poster Header */}
            <View style={[styles.poster, { backgroundColor: posterColor }]}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedShow(null)}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
              <Ionicons name={posterIcon} size={64} color="rgba(255,255,255,0.15)" style={styles.posterBgIcon} />
              <Ionicons name={posterIcon} size={48} color="#fff" style={styles.posterIcon} />
              <Text style={styles.posterTitle} numberOfLines={2}>{selectedShow?.title}</Text>
              <Text style={styles.posterTheatre}>{theatreName}</Text>
            </View>

            {/* Details */}
            <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>

              {/* Detail chips */}
              <View style={styles.chipsRow}>
                {selectedShow?.price ? (
                  <View style={styles.chip}>
                    <Ionicons name="pricetag-outline" size={14} color="#3B82F6" />
                    <Text style={styles.chipText}>{selectedShow.price}€</Text>
                  </View>
                ) : null}
                {selectedShow?.duration ? (
                  <View style={styles.chip}>
                    <Ionicons name="time-outline" size={14} color="#3B82F6" />
                    <Text style={styles.chipText}>{selectedShow.duration} λεπτά</Text>
                  </View>
                ) : null}
                {selectedShow?.age_rating ? (
                  <View style={styles.chip}>
                    <Ionicons name="shield-checkmark-outline" size={14} color="#3B82F6" />
                    <Text style={styles.chipText}>{selectedShow.age_rating}</Text>
                  </View>
                ) : null}
              </View>

              {/* Date & Location */}
              {selectedShow?.date ? (
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="calendar" size={18} color="#3B82F6" />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Ημερομηνία & Ώρα</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedShow.date)}</Text>
                  </View>
                </View>
              ) : null}

              {selectedShow?.location ? (
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="location" size={18} color="#3B82F6" />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Αίθουσα</Text>
                    <Text style={styles.detailValue}>{selectedShow.location}</Text>
                  </View>
                </View>
              ) : null}

              {/* Description */}
              {selectedShow?.description ? (
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionLabel}>Περιγραφή</Text>
                  <Text style={styles.descriptionText}>{selectedShow.description}</Text>
                </View>
              ) : null}

              {/* Book Button */}
              <TouchableOpacity
                style={[styles.modalBookBtn, alreadyBooked && styles.bookButtonDone]}
                onPress={() => selectedShow && handleBooking(selectedShow.show_id)}
                activeOpacity={0.85}
                disabled={alreadyBooked}
              >
                <Ionicons name={alreadyBooked ? 'checkmark-circle' : 'ticket'} size={20} color="#fff" />
                <Text style={styles.modalBookText}>
                  {alreadyBooked ? 'Έχετε ήδη κρατήσει!' : 'Κράτηση τώρα'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EEF3FA' },
  container: { flex: 1, backgroundColor: '#EEF3FA' },
  headerBox: {
    backgroundColor: '#1A2B45', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  theatreName: { fontSize: 24, fontWeight: '800', color: '#E2E8F0' },
  subtitle: { fontSize: 14, color: '#93C5FD', marginTop: 6 },
  loader: { marginTop: 60 },
  listContent: { padding: 16, paddingBottom: 32 },

  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 14,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07, shadowRadius: 14, elevation: 5,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  titleBlock: { flex: 1, marginRight: 10 },
  showTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  showMeta: { color: '#64748B', fontSize: 13, marginLeft: 4 },
  rightCol: { alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 },
  showPrice: { fontSize: 20, fontWeight: '800', color: '#16A34A' },
  infoBtn: { padding: 2 },
  showDescription: { color: '#475569', lineHeight: 20, marginBottom: 16, fontSize: 14 },
  bookButton: {
    backgroundColor: '#3B82F6', borderRadius: 14, paddingVertical: 13,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  bookButtonDone: { backgroundColor: '#16A34A' },
  bookButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  errorText: { color: '#DC2626', fontSize: 15, textAlign: 'center', marginTop: 12 },
  noShows: { fontSize: 16, color: '#64748B', marginTop: 16 },
  retryButton: { marginTop: 16, backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.85, overflow: 'hidden',
  },

  // Poster
  poster: {
    height: 200, justifyContent: 'flex-end', padding: 20, position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: 16, right: 16, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 20, padding: 6,
  },
  posterBgIcon: {
    position: 'absolute', top: 20, left: '50%', transform: [{ translateX: -40 }],
  },
  posterIcon: { marginBottom: 10 },
  posterTitle: { fontSize: 22, fontWeight: '800', color: '#fff', lineHeight: 28 },
  posterTheatre: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 },

  modalBody: { flexShrink: 1 },
  modalContent: { padding: 20, paddingBottom: 32 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#EFF6FF', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  chipText: { color: '#2563EB', fontSize: 13, fontWeight: '600' },

  detailRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14,
  },
  detailIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center',
  },
  detailLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 15, color: '#1E293B', fontWeight: '500', marginTop: 2 },

  descriptionBox: {
    backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 20,
  },
  descriptionLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  descriptionText: { color: '#334155', lineHeight: 22, fontSize: 14 },

  modalBookBtn: {
    backgroundColor: '#3B82F6', borderRadius: 16, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  modalBookText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
