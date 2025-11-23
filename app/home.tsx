import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { useFocusEffect, useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { getSession } from '@/lib/session';

const logoSource = require('@/assets/images/logo.png');

type SectionKey = 'transaksi' | 'keuangan' | 'kepegawaian';

type StatItem = {
  label: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type ActionItem = {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  badge?: number;
};

const SECTION_ORDER: SectionKey[] = ['keuangan', 'transaksi', 'kepegawaian'];

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
    gap: 6,
  },
  greetingTitle: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: '700',
    color: '#0B245A',
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#4B5C8B',
  },
  sectionCard: {
    marginHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#5A8FD7',
    paddingHorizontal: 12,
    paddingVertical: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  sectionTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  sectionTabActive: {
    backgroundColor: '#fff',
  },
  sectionTabText: {
    color: '#E7F0FF',
    fontWeight: '700',
    fontSize: 12,
  },
  sectionTabTextActive: {
    color: '#0A4DA8',
  },
  sectionBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  chevron: {
    padding: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statBubble: {
    width: 92,
    height: 92,
    borderRadius: 0,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 2 },
  },
  statLabel: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '700',
  },
  financialList: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 8,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financialLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  financialValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  actionsGrid: {
    marginTop: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  actionItem: {
    width: '30%',
    alignItems: 'center',
    gap: 8,
  },
  actionIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#E9F2FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  actionLabel: {
    textAlign: 'center',
    color: '#0B245A',
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFAE00',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  topCustomerCard: {
    marginTop: 16,
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerText: {
    color: '#0B245A',
    fontWeight: '600',
  },
  orderButton: {
    borderWidth: 1,
    borderColor: '#0A4DA8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  orderButtonText: {
    color: '#0A4DA8',
    fontWeight: '700',
  },
  summaryCard: {
    marginTop: 16,
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F5F8FF',
  },
  periodText: {
    color: '#0B245A',
    fontWeight: '600',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#4B5C8B',
    fontSize: 12,
    fontWeight: '600',
  },
  placeholderChart: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  placeholderChartText: {
    color: '#4B5C8B',
    fontSize: 13,
  },
  leaveCard: {
    marginTop: 16,
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaveCopy: {
    color: '#4B5C8B',
    fontSize: 13,
    lineHeight: 18,
  },
  linkText: {
    color: '#0A6CFF',
    fontWeight: '700',
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B245A',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
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

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const SECTION_DATA: Record<
  SectionKey,
  {
    stats: StatItem[];
    actions: ActionItem[];
    footer?: React.ReactNode;
  }
> = {
  transaksi: {
    stats: [
      { label: '1 Masuk', value: 'Masuk', icon: 'tray-arrow-down' },
      { label: '1 Harus Selesai', value: 'Deadline', icon: 'timer-sand' },
      { label: '1 Terlambat', value: 'Terlambat', icon: 'clock-alert' },
    ],
    actions: [
      { label: 'Konfirmasi', icon: 'check-decagram', badge: 0 },
      { label: 'Penjemputan', icon: 'map-marker-path', badge: 1 },
      { label: 'Antrian', icon: 'clipboard-list-outline', badge: 3 },
      { label: 'Proses', icon: 'tshirt-crew-outline', badge: 1 },
      { label: 'Siap Ambil', icon: 'bag-personal-outline', badge: 1 },
      { label: 'Siap Antar', icon: 'truck-delivery-outline', badge: 1 },
    ],
        footer: (
      <View style={styles.topCustomerCard}>
        <Text style={styles.cardHeading}>Top 5 Pelanggan Bulan Ini</Text>
        {[
          { name: 'dummy1', transaksi: 13, medal: 'medal-outline' },
          { name: 'dummy2', transaksi: 11, medal: 'medal' },
        ].map((item) => (
          <View key={item.name} style={styles.customerRow}>
            <View style={styles.customerInfo}>
              <MaterialCommunityIcons name={item.medal as any} size={20} color="#D4AF37" />
              <Text style={styles.customerText}>
                {item.name} {item.transaksi} Transaksi
              </Text>
            </View>
            <Pressable style={styles.orderButton}>
              <Text style={styles.orderButtonText}>+ Order</Text>
            </Pressable>
          </View>
        ))}
      </View>
    ),
  },
  keuangan: {
    stats: [
      { label: 'Pendapatan', value: 'Rp 10.000', icon: 'arrow-up-bold' },
      { label: 'Omzet', value: 'Rp 100.000', icon: 'cash-multiple' },
      { label: 'Pengeluaran', value: 'Rp 20.000', icon: 'arrow-down-bold' },
      { label: 'Saldo', value: 'Rp 1.000.000', icon: 'wallet' },
    ],
    actions: [],
    footer: (
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.cardHeading}>Ringkasan</Text>
          <Pressable style={styles.periodButton}>
            <Text style={styles.periodText}>Hari Ini ▾</Text>
          </Pressable>
        </View>
        <View style={styles.legendRow}>
          <LegendDot color="#0052CC" label="Omzet" />
          <LegendDot color="#3FB36C" label="Pendapatan" />
          <LegendDot color="#E53C3C" label="Pengeluaran" />
          <LegendDot color="#00A89F" label="Saldo" />
        </View>
        <View style={styles.placeholderChart}>
          <Text style={styles.placeholderChartText}>Grafik keuangan tampil di sini</Text>
        </View>
      </View>
    ),
  },
  kepegawaian: {
    stats: [
      { label: '3 Hadir', value: 'Hadir', icon: 'account-check' },
      { label: '0 Belum Hadir', value: 'Belum Hadir', icon: 'account-clock' },
      { label: '1 Terlambat', value: 'Terlambat', icon: 'account-alert' },
    ],
    actions: [
      { label: 'Pengajuan Lembur', icon: 'calendar-clock' },
      { label: 'Pengajuan Cuti / Ijin', icon: 'briefcase-clock-outline' },
      { label: 'Pengajuan Jadwal', icon: 'calendar-edit' },
      { label: 'Buat Slip Gaji', icon: 'file-document-edit' },
      { label: 'Kelola Jadwal', icon: 'calendar-range-outline' },
      { label: 'Kelola Presensi', icon: 'fingerprint' },
    ],
    footer: (
      <View style={styles.leaveCard}>
        <View style={styles.leaveHeader}>
          <Text style={styles.cardHeading}>Daftar Cuti</Text>
          <Pressable>
            <Text style={styles.linkText}>Lebih Detail</Text>
          </Pressable>
        </View>
        <Text style={styles.leaveCopy}>
          Pegawai yang akan cuti dalam 7 hari ke depan akan tampil di sini
        </Text>
      </View>
    ),
  },
};

export default function HomeScreen() {
  const params = useLocalSearchParams<{ user?: string }>();
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<SectionKey>('transaksi');
  const [userName, setUserName] = useState<string>(
    params.user ? String(params.user) : 'Ahmad Laundry',
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (params.user) return;
    getSession().then((session) => {
      if (session.user) {
        setUserName(session.user);
      }
    });
  }, [params.user]);

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  const activeIndex = SECTION_ORDER.indexOf(activeSection);
  const goPrev = () =>
    setActiveSection(SECTION_ORDER[(activeIndex - 1 + SECTION_ORDER.length) % SECTION_ORDER.length]);
  const goNext = () => setActiveSection(SECTION_ORDER[(activeIndex + 1) % SECTION_ORDER.length]);

  const section = useMemo(() => SECTION_DATA[activeSection], [activeSection]);

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
          { paddingBottom: 160 + insets.bottom, paddingTop: 12 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>Hai, {userName}</Text>
          <Text style={styles.greetingSubtitle}>Selamat datang kembali!</Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTabs}>
            {SECTION_ORDER.map((key) => (
              <Pressable
                key={key}
                onPress={() => setActiveSection(key)}
                style={[
                  styles.sectionTab,
                  activeSection === key && styles.sectionTabActive,
                ]}>
                <Text
                  style={[
                    styles.sectionTabText,
                    activeSection === key && styles.sectionTabTextActive,
                  ]}>
                  {key.toUpperCase()}
                </Text>
              </Pressable>
            ))}
        </View>
        <View style={styles.sectionBody}>
          <Pressable onPress={goPrev} style={styles.chevron}>
            <MaterialCommunityIcons name="chevron-left" size={26} color="#fff" />
          </Pressable>
          {activeSection === 'keuangan' ? (
            <View style={styles.financialList}>
              {section.stats.map((item) => (
                <View key={item.label} style={styles.financialRow}>
                  <Text style={styles.financialLabel}>{item.label}</Text>
                  <Text style={styles.financialValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statsRow}>
              {section.stats.map((item) => (
                <View key={item.label} style={styles.statBubble}>
                  <MaterialCommunityIcons name={item.icon} size={38} color="#fff" />
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              ))}
            </ScrollView>
          )}
          <Pressable onPress={goNext} style={styles.chevron}>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#fff" />
          </Pressable>
        </View>
        </View>

        {section.actions.length > 0 ? (
          <View style={styles.actionsGrid}>
            {section.actions.map((action) => (
              <View key={action.label} style={styles.actionItem}>
                <View style={styles.actionIconWrapper}>
                  <MaterialCommunityIcons name={action.icon} size={34} color="#0A4DA8" />
                  {action.badge ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{action.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {section.footer}
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: 16 + insets.bottom }]}>
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
