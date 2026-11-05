import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, GradientButton, TextField, OrDivider, SocialRow } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme';

export default function SignUpScreen({ navigation }) {
  const { signUp, signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  const finish = async () => {
    try {
      setError('');
      await signUp({ name, email, password, organization });
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      setError(err.message);
    }
  };

  const social = async () => {
    try {
      setError('');
      await signIn({ demo: true });
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      setError(err.message);
    }
  };

  const create = () => {
    if (!agree) {
      setError('Please accept the guidelines to continue.');
      return;
    }
    finish();
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.join}>Join the</Text>
        <Text style={styles.gold}>NESTLÉ</Text>
        <Text style={styles.gold}>CONGRESS</Text>
        <Text style={styles.subtitle}>Create your attendee profile and access sessions, resources, voting and Q&A.</Text>

        <View style={styles.card}>
          <TextField icon="person-outline" placeholder="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
          <TextField icon="mail-outline" placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextField icon="business-outline" placeholder="Hospital / Organization" value={organization} onChangeText={setOrganization} autoCapitalize="words" />
          <TextField
            icon="lock-closed-outline"
            placeholder="Create password"
            value={password}
            onChangeText={setPassword}
            secure
            revealed={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
          <Pressable style={styles.checkRow} onPress={() => { setAgree((v) => !v); setError(''); }}>
            <View style={[styles.box, agree && styles.boxOn]}>
              {agree ? <Ionicons name="checkmark" size={13} color="#fff" /> : null}
            </View>
            <Text style={styles.checkText}>I agree to the congress terms, privacy policy and attendee guidelines.</Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <GradientButton label="Create Account" leading="person-add" onPress={create} />
          <OrDivider label="OR SIGN UP WITH" />
          <SocialRow letterG onGoogle={social} onApple={social} />
        </View>

        <Text style={styles.switch}>
          Already have an account?{' '}
          <Text style={styles.switchLink} onPress={() => navigation.goBack()}>Sign In</Text>
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 18 },
  join: { color: '#fff', fontFamily: fonts.extra, fontSize: 30, textAlign: 'center', lineHeight: 34 },
  gold: { color: colors.gold, fontFamily: fonts.extra, fontSize: 34, textAlign: 'center', letterSpacing: 0.6, lineHeight: 38 },
  subtitle: { color: 'rgba(255,255,255,0.78)', textAlign: 'center', fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 16, paddingHorizontal: 12 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 16, gap: 10 },
  checkRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 2 },
  box: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#C5CEDA', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxOn: { backgroundColor: colors.blue, borderColor: colors.blue },
  checkText: { flex: 1, color: colors.muted, fontFamily: fonts.regular, fontSize: 12, lineHeight: 17 },
  error: { color: '#E25555', fontFamily: fonts.medium, fontSize: 12 },
  switch: { color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 16, fontFamily: fonts.regular, fontSize: 14 },
  switchLink: { color: colors.gold, fontFamily: fonts.bold },
});
