import type { ComponentProps } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Slide = {
  key: string;
  title: string;
  subtitle?: string;
  description?: string;
  helper?: string;
  version?: string;
  kicker?: string;
  icon?: { name: IconName; accent: string };
  colors: [string, string];
};

const SLIDES: Slide[] = [
  {
    key: 'intro',
    title: 'Selamat Datang, di LaundryKita',
    subtitle: 'LaundryKita',
    description: 'Solusi cerdas buat laundymu makin berkualitas.',
    helper: 'Geser untuk kenal LaundryKita lebih dalam.',
    icon: { name: 'washing-machine', accent: '#FFD46E' },
    colors: ['#00307F', '#0FB7FF'],
  },
  {
    key: 'risk',
    kicker: 'Kenapa Kamu Harus pakai LaundryKita?',
    title: 'Minim Resiko',
    description:
      'Meminimalisir resiko kehilangan baju pelanggan, dan memastikan urutan antrian pemesanan.',
    icon: { name: 'shield-check', accent: '#9BF5D7' },
    colors: ['#02205B', '#1271FF'],
  },
  {
    key: 'online',
    kicker: 'Kenapa Kamu Harus pakai LaundryKita?',
    title: 'Layanan Online',
    description:
      'Dilengkapi dengan aplikasi customer, sehingga memudahkan dalam pemesanan via aplikasi.',
    icon: { name: 'tablet-cellphone', accent: '#FFAACF' },
    colors: ['#01285B', '#0A8DFF'],
  },
  {
    key: 'tracking',
    kicker: 'Kenapa Kamu Harus pakai LaundryKita?',
    title: 'Mudah Dilacak',
    description:
      'Atasi komplain pelanggan dengan mudah, ketahui riwayat transaksi laundry kapan saja.',
    icon: { name: 'clipboard-check-multiple-outline', accent: '#FFCA66' },
    colors: ['#001F4F', '#1680FF'],
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const listRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastSlide = currentIndex === SLIDES.length - 1;
  const router = useRouter();

  const helperText = useMemo(
    () =>
      SLIDES[currentIndex].helper ??
      'Geser untuk melihat kenapa LaundryKita siap membantu operasionalmu.',
    [currentIndex],
  );

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const nextIndex = Math.round(offsetX / SCREEN_WIDTH);
      setCurrentIndex(nextIndex);
    },
    [],
  );

  const handleContinue = useCallback(() => {
    if (isLastSlide) {
      router.navigate('/login');
      return;
    }
    const nextIndex = Math.min(currentIndex + 1, SLIDES.length - 1);
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  }, [currentIndex, isLastSlide, router]);

  const renderItem = useCallback<ListRenderItem<Slide>>(({ item }) => {
    return <SlideCard item={item} />;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.sliderWrapper}>
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={SCREEN_WIDTH}
          decelerationRate="fast"
          style={styles.slider}
          contentContainerStyle={styles.sliderContent}
          onMomentumScrollEnd={handleMomentumEnd}
        />
        <View style={styles.metaOverlay}>
          <View style={styles.indicatorRow}>
            {SLIDES.map((slide, index) => (
              <View
                key={slide.key}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot,
                  { opacity: index <= currentIndex ? 1 : 0.6 },
                ]}
              />
            ))}
          </View>
          <Text style={styles.helper}>{helperText}</Text>
          <Pressable onPress={handleContinue} style={styles.ctaPressable}>
            <LinearGradient
              colors={isLastSlide ? ['#FFB347', '#FF794C'] : ['#FFFFFF', '#E3ECFF']}
              style={styles.ctaGradient}>
              <Text style={[styles.ctaText, isLastSlide && styles.ctaTextInverted]}>
                {isLastSlide ? 'Mulai Sekarang' : 'Lanjut'}
              </Text>
              <Feather
                name="arrow-right"
                color={isLastSlide ? '#fff' : '#0A2B7E'}
                size={20}
              />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

type SlideCardProps = {
  item: Slide;
};

const SlideCard = memo(({ item }: SlideCardProps) => {
  return (
    <LinearGradient
      colors={item.colors}
      style={[styles.slide, { width: SCREEN_WIDTH }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <View style={styles.slideBody}>
        {item.kicker ? (
          <Text style={styles.kickerTop}>{item.kicker}</Text>
        ) : (
          <View style={styles.kickerSpacer} />
        )}
        <View style={styles.illustrationWrapper}>
          {item.icon && <Illustration iconName={item.icon.name} accent={item.icon.accent} />}
        </View>
        <View style={styles.slideCopy}>
          <Text style={styles.title}>{item.title}</Text>
          {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
          {item.description ? <Text style={styles.body}>{item.description}</Text> : null}
        </View>
      </View>
    </LinearGradient>
  );
});

SlideCard.displayName = 'SlideCard';

type IllustrationProps = {
  iconName: IconName;
  accent: string;
};

const Illustration = ({ iconName, accent }: IllustrationProps) => {
  return (
    <View style={styles.illustration}>
      <View style={styles.illustrationAccent} />
      <View style={[styles.illustrationCircle, { backgroundColor: accent }]}>
        <MaterialCommunityIcons name={iconName} size={80} color="#00316D" />
      </View>
      <View style={styles.illustrationOverlay}>
        <MaterialCommunityIcons name="dots-grid" size={32} color="rgba(255,255,255,0.35)" />
        <MaterialCommunityIcons name="tshirt-crew" size={36} color="rgba(255,255,255,0.85)" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00143A',
  },
  sliderWrapper: {
    flex: 1,
  },
  slider: {
    flex: 1,
  },
  sliderContent: {
    flexGrow: 1,
  },
  slide: {
    height: '100%',
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 200,
    justifyContent: 'flex-start',
  },
  slideBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  illustrationWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  slideCopy: {
    marginTop: 24,
    gap: 10,
  },
  kickerTop: {
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  kickerSpacer: {
    height: 25,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 34,
    fontFamily: Fonts.rounded,
    fontWeight: '700',
  },
  subtitle: {
    color: '#D0E6FF',
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 22,
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  illustrationCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationAccent: {
    position: 'absolute',
    width: 200,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.25)',
    top: -16,
    transform: [{ rotate: '-8deg' }],
  },
  illustrationOverlay: {
    position: 'absolute',
    bottom: -20,
    right: 0,
    gap: 4,
  },
  metaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#02143A',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 34,
    gap: 14,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 20,
    elevation: 12,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: 10,
  },
  activeDot: {
    width: 28,
    backgroundColor: '#FFFFFF',
  },
  helper: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  ctaPressable: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 999,
    gap: 8,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A2B7E',
  },
  ctaTextInverted: {
    color: '#fff',
  },
});
