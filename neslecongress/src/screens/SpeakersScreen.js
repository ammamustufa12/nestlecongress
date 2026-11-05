import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader, HeroCard, Chip } from '../components/ui';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

const filters = ['All', 'Nutrition', 'Research', 'Pediatrics'];

export default function SpeakersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { speakers, toggleSpeaker } = useCongress();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (speakers || []).filter((item) => {
      const fieldOk = filter === 'All' || item.field === filter || (filter === 'Nutrition' && item.talk.toLowerCase().includes('nutrition'));
      const queryOk = !q || item.name.toLowerCase().includes(q) || item.role.toLowerCase().includes(q) || item.talk.toLowerCase().includes(q);
      const savedOk = !onlySaved || item.starred;
      return fieldOk && queryOk && savedOk;
    });
  }, [filter, query, onlySaved, speakers]);

  return (
    <Screen>
      <DarkHeader title="Speakers" onBack={() => navigation.goBack()} right={onlySaved ? 'star' : 'star-outline'} onRight={() => setOnlySaved((v) => !v)} />
      <HeroCard icon="people" title="Global Medical Experts" subtitle="Meet speakers from nutrition, research and healthcare" />
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color="#98A4B8" />
            <TextInput value={query} onChangeText={setQuery} placeholder="Search speakers" placeholderTextColor="#A3AEC0" style={styles.input} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {filters.map((item) => (
              <Chip key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />
            ))}
          </ScrollView>
          {rows.map((item) => (
            <Pressable key={item.id} style={[styles.card, item.featured && styles.featured]} onPress={() => navigation.navigate('SpeakerProfile', { id: item.id })}>
              <View style={styles.top}>
                <LinearGradient colors={item.colors} style={styles.avatar}>
                  <Text style={styles.initials}>{item.initials}</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  {item.featured ? <Text style={styles.featuredLabel}>FEATURED SPEAKER</Text> : <Text style={styles.roleLabel}>SPEAKER</Text>}
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.role}>{item.role}</Text>
                  <Text style={styles.place}>{item.place}</Text>
                </View>
                <Pressable onPress={() => toggleSpeaker(item.id)} hitSlop={8}>
                  <Ionicons name={item.starred ? 'star' : 'star-outline'} size={18} color={item.starred ? colors.gold : '#C5CEDA'} />
                </Pressable>
              </View>
              <View style={styles.talk}>
                <Text style={styles.talkText}>{item.talk}</Text>
                <Ionicons name="chevron-forward" size={16} color="#C5CEDA" />
              </View>
            </Pressable>
          ))}
          {rows.length === 0 ? <Text style={styles.empty}>No speakers match.</Text> : null}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.sheet, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: 16, overflow: 'hidden' },
  search: { height: 48, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 },
  input: { flex: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: 14, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null) },
  chips: { gap: 8, paddingVertical: 14 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#EEF1F6' },
  featured: { borderColor: '#F3D48A', backgroundColor: '#FFFDF6' },
  top: { flexDirection: 'row', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#fff', fontFamily: fonts.bold, fontSize: 16 },
  featuredLabel: { color: '#C4A15A', fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.5 },
  roleLabel: { color: colors.blue, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.5 },
  name: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16, marginTop: 2 },
  role: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  place: { color: '#A3AEC0', fontFamily: fonts.regular, fontSize: 12 },
  talk: { marginTop: 12, backgroundColor: '#F6F8FB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  talkText: { color: colors.ink, fontFamily: fonts.medium, fontSize: 13, flex: 1 },
  empty: { textAlign: 'center', color: colors.muted, fontFamily: fonts.regular, marginTop: 12 },
});
