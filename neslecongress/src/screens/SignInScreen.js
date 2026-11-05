import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, GradientButton, TextField, OrDivider, SocialRow } from '../components/ui';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme';

const pills = [
  { icon: 'people', label: 'Global\nExperts' },
  { icon: 'easel-outline', label: 'Knowledge\nSessions' },
  { icon: 'star', label: 'Networking\nOpportunities', gold: true },
];

export default function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const enter = async (demo = false) => {
    if (busy) return;
    try {
      setBusy(true);
      setNotice('');
      await signIn(demo ? { demo: true } : { email: email.trim(), password });
    } catch (error) {
      setNotice(error.message || 'Sign in failed.');
      setBusy(false);
      return;
    }
    setBusy(false);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const forgot = async () => {
    if (!email.trim()) {
      setNotice('Enter your email above first.');
      return;
    }
    try {
      const result = await api('/forgot-password', { method: 'POST', body: { email } });
      setNotice(result.message);
    } catch (error) {
      setNotice(error.message);
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NESTLÉ MEDICAL CONGRESS</Text>
        </View>
        <Text style={styles.wordWhite}>NESTLÉ</Text>
        <Text style={styles.wordGold}>CONGRESS</Text>
        <View style={styles.goldLine} />
        <Text style={styles.subtitle}>The Next Era of{'\n'}Nutrition & Health</Text>

        <View style={styles.card}>
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeCopy}>
              <Text style={styles.welcome}>Welcome Back</Text>
              <Text style={styles.welcomeSub}>Sign in to continue your congress experience</Text>
            </View>
            <LinearGradient colors={['#2F6BFF', '#49B4FF']} style={styles.shield}>
              <Ionicons name="shield-checkmark" size={18} color="#fff" />
            </LinearGradient>
          </View>

          <TextField icon="person-outline" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextField
            icon="lock-closed-outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secure
            revealed={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
          <GradientButton label={busy ? 'Signing in...' : 'Sign In'} trailing="arrow-forward" onPress={() => enter(false)} />
          <OrDivider label="OR CONTINUE WITH" />
          <SocialRow onGoogle={() => enter(true)} onApple={() => enter(true)} />
          <Pressable style={styles.forgot} onPress={forgot}>
            <Ionicons name="lock-closed" size={12} color={colors.link} />
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        </View>

        <Text style={styles.switch}>
          Don't have an account?{' '}
          <Text style={styles.switchLink} onPress={() => navigation.navigate('SignUp')}>Create Account →</Text>
        </Text>

        <View style={styles.pills}>
          {pills.map((pill) => (
            <View key={pill.label} style={styles.pill}>
              <View style={[styles.pillIcon, pill.gold && styles.pillGold]}>
                <Ionicons name={pill.icon} size={14} color={pill.gold ? '#1B2A4A' : '#D6E4FF'} />
              </View>
              <Text style={styles.pillText}>{pill.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 8, flexGrow: 1 },
  badge: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
  },
  badgeText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 10, letterSpacing: 1 },
  wordWhite: { color: '#fff', fontFamily: fonts.extra, fontSize: 36, textAlign: 'center', letterSpacing: 1, lineHeight: 40 },
  wordGold: { color: colors.gold, fontFamily: fonts.extra, fontSize: 36, textAlign: 'center', letterSpacing: 1, lineHeight: 40 },
  goldLine: { width: 28, height: 2, backgroundColor: colors.gold, alignSelf: 'center', marginTop: 8, borderRadius: 1 },
  subtitle: { color: 'rgba(255,255,255,0.82)', textAlign: 'center', fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, marginTop: 10, marginBottom: 18 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 18, gap: 12 },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  welcomeCopy: { flex: 1 },
  welcome: { color: colors.ink, fontFamily: fonts.extra, fontSize: 22 },
  welcomeSub: { color: colors.muted, fontFamily: fonts.regular, fontSize: 13, marginTop: 4, lineHeight: 18 },
  shield: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  forgot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 2 },
  forgotText: { color: colors.link, fontFamily: fonts.semibold, fontSize: 14 },
  notice: { color: '#C24141', textAlign: 'center', fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  switch: { color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 16, fontFamily: fonts.regular, fontSize: 14 },
  switchLink: { color: colors.gold, fontFamily: fonts.bold },
  pills: { flexDirection: 'row', gap: 8, marginTop: 18 },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(8, 24, 68, 0.55)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  pillIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  pillGold: { backgroundColor: colors.gold },
  pillText: { color: '#fff', fontFamily: fonts.medium, fontSize: 10, lineHeight: 13, flex: 1 },
});
