import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { getSession } from '@/lib/session';

const logoSource = require('@/assets/images/logo.png');

type ReportCategory =
  | 'keuangan'
  | 'transaksi'
  | 'persediaan'
  | 'pegawai'
  | 'pelanggan'
  | 'export';

type ReportItem = {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const REPORT_SECTIONS: { key: ReportCategory; title: string; items: ReportItem[] }[] = [
  {
    key: 'keuangan',
    title: 'Laporan Keuangan',
    items: [
      { title: 'Arus Keuangan', icon: 'swap-horizontal' },
      { title: 'Pendapatan Transaksi', icon: 'credit-card-multiple-outline' },
      { title: 'Pendapatan Lain', icon: 'wallet-plus' },
      { title: 'Pengeluaran', icon: 'cash-minus' },
      { title: 'Chart of Account', icon: 'chart-bubble' },
    ],
  },
  {
    key: 'transaksi',
    title: 'Laporan Transaksi',
    items: [
      { title: 'Semua Data Transaksi', icon: 'file-document-outline' },
      { title: 'Transaksi Jadi Produk', icon: 'tshirt-crew-outline' },
      { title: 'Transaksi Ditolak/Dibatalkan', icon: 'close-octagon-outline' },
      { title: 'Faktur Yang Ditagihkan', icon: 'note-text-outline' },
      { title: 'Top Layanan', icon: 'star-circle-outline' },
    ],
  },
  {
    key: 'persediaan',
    title: 'Laporan Persediaan',
    items: [
      { title: 'Pembelian Produk', icon: 'cart-outline' },
      { title: 'Persediaan Produk', icon: 'tray-full' },
      { title: 'Nilai Persediaan Produk', icon: 'scale-balance' },
      { title: 'Stok Opname', icon: 'inbox-arrow-up-outline' },
    ],
  },
  {
    key: 'pegawai',
    title: 'Laporan Pegawai',
    items: [
      { title: 'Bagian Pegawai', icon: 'account-group' },
      { title: 'Pembagian Produk', icon: 'hand-heart' },
      { title: 'Rekap Presensi', icon: 'calendar-check-outline' },
      { title: 'Rekap Lembur', icon: 'clock-plus-outline' },
    ],
  },
  {
    key: 'pelanggan',
    title: 'Laporan Pelanggan',
    items: [
      { title: 'Pertumbuhan Pelanggan', icon: 'account-multiple-plus-outline' },
      { title: 'Top Pelanggan', icon: 'trophy' },
      { title: 'Riwayat Faktur Pelanggan', icon: 'file-clock-outline' },
    ],
  },
  {
    key: 'export',
    title: 'Export Data',
    items: [
      { title: 'Pelanggan', icon: 'account-arrow-down' },
      { title: 'Keuangan', icon: 'file-export-outline' },
      { title: 'Laporan Transaksi', icon: 'file-export' },
      { title: 'Laporan Persediaan', icon: 'cube-send' },
      { title: 'Laporan Pegawai', icon: 'account-tie' },
      { title: 'Laporan Pelanggan', icon: 'text-account' },
    ],
  },
];

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ user?: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<ReportCategory | null>(null);
  const [userName, setUserName] = useState<string>(
    params.user ? String(params.user) : 'Ahmad Laundry',
  );

  useEffect(() => {
    if (params.user) return;
    getSession().then((session) => {
      if (session.user) {
        setUserName(session.user);
      }
    });
  }, [params.user]);

  const toggle = (key: ReportCategory) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => (prev === key ? null : key));
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
        <View style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>Hai, {userName}</Text>
          <Text style={styles.greetingSubtitle}>Ini adalah laporan usaha laundry kamu</Text>
        </View>

        <View style={styles.listCard}>
          {REPORT_SECTIONS.map((section, idx) => {
            const isExpanded = expanded === section.key;
            return (
              <View key={section.key}>
                <Pressable style={styles.listHeader} onPress={() => toggle(section.key)}>
                  <View style={styles.headerLeft}>
                    <MaterialCommunityIcons
                      name={getSectionIcon(section.key)}
                      size={22}
                      color="#0A4DA8"
                    />
                    <Text style={styles.listHeaderText}>{section.title}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={22}
                    color="#0A4DA8"
                  />
                </Pressable>
                {isExpanded ? (
                  <View style={styles.itemsContainer}>
                    {section.items.map((item) => (
                      <Pressable key={item.title} style={styles.itemRow}>
                        <View style={styles.itemLeft}>
                          <MaterialCommunityIcons name={item.icon} size={20} color="#4B5C8B" />
                          <Text style={styles.itemText}>{item.title}</Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
                {idx < REPORT_SECTIONS.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            );
          })}
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

function getSectionIcon(key: ReportCategory): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (key) {
    case 'keuangan':
      return 'cash-multiple';
    case 'transaksi':
      return 'file-document-outline';
    case 'persediaan':
      return 'cube-outline';
    case 'pegawai':
      return 'account-group-outline';
    case 'pelanggan':
      return 'account-multiple';
    case 'export':
      return 'file-export-outline';
    default:
      return 'chart-arc';
  }
}

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
  greetingCard: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 4,
  },
  greetingTitle: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: '700',
    color: '#0B245A',
  },
  greetingSubtitle: {
    fontSize: 13,
    color: '#4B5C8B',
  },
  outletCard: {
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: '#F8FBFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4EBF7',
    padding: 12,
    gap: 4,
  },
  outletTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A4DA8',
  },
  outletSubtitle: {
    fontSize: 12,
    color: '#7A879B',
  },
  listCard: {
    marginTop: 12,
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B245A',
  },
  itemsContainer: {
    paddingBottom: 8,
    gap: 14,
    paddingHorizontal: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 13,
    color: '#4B5C8B',
    fontWeight: '600',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0F5',
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
    opacity: 0.55,
  },
});

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
