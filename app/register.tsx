import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { register as registerRequest } from '@/lib/auth';

const logoSource = require('@/assets/images/logo.png');

export default function RegisterScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (loading) return;
    if (!name || !email || !phone || !password) {
      setErrorMessage('Semua field wajib diisi.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      const result = await registerRequest({ name, email, phone, password });
      Alert.alert('Registrasi berhasil', `Selamat datang ${result.user?.name ?? name}!`);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi kendala saat mendaftar. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={['#15006B', '#3975FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={[styles.hero, styles.heroSimple]}>
            <Image source={logoSource} style={styles.heroLogo} contentFit="contain" />
          </LinearGradient>
          <View style={styles.cardStack}>
            <View style={[styles.card, styles.registerCard]}>
              <View pointerEvents="none" style={styles.waveDecoration} />
              <Text style={styles.cardTitle}>Daftar Akun Baru</Text>
              <Text style={styles.cardSubtitle}>
                Pastikan nama, email, dan telepon bisa digunakan dengan benar.
              </Text>
              <InputField
                iconName="account-outline"
                placeholder="Nama"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
              <InputField
                iconName="email-outline"
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
              <InputField
                iconName="phone-outline"
                placeholder="Telepon"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                editable={!loading}
              />
              <InputField
                iconName="shield-lock-outline"
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                trailingIcon={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                onPressTrailing={() => setPasswordVisible((prev) => !prev)}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <View style={styles.termsRow}>
                <MaterialCommunityIcons name="check-decagram" size={22} color="#0A6CFF" />
                <Text style={styles.termsText}>
                  Dengan mendaftar, saya menyetujui syarat & ketentuan yang berlaku.
                </Text>
              </View>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <Pressable
                style={[
                  styles.primaryButton,
                  styles.registerButton,
                  loading && styles.primaryButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={loading}>
                <Text style={styles.primaryButtonText}>{loading ? 'Memproses...' : 'Daftar'}</Text>
              </Pressable>
              <Text style={styles.mutedText}>
                Sudah punya akun? <Link href="/login" style={styles.linkText}>Masuk sekarang</Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type InputFieldProps = TextInputProps & {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  trailingIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPressTrailing?: () => void;
};

const InputField = ({ iconName, trailingIcon, onPressTrailing, style, ...rest }: InputFieldProps) => {
  return (
    <View style={styles.inputRow}>
      <MaterialCommunityIcons name={iconName} size={22} color="#4B5C8B" />
      <TextInput
        placeholderTextColor="rgba(11,28,75,0.45)"
        style={[styles.input, style]}
        selectionColor="#0A6CFF"
        {...rest}
      />
      {trailingIcon ? (
        <Pressable onPress={onPressTrailing}>
          <MaterialCommunityIcons name={trailingIcon} size={22} color="#4B5C8B" />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: '#EFF4FF',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 24,
  },
  hero: {
    borderRadius: 32,
    padding: 24,
    gap: 16,
    shadowColor: '#00255A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  heroSimple: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLogo: {
    width: 140,
    height: 140,
  },
  cardStack: {
    gap: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 24,
    gap: 16,
    shadowColor: '#00368F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
    overflow: 'hidden',
  },
  registerCard: {
    paddingTop: 28,
  },
  waveDecoration: {
    position: 'absolute',
    top: -60,
    right: -30,
    width: 200,
    height: 140,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    backgroundColor: '#E7F0FF',
  },
  cardTitle: {
    fontSize: 22,
    color: '#0A2B7E',
    fontFamily: Fonts.rounded,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: 'rgba(10,43,126,0.75)',
    fontSize: 14,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    backgroundColor: '#F6F8FF',
    paddingHorizontal: 16,
    height: 58,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0A2B7E',
  },
  primaryButton: {
    backgroundColor: '#0A6CFF',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  registerButton: {
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    color: 'rgba(10,43,126,0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  mutedText: {
    textAlign: 'center',
    color: 'rgba(10,43,126,0.65)',
  },
  linkText: {
    color: '#0A6CFF',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF5A5F',
    textAlign: 'center',
    fontSize: 13,
  },
});
