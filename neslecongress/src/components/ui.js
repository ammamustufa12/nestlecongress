import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

export function Screen({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={['#071433', '#0B2466', '#08183F']} style={styles.fill} start={{ x: 0.15, y: 0 }} end={{ x: 0.9, y: 1 }}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {DOTS.map(([left, top]) => (
          <View key={`${left}-${top}`} style={[styles.dot, { left, top }]} />
        ))}
      </View>
      <View style={[styles.fill, { paddingTop: insets.top }]}>{children}</View>
    </LinearGradient>
  );
}

export function GradientButton({ label, onPress, leading, trailing }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <LinearGradient
        colors={['#1A46F0', '#2F7BFF', '#3EC0FF']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.button}
      >
        {leading ? <Ionicons name={leading} size={16} color="#fff" /> : null}
        <Text style={styles.buttonText}>{label}</Text>
        {trailing ? <Ionicons name={trailing} size={16} color="#fff" /> : null}
      </LinearGradient>
    </Pressable>
  );
}

export function TextField({ icon, placeholder, value, onChangeText, secure, revealed, onToggle, keyboardType, autoCapitalize }) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={18} color="#98A4B8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A3AEC0"
        secureTextEntry={secure && !revealed}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'none'}
        autoCorrect={false}
        style={styles.input}
      />
      {secure ? (
        <Pressable onPress={onToggle} hitSlop={8}>
          <Ionicons name={revealed ? 'eye-off-outline' : 'eye-outline'} size={18} color="#98A4B8" />
        </Pressable>
      ) : null}
    </View>
  );
}

export function OrDivider({ label }) {
  return (
    <View style={styles.orRow}>
      <View style={styles.orLine} />
      <Text style={styles.orText}>{label}</Text>
      <View style={styles.orLine} />
    </View>
  );
}

export function GoogleMark({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <Path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <Path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.1l6.3 5.3C37.4 38.4 44 34 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </Svg>
  );
}

export function SocialRow({ onGoogle, onApple, letterG }) {
  return (
    <View style={styles.socialRow}>
      <Pressable style={styles.social} onPress={onGoogle}>
        {letterG ? <Text style={styles.gLetter}>G</Text> : <GoogleMark />}
      </Pressable>
      <Pressable style={styles.social} onPress={onApple}>
        <Ionicons name="logo-apple" size={20} color="#111" />
      </Pressable>
    </View>
  );
}

export function DarkHeader({ title, onBack, right, onRight, gold }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.headerBtn} hitSlop={6}>
        <Ionicons name="chevron-back" size={20} color="#fff" />
      </Pressable>
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      <Pressable onPress={onRight} style={[styles.headerBtn, gold && styles.headerGold]} hitSlop={6}>
        <Ionicons name={right} size={18} color={gold ? '#1B2A4A' : '#fff'} />
      </Pressable>
    </View>
  );
}

export function HeroCard({ icon, title, subtitle, gold }) {
  return (
    <View style={styles.hero}>
      <LinearGradient colors={gold ? ['#F6C14A', '#F0A93A'] : ['#3B82F6', '#60A5FA']} style={styles.heroIcon}>
        <Ionicons name={icon} size={22} color={gold ? '#1B2A4A' : '#fff'} />
      </LinearGradient>
      <View style={styles.heroCopy}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

export function Chip({ label, active, onPress, tone = 'blue' }) {
  const activeBg = tone === 'gold' ? colors.gold : colors.blue;
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && { backgroundColor: activeBg }]}>
      <Text style={[styles.chipText, active && styles.chipTextOn, active && tone === 'gold' && { color: '#1B2A4A' }]}>{label}</Text>
    </Pressable>
  );
}

const DOTS = [[18, 22], [32, 14], [46, 30], [22, 46], [58, 18], [70, 40], [36, 62]];

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pressed: { opacity: 0.92 },
  dot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  field: {
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.field,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontFamily: fonts.medium,
    fontSize: 14,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
  },
  orLine: { flex: 1, height: 1, backgroundColor: '#E6EBF2' },
  orText: {
    color: '#9AA6B8',
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  socialRow: { flexDirection: 'row', gap: 12 },
  social: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6EBF2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  gLetter: { color: '#1A73E8', fontFamily: fonts.extra, fontSize: 18 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerGold: { backgroundColor: colors.gold, borderRadius: 12 },
  headerTitle: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 18,
    position: 'absolute',
    left: 64,
    right: 64,
    textAlign: 'center',
  },
  hero: {
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(18, 42, 96, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1 },
  heroTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 16, lineHeight: 20 },
  heroSub: { color: 'rgba(255,255,255,0.72)', fontFamily: fonts.regular, fontSize: 12, marginTop: 3, lineHeight: 16 },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: { color: '#66758C', fontFamily: fonts.semibold, fontSize: 13 },
  chipTextOn: { color: '#fff' },
});
