import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader } from '../components/ui';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

export default function SpeakerProfileScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { speakers, sessions, toggleSpeaker } = useCongress();
  const speaker = (speakers || []).find((item) => item.id === route.params?.id);
  const talks = (sessions || []).filter((item) => speaker && (item.title === speaker.talk || item.meta === speaker.name));

  if (!speaker) {
    return (
      <Screen>
        <DarkHeader title="Speaker Profile" onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>This speaker profile is not available.</Text>
      </Screen>
    );
  }

  const facts = [
    { icon: 'briefcase-outline', label: 'Role', value: speaker.role },
    { icon: 'location-outline', label: 'Based in', value: speaker.place },
    { icon: 'medkit-outline', label: 'Field', value: speaker.field },
  ];

  return (
    <Screen>
      <DarkHeader
        title="Speaker Profile"
        onBack={() => navigation.goBack()}
        right={speaker.starred ? 'star' : 'star-outline'}
        gold={speaker.starred}
        onRight={() => toggleSpeaker(speaker.id)}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <LinearGradient colors={speaker.colors || ['#5B8DEF', '#7EB6FF']} style={styles.avatar}>
            <Text style={styles.initials}>{speaker.initials}</Text>
          </LinearGradient>
          <Text style={styles.kicker}>{speaker.featured ? 'FEATURED SPEAKER' : 'SPEAKER'}</Text>
          <Text style={styles.name}>{speaker.name}</Text>
          <Text style={styles.role}>{speaker.role}</Text>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.section}>About</Text>
          <Text style={styles.bio}>{speaker.bio || `${speaker.name} is speaking on ${speaker.talk}.`}</Text>

          {facts.map((fact) => (
            <View key={fact.label} style={styles.fact}>
              <View style={styles.factIcon}><Ionicons name={fact.icon} size={16} color={colors.blue} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.factLabel}>{fact.label}</Text>
                <Text style={styles.factValue}>{fact.value}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.section, { marginTop: 8 }]}>Session</Text>
          {(talks.length ? talks : [{ id: 'talk', time: '', period: '', title: speaker.talk, meta: speaker.field }]).map((item) => (
            <Pressable key={item.id} style={styles.session} onPress={() => navigation.navigate('Agenda', { all: false })}>
              <View style={{ flex: 1 }}>
                {item.time ? <Text style={styles.sessionTime}>{item.time} {item.period}</Text> : null}
                <Text style={styles.sessionTitle}>{item.title}</Text>
                <Text style={styles.sessionMeta}>{item.meta}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#C5CEDA" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { color: '#fff', textAlign: 'center', marginTop: 40, fontFamily: fonts.regular },
  hero: { alignItems: 'center', paddingTop: 8, paddingBottom: 18 },
  avatar: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#fff', fontFamily: fonts.extra, fontSize: 32 },
  kicker: { color: colors.gold, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.8, marginTop: 14 },
  name: { color: '#fff', fontFamily: fonts.extra, fontSize: 26, marginTop: 4, textAlign: 'center' },
  role: { color: colors.soft, fontFamily: fonts.regular, fontSize: 14, marginTop: 4, textAlign: 'center' },
  sheet: { backgroundColor: '#fff', borderRadius: 24, padding: 16 },
  section: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16, marginBottom: 8 },
  bio: { color: '#5C6B82', fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, marginBottom: 14 },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F0F3F8' },
  factIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#EAF1FF', alignItems: 'center', justifyContent: 'center' },
  factLabel: { color: colors.muted, fontFamily: fonts.medium, fontSize: 11 },
  factValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 14, marginTop: 1 },
  session: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F6F8FB', borderRadius: 14, padding: 12, marginBottom: 8 },
  sessionTime: { color: colors.blue, fontFamily: fonts.semibold, fontSize: 12 },
  sessionTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 14, marginTop: 2 },
  sessionMeta: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
});
