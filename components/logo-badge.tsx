import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type LogoBadgeProps = {
  size?: 'small' | 'medium' | 'large' | 'hero';
};

const SIZE_MAP: Record<NonNullable<LogoBadgeProps['size']>, number> = {
  small: 74,
  medium: 94,
  large: 120,
  hero: 160,
};

export function LogoBadge({ size = 'medium' }: LogoBadgeProps) {
  const dimension = SIZE_MAP[size];
  const borderRadius = dimension * 0.38;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFC756', '#FF8863']}
        style={[
          styles.sun,
          {
            width: dimension * 0.6,
            height: dimension * 0.6,
            borderRadius: dimension,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        colors={['#002B7A', '#0A6CFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.badge,
          {
            width: dimension,
            height: dimension,
            borderRadius,
            padding: dimension * 0.2,
          },
        ]}>
        <View style={styles.dropletWrapper}>
          <View
            style={[
              styles.droplet,
              {
                width: dimension * 0.45,
                height: dimension * 0.45,
                borderRadius: dimension,
              },
            ]}>
            <MaterialCommunityIcons name="water" size={dimension * 0.3} color="#fff" />
            <MaterialCommunityIcons
              name="star-four-points-outline"
              size={dimension * 0.18}
              color="rgba(255,255,255,0.85)"
              style={styles.sparkles}
            />
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.brand,
              {
                fontSize: dimension * 0.26,
              },
            ]}>
            LAUNDRY
          </Text>
          <Text
            style={[
              styles.brandAccent,
              {
                fontSize: dimension * 0.32,
              },
            ]}>
            KITA
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  sun: {
    position: 'absolute',
    top: -10,
    right: -6,
    opacity: 0.9,
  },
  badge: {
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  dropletWrapper: {
    alignItems: 'flex-end',
  },
  droplet: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkles: {
    position: 'absolute',
    right: 6,
    top: 4,
  },
  brand: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  brandAccent: {
    color: '#FFCF62',
    fontFamily: Fonts.rounded,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
