import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, DarkHeader } from '../components/ui';
import { TabBar } from '../components/TabBar';
import { fonts, colors } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [menu, setMenu] = useState(false);
  const details = [
    { icon: 'mail-outline', label: 'Email', value: user?.email || '' },
    { icon: 'call-outline', label: 'Phone', value: user?.phone || 'Not added' },
    { icon: 'location-outline', label: 'Location', value: user?.location || '' },
  ];
  const stats = user?.stats || [];

  return (
    <Screen>
      <DarkHeader title="My Profile" onBack={() => navigation.navigate('Home')} right="settings-outline" onRight={() => setMenu((v) => !v)} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {menu ? (
          <Pressable
            style={styles.menu}
            onPress={async () => {
              await signOut();
              navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
            }}
          >
            <Ionicons name="log-out-outline" size={16} color="#fff" />
            <Text style={styles.menuText}>Sign out</Text>
          </Pressable>
        ) : null}
        <LinearGradient colors={['#F6C14A', '#8EB6FF']} style={styles.ring}>
          <View style={styles.avatar}><Text style={styles.initials}>{user?.initials || 'NA'}</Text></View>
          <View style={styles.edit}><Ionicons name="pencil" size={12} color="#1B2A4A" /></View>
        </LinearGradient>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{user?.role}</Text>
        <Text style={styles.id}>ID: {user?.badge_id}</Text>

        <View style={styles.card}>
          {details.map((item) => (
            <View key={item.label} style={styles.row}>
              <View style={styles.icon}><Ionicons name={item.icon} size={16} color={colors.blue} /></View>
              <View>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.stats}>
          {stats.map((item) => (
            <View key={item.label} style={styles.stat}>
              <Ionicons name={item.icon} size={16} color={colors.blue} />
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <TabBar navigation={navigation} active="profile" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { alignItems: 'center', paddingHorizontal: 16, paddingBottom: 120 },
  menu: { alignSelf: 'flex-end', flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  menuText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 13 },
  ring: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#102454', alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#fff', fontFamily: fonts.extra, fontSize: 28 },
  edit: { position: 'absolute', right: 2, bottom: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  name: { color: '#fff', fontFamily: fonts.extra, fontSize: 26, marginTop: 12 },
  role: { color: colors.soft, fontFamily: fonts.regular, fontSize: 14, marginTop: 4 },
  id: { color: colors.gold, fontFamily: fonts.semibold, fontSize: 13, marginTop: 4 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 8, marginTop: 18 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 10 },
  icon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#E8F0FF', alignItems: 'center', justifyContent: 'center' },
  label: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12 },
  value: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 15, marginTop: 1 },
  stats: { width: '100%', flexDirection: 'row', gap: 10, marginTop: 12 },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, alignItems: 'center', paddingVertical: 14, gap: 4 },
  statValue: { color: '#fff', fontFamily: fonts.extra, fontSize: 18 },
  statLabel: { color: colors.soft, fontFamily: fonts.medium, fontSize: 11 },
});
