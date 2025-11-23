import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { clearSession, getSession } from '@/lib/session';
import { logout } from '@/lib/auth';

const logoSource = require('@/assets/images/logo.png');
const avatarSource = require('@/assets/images/logo.png');

type AccountLink = {
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const LINKS: AccountLink[] = [
  {
    title: 'Pelanggan Saya',
    subtitle: 'Daftar pelanggan yang terdaftar di outlet',
    icon: 'account-multiple',
  },
  {
    title: 'Kelola Outlet',
    subtitle: 'Edit Outlet, Jam Operasional, Tarif Ongkir',
    icon: 'store-edit',
  },
  {
    title: 'Kelola Layanan/Produk',
    subtitle: 'Edit Layanan, Edit Paket, Buat Promo',
    icon: 'tshirt-crew-outline',
  },
  {
    title: 'Kelola Pegawai',
    subtitle: 'Daftar Pegawai, Atur Presensi & Gaji',
    icon: 'account-group-outline',
  },
  {
    title: 'Kelola Keuangan',
    subtitle: 'Pendapatan dan Pengeluaran',
    icon: 'cash-multiple',
  },
  {
    title: 'Pembatalan Transaksi',
    subtitle: 'Pembatalan transaksi reguler, top up',
    icon: 'file-cancel-outline',
  },
];

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams<{ user?: string; active?: string }>();
  const userName = params.user ? String(params.user) : 'Anonymous';
  const activeUntil = '07 / 07 / 2026';
  const handleLogout = async () => {
    try {
      const { token } = await getSession();
      if (token) {
        await logout(token);
      }
    } catch {
      // ignore logout API failure; still clear local session
    } finally {
      await clearSession();
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: 0 }]}>
      <LinearGradient
        colors={['#0048B3', '#0E8CFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}>
        <Image source={logoSource} style={styles.headerLogo} contentFit="contain" />
        <Pressable style={styles.bellButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#fff" />
        </Pressable>
      </LinearGradient>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 140 + insets.bottom, paddingTop: 12 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Image source={avatarSource} style={styles.avatar} contentFit="cover" />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{userName}</Text>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Paket Bisnis</Text>
                </View>
              </View>
              <Text style={styles.activeUntil}>Masa Aktif : {activeUntil}</Text>
            </View>
            <View style={styles.actionsRow}>
              <Pressable style={styles.circleButton}>
                <MaterialCommunityIcons name="plus" size={22} color="#fff" />
              </Pressable>
              <Pressable style={[styles.circleButton, styles.logoutButton]} onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={20} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.noteCard}>
          <MaterialCommunityIcons name="information-outline" size={20} color="#0A4DA8" />
          <View style={{ flex: 1 }}>
            <Text style={styles.noteTitle}>Informasi</Text>
            <Text style={styles.noteSubtitle}>Tulis catatan atau informasi singkat outlet kamu</Text>
          </View>
          <MaterialCommunityIcons name="pencil-outline" size={20} color="#0A4DA8" />
        </View>

        <View style={styles.linkList}>
          {LINKS.map((link) => (
            <View key={link.title} style={styles.linkRow}>
              <MaterialCommunityIcons name={link.icon} size={28} color="#0A4DA8" />
              <View style={styles.linkCopy}>
                <Text style={styles.linkTitle}>{link.title}</Text>
                {link.subtitle ? <Text style={styles.linkSubtitle}>{link.subtitle}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.ownerCard}>
          <Text style={styles.ownerTitle}>Profil Pemilik</Text>
          <Text style={styles.ownerSubtitle}>Edit Profil, Data Bank, Perangkat Aktif</Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: 10 + insets.bottom }]}>
        {navItems.map((item) => (
          <Pressable
            key={item.label}
            style={[
              styles.navItem,
              item.prominent && styles.navItemProminent,
              item.route === pathname && styles.navItemDisabled,
            ]}
            onPress={() => {
              if (item.route && item.route !== pathname) {
                const params = userName ? { user: userName } : undefined;
                router.push({ pathname: item.route, params });
              }
            }}>
            <MaterialCommunityIcons
              name={item.icon as any}
              size={item.prominent ? 36 : 22}
              color={item.prominent ? '#fff' : '#0A4DA8'}
            />
            {!item.prominent ? <Text style={styles.navLabel}>{item.label}</Text> : null}
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const navItems: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  prominent?: boolean;
  route?: '/home' | '/reports' | '/account';
}[] = [
  { label: 'Beranda', icon: 'home-variant', route: '/home' },
  { label: 'Pesanan', icon: 'clipboard-list-outline' },
  { label: 'Tambah', icon: 'plus-circle', prominent: true },
  { label: 'Laporan', icon: 'chart-line', route: '/reports' },
  { label: 'Akun', icon: 'account-outline', route: '/account' },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerLogo: {
    width: 120,
    height: 42,
  },
  bellButton: {
    padding: 8,
  },
  profileCard: {
    marginTop: 12,
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  nameText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: '700',
    color: '#0B245A',
  },
  tag: {
    backgroundColor: '#FF5A5F',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  activeUntil: {
    color: '#4B5C8B',
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2F78D3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  logoutButton: {
    backgroundColor: '#E53C3C',
  },
  noteCard: {
    marginTop: 12,
    marginHorizontal: 14,
    backgroundColor: '#E9F1FF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noteTitle: {
    color: '#0B245A',
    fontWeight: '700',
  },
  noteSubtitle: {
    color: '#4B5C8B',
    fontSize: 12,
  },
  linkList: {
    marginTop: 12,
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  linkRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  linkCopy: {
    flex: 1,
    gap: 4,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B245A',
  },
  linkSubtitle: {
    fontSize: 12,
    color: '#4B5C8B',
  },
  ownerCard: {
    marginTop: 16,
    marginBottom: 20,
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  ownerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B245A',
  },
  ownerSubtitle: {
    fontSize: 12,
    color: '#4B5C8B',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navItemProminent: {
    backgroundColor: '#2F78D3',
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  navLabel: {
    color: '#0A4DA8',
    fontSize: 11,
    fontWeight: '700',
  },
  navItemDisabled: {
    opacity: 0.5,
  },
});
