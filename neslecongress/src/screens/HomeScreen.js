import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../components/ui';
import { TabBar } from '../components/TabBar';
import { toolRoutes } from '../data';
import { useAuth } from '../context/AuthContext';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { tools, sessions, event, notification, ready, error } = useCongress();
  const [query, setQuery] = useState('');
  const [alerts, setAlerts] = useState(false);
  const agenda = sessions || [];
  const q = query.trim().toLowerCase();
  const matchedTools = tools.filter((item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  const matchedSessions = agenda.filter((item) => item.title.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q));

  const openTool = (id) => navigation.navigate(toolRoutes[id]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <Text style={styles.brand}>NESTLÉ MEDICAL CONGRESS</Text>
          <Pressable style={styles.bell} onPress={() => setAlerts((v) => !v)}>
            <Ionicons name="notifications-outline" size={18} color="#fff" />
            <View style={styles.dot} />
          </Pressable>
        </View>
        {alerts ? (
          <View style={styles.alert}>
            <Text style={styles.alertTitle}>{notification?.title || 'Notifications'}</Text>
            <Text style={styles.alertBody}>{notification?.body || 'No new alerts.'}</Text>
          </View>
        ) : null}

        <Text style={styles.hello}>Welcome Back,{'\n'}{user?.name || 'Dr. Testing'} 👋</Text>
        {error ? <Text style={styles.empty}>{error}</Text> : null}
        {!ready ? <Text style={styles.empty}>Loading congress details...</Text> : null}

        <View style={styles.search}>
          <Ionicons name="search" size={18} color="#9AABC4" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search sessions, speakers, topics..."
            placeholderTextColor="#8E9BB3"
            style={styles.searchInput}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#8E9BB3" />
            </Pressable>
          ) : null}
          <Pressable onPress={() => navigation.navigate('QuickAccess')}>
            <LinearGradient colors={['#2F7BFF', '#49B4FF']} style={styles.filterBtn}>
              <Ionicons name="options-outline" size={16} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>

        {q ? (
          <View style={styles.results}>
            <Text style={styles.section}>Results</Text>
            {matchedTools.map((item) => (
              <Pressable key={item.id} style={styles.result} onPress={() => openTool(item.id)}>
                <Ionicons name={item.icon} size={18} color="#8EBEFF" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultMeta}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#8E9BB3" />
              </Pressable>
            ))}
            {matchedSessions.map((item) => (
              <Pressable key={item.id} style={styles.result} onPress={() => navigation.navigate('Agenda', { all: false })}>
                <Ionicons name="time-outline" size={18} color={colors.gold} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultMeta}>{item.time} {item.period} · {item.meta}</Text>
                </View>
              </Pressable>
            ))}
            {matchedTools.length === 0 && matchedSessions.length === 0 ? (
              <Text style={styles.empty}>No matches for “{query.trim()}”</Text>
            ) : null}
          </View>
        ) : (
          <>
            <Pressable onPress={() => navigation.navigate('Agenda', { all: false })}>
              <View style={styles.feature}>
                <View style={{ flex: 1 }}>
                  <View style={styles.kicker}><Text style={styles.kickerText}>{event?.kicker || 'FEATURED EVENT'}</Text></View>
                  <Text style={styles.featureTitle}>{event?.title}</Text>
                  <Text style={styles.featureMeta}>{event?.meta}</Text>
                </View>
                <View style={styles.leaf}>
                  <Ionicons name="leaf" size={26} color="#F4FFFC" />
                </View>
              </View>
            </Pressable>

            <View style={styles.row}>
              <Text style={styles.section}>Quick Access</Text>
              <Pressable onPress={() => navigation.navigate('QuickAccess')}>
                <Text style={styles.link}>View All ›</Text>
              </Pressable>
            </View>
            <View style={styles.grid}>
              {tools.map((item) => (
                <Pressable key={item.id} style={styles.tile} onPress={() => openTool(item.id)}>
                  <View style={styles.tileIcon}>
                    <Ionicons name={item.icon} size={20} color="#8EBEFF" />
                  </View>
                  <Text style={styles.tileLabel} numberOfLines={1}>{item.title}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.row}>
              <Text style={styles.section}>Upcoming Sessions</Text>
              <Pressable onPress={() => navigation.navigate('Agenda', { all: true })}>
                <Text style={styles.link}>View All ›</Text>
              </Pressable>
            </View>
            {agenda.slice(0, 2).map((item) => (
              <Pressable key={item.id} style={styles.session} onPress={() => navigation.navigate('Agenda', { all: false })}>
                <Text style={styles.sessionTime}>{item.time}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionTitle}>{item.title}</Text>
                  <Text style={styles.sessionMeta}>{item.meta}</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
      <TabBar navigation={navigation} active="home" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingBottom: 110 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  brand: { color: 'rgba(255,255,255,0.86)', fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1 },
  bell: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 7, right: 8, width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF4B4B' },
  alert: { marginTop: 10, backgroundColor: 'rgba(18,42,96,0.9)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  alertTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 14 },
  alertBody: { color: colors.soft, fontFamily: fonts.regular, fontSize: 13, marginTop: 4 },
  hello: { color: '#fff', fontFamily: fonts.extra, fontSize: 28, lineHeight: 34, marginTop: 16 },
  search: { marginTop: 16, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 8, gap: 8 },
  searchInput: { flex: 1, color: '#fff', fontFamily: fonts.regular, fontSize: 14, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null) },
  filterBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  feature: { marginTop: 16, borderRadius: 22, padding: 16, backgroundColor: 'rgba(22, 52, 120, 0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center', gap: 8 },
  kicker: { alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.gold, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  kickerText: { color: colors.gold, fontFamily: fonts.semibold, fontSize: 10, letterSpacing: 0.8 },
  featureTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, marginTop: 10 },
  featureMeta: { color: '#A9B8D0', fontFamily: fonts.regular, fontSize: 13, marginTop: 8 },
  leaf: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(120,255,220,0.12)' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 },
  section: { color: '#fff', fontFamily: fonts.bold, fontSize: 18 },
  link: { color: '#8EBEFF', fontFamily: fonts.semibold, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  tile: { width: '25%', alignItems: 'center', marginBottom: 12 },
  tileIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  tileLabel: { color: '#E8EEF8', fontFamily: fonts.medium, fontSize: 11 },
  session: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 12, marginBottom: 8 },
  sessionTime: { color: colors.gold, fontFamily: fonts.bold, fontSize: 13, width: 48 },
  sessionTitle: { color: '#fff', fontFamily: fonts.semibold, fontSize: 14 },
  sessionMeta: { color: colors.soft, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  results: { marginTop: 18, gap: 8 },
  result: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 12 },
  resultTitle: { color: '#fff', fontFamily: fonts.semibold, fontSize: 14 },
  resultMeta: { color: colors.soft, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  empty: { color: colors.soft, fontFamily: fonts.regular, fontSize: 14, marginTop: 8 },
});
