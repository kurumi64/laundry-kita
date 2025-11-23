import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const logoSource = require('@/assets/images/logo.png');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/onboarding');
    }, 1600);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <LinearGradient colors={['#001C5C', '#0054E1']} style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.logoWrapper}>
        <Image source={logoSource} style={styles.logo} contentFit="contain" />
        <Text style={styles.appName}>LaundryKita</Text>
      </View>
      <Text style={styles.version}>1.0.0</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  logoWrapper: {
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 180,
    height: 180,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  version: {
    position: 'absolute',
    bottom: 32,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 6,
  },
});
