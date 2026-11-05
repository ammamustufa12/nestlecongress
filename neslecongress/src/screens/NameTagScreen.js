import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader } from '../components/ui';
import { colors, fonts } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useCongress } from '../context/CongressContext';

export default function NameTagScreen({ navigation }) {
  const { user } = useAuth();
  const { event } = useCongress();
  const rows = [
    { icon: 'id-card-outline', label: 'Badge ID', value: user?.badge_id || '' },
    { icon: 'location-outline', label: 'Location', value: user?.location || '' },
    { icon: 'calendar-outline', label: 'Congress Date', value: event?.date_short || '' },
  ];
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);

  return (
    <Screen>
      <DarkHeader title="My Name Tag" onBack={() => navigation.goBack()} right="download-outline" onRight={() => setSaved(true)} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        {saved ? <Text style={styles.notice}>Badge saved on this device.</Text> : null}
        <View style={styles.card}>
          <LinearGradient colors={['#2F7BFF', '#49C2FF']} style={styles.banner}>
            <Text style={styles.bannerKicker}>NESTLÉ MEDICAL</Text>
            <Text style={styles.bannerTitle}>CONGRESS 2026</Text>
          </LinearGradient>
          <LinearGradient colors={['#F6C14A', '#8EB6FF']} style={styles.ring}>
            <View style={styles.avatar}><Text style={styles.initials}>{user?.initials || 'NA'}</Text></View>
          </LinearGradient>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.role}>{user?.badge_role}</Text>
          {rows.map((row) => (
            <View key={row.label} style={styles.info}>
              <View style={styles.infoIcon}><Ionicons name={row.icon} size={16} color={colors.blue} /></View>
              <View>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
            </View>
          ))}
          <QrMark />
        </View>
      </ScrollView>
    </Screen>
  );
}

function QrMark() {
  const size = 21;
  const cells = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const finder = isFinder(x, y, size);
      const on = finder ? finderOn(x, y, size) : (x * 3 + y * 5) % 4 !== 0;
      cells.push(on);
    }
  }
  return (
    <View style={styles.qr}>
      {cells.map((on, index) => (
        <View key={index} style={[styles.cell, on && styles.cellOn]} />
      ))}
    </View>
  );
}

function isFinder(x, y, size) {
  return (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);
}

function finderOn(x, y, size) {
  const local = (n, edge) => (edge ? size - 1 - n : n);
  const lx = x > size - 8 ? local(x, true) : x;
  const ly = y > size - 8 ? local(y, true) : y;
  const edge = lx === 0 || ly === 0 || lx === 6 || ly === 6;
  const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
  return edge || core;
}

const styles = StyleSheet.create({
  notice: { color: colors.gold, fontFamily: fonts.medium, textAlign: 'center', marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 28, paddingBottom: 22, alignItems: 'center', overflow: 'hidden' },
  banner: { width: '100%', paddingVertical: 18, alignItems: 'center' },
  bannerKicker: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.semibold, letterSpacing: 1.2, fontSize: 12 },
  bannerTitle: { color: '#fff', fontFamily: fonts.extra, fontSize: 16, letterSpacing: 0.6, marginTop: 2 },
  ring: { width: 86, height: 86, borderRadius: 43, alignItems: 'center', justifyContent: 'center', marginTop: -28 },
  avatar: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#F4F7FB', alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.blue, fontFamily: fonts.extra, fontSize: 26 },
  name: { color: colors.ink, fontFamily: fonts.extra, fontSize: 24, marginTop: 10 },
  role: { color: colors.muted, fontFamily: fonts.regular, fontSize: 13, marginTop: 4, marginBottom: 8 },
  info: { width: '88%', flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#F6F8FB', borderRadius: 14, padding: 12, marginTop: 8 },
  infoIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#E8F0FF', alignItems: 'center', justifyContent: 'center' },
  infoLabel: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11 },
  infoValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 14, marginTop: 1 },
  qr: { width: 168, height: 168, marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', padding: 8 },
  cell: { width: `${100 / 21}%`, aspectRatio: 1, backgroundColor: '#fff' },
  cellOn: { backgroundColor: '#16233F' },
});
