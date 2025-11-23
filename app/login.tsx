import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
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
import { login as loginRequest } from '@/lib/auth';
import { saveSession } from '@/lib/session';

const logoSource = require('@/assets/images/logo.png');

type Role = 'pemilik' | 'pegawai';

const ROLE_OPTIONS: { key: Role; label: string }[] = [
  { key: 'pemilik', label: 'Pemilik' },
  { key: 'pegawai', label: 'Pegawai' },
];

export default function AuthScreen() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<Role>('pemilik');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      feedbackAnim.setValue(0);
      return;
    }
    Animated.sequence([
      Animated.timing(feedbackAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(600),
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setStatus('idle'));
  }, [status, feedbackAnim]);

  const handleSubmit = async () => {
    if (loading) return;
    if (!email || !password) {
      setErrorMessage('Email dan kata sandi wajib diisi.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    setStatus('idle');
    try {
      const result = await loginRequest({ email, password });
      const displayName = result.user?.name ?? email;
      if (result.token) {
        await saveSession(result.token, displayName);
      }
      setStatus('success');
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = setTimeout(() => {
        router.replace({ pathname: '/home', params: { user: displayName } });
      }, 900);
      // TODO: simpan token result.token ke secure storage atau context.
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi masalah saat masuk. Coba lagi nanti.');
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
            colors={['#002C7A', '#0E84FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, styles.heroSimple]}>
            <Image source={logoSource} style={styles.heroLogo} contentFit="contain" />
          </LinearGradient>
          <View style={styles.cardStack}>
            <LoginCard
              activeRole={activeRole}
              onChangeRole={setActiveRole}
              email={email}
              password={password}
              onChangeEmail={setEmail}
              onChangePassword={setPassword}
              loading={loading}
              errorMessage={errorMessage}
              onSubmit={handleSubmit}
              status={status}
              feedbackAnim={feedbackAnim}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type LoginCardProps = {
  activeRole: Role;
  onChangeRole: (role: Role) => void;
  email: string;
  password: string;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  loading: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
  status: 'idle' | 'success' | 'error';
  feedbackAnim: Animated.Value;
};

const LoginCard = ({
  activeRole,
  onChangeRole,
  email,
  password,
  onChangeEmail,
  onChangePassword,
  loading,
  errorMessage,
  onSubmit,
  status,
  feedbackAnim,
}: LoginCardProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View pointerEvents="none" style={styles.waveDecoration} />
      <Text style={styles.cardHeading}>Login sebagai:</Text>
      <View style={styles.segmented}>
        {ROLE_OPTIONS.map((option) => {
          const isActive = option.key === activeRole;
          return (
            <Pressable
              key={option.key}
              onPress={() => onChangeRole(option.key)}
              style={[styles.segmentedButton, isActive && styles.segmentedButtonActive]}>
              <Text style={[styles.segmentedLabel, isActive && styles.segmentedLabelActive]}>
                {option.label.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <InputField
        iconName="email-outline"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={onChangeEmail}
        editable={!loading}
      />
      <InputField
        iconName="lock-outline"
        placeholder="Kata Sandi"
        secureTextEntry={!passwordVisible}
        trailingIcon={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
        onPressTrailing={() => setPasswordVisible((prev) => !prev)}
        value={password}
        onChangeText={onChangePassword}
        editable={!loading}
      />
      <Pressable style={styles.linkButton}>
        <Text style={styles.linkText}>Lupa Password?</Text>
      </Pressable>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Pressable
        style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
        onPress={onSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Masuk</Text>
        )}
      </Pressable>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.feedbackRow,
          {
            opacity: feedbackAnim,
            transform: [
              {
                scale: feedbackAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}>
        {status === 'success' ? (
          <>
            <MaterialCommunityIcons name="check-circle" size={22} color="#3FB36C" />
            <Text style={[styles.feedbackText, { color: '#3FB36C' }]}>Login berhasil</Text>
          </>
        ) : status === 'error' ? (
          <>
            <MaterialCommunityIcons name="close-circle" size={22} color="#E53C3C" />
            <Text style={[styles.feedbackText, { color: '#E53C3C' }]}>Login gagal</Text>
          </>
        ) : null}
      </Animated.View>
      <View style={styles.socialRow}>
        <SocialButton iconName="google" label="Google" />
        <SocialButton iconName="cellphone-key" label="Nomor HP" />
      </View>
      <Text style={styles.mutedText}>
        Belum punya akun?{' '}
        <Link href="/register" style={styles.linkText}>
          Daftar sekarang
        </Link>
      </Text>
    </View>
  );
};

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

type SocialButtonProps = {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
};

const SocialButton = ({ iconName, label }: SocialButtonProps) => {
  return (
    <Pressable style={styles.socialButton}>
      <MaterialCommunityIcons name={iconName} size={20} color="#0A2B7E" />
      <Text style={styles.socialLabel}>{label}</Text>
    </Pressable>
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
    shadowColor: '#00368F',
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
  cardHeading: {
    fontSize: 16,
    color: '#0A2B7E',
    fontWeight: '600',
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
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#F1F4FF',
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  segmentedButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentedButtonActive: {
    backgroundColor: '#0A6CFF',
  },
  segmentedLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7B88B2',
    letterSpacing: 0.6,
  },
  segmentedLabelActive: {
    color: '#fff',
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
  linkButton: {
    alignSelf: 'flex-end',
  },
  linkText: {
    color: '#0A6CFF',
    fontWeight: '600',
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
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#D7E0FF',
    borderRadius: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  socialLabel: {
    color: '#0A2B7E',
    fontWeight: '600',
  },
  mutedText: {
    textAlign: 'center',
    color: 'rgba(10,43,126,0.65)',
  },
  errorText: {
    color: '#FF5A5F',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 4,
  },
  feedbackRow: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    minHeight: 26,
    flexDirection: 'row',
  },
  feedbackText: {
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
});
