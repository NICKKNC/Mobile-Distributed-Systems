import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/context/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Προφίλ</Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'Χρήστης'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Λογαριασμός</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Όνομα</Text>
              <Text style={styles.menuValue}>{user?.name ?? '–'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="mail-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Email</Text>
              <Text style={styles.menuValue}>{user?.email ?? '–'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Εφαρμογή</Text>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="information-circle-outline" size={20} color="#64748B" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Έκδοση</Text>
              <Text style={styles.menuValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Αποσύνδεση</Text>
        </TouchableOpacity>
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
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  avatarSection: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#fff', marginBottom: 16 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#3B82F6',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  userName: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  userEmail: { fontSize: 14, color: '#64748B', marginTop: 4 },
  section: {
    backgroundColor: '#fff', borderRadius: 20, marginHorizontal: 16, marginBottom: 16,
    paddingHorizontal: 16, paddingVertical: 8,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3,
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.8, paddingVertical: 10, textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#DBEAFE',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  menuValue: { fontSize: 15, color: '#1E293B', fontWeight: '500', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#E2EAF4', marginLeft: 50 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#DC2626', marginHorizontal: 16, borderRadius: 16,
    paddingVertical: 16, gap: 10,
    shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
