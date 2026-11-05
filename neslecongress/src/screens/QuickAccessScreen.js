import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader, HeroCard, Chip } from '../components/ui';
import { toolRoutes } from '../data';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

const filters = ['All', 'Event', 'Interactive', 'Tools'];
const chipTone = { Event: { bg: '#F8F1DE', fg: '#B8923A' }, Interactive: { bg: '#E8F0FF', fg: '#2F6FE4' }, Tools: { bg: '#E7F8EF', fg: '#1E9D62' } };

export default function QuickAccessScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { tools, ready, error } = useCongress();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [grid, setGrid] = useState(true);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((item) => {
      const inFilter = filter === 'All' || item.category === filter;
      const inQuery = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      return inFilter && inQuery;
    });
  }, [filter, query, tools]);

  const open = (id) => {
    const route = toolRoutes[id];
    if (route) navigation.navigate(route);
  };

  return (
    <Screen>
      <DarkHeader title="Quick Access" onBack={() => navigation.goBack()} right={grid ? 'grid' : 'list'} gold onRight={() => setGrid((v) => !v)} />
      <HeroCard icon="sparkles" title={'Explore Congress\nTools'} subtitle="Everything you need for the full event experience" />
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.search}>
            <Ionicons name="search" size={18} color="#98A4B8" />
            <TextInput value={query} onChangeText={setQuery} placeholder="Search quick access" placeholderTextColor="#A3AEC0" style={styles.input} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {filters.map((item) => (
              <Chip key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />
            ))}
          </ScrollView>
          <View style={grid ? styles.grid : styles.list}>
            {visible.map((item) => {
              const tone = chipTone[item.category] || { bg: '#F4F6FB', fg: '#5C6B82' };
              return (
                <Pressable key={item.id} style={[styles.card, !grid && styles.cardRow]} onPress={() => open(item.id)}>
                  <LinearGradient colors={['#3B82F6', '#60A5FA']} style={styles.icon}>
                    <Ionicons name={item.icon} size={20} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.desc}>{item.description}</Text>
                  </View>
                  <View style={[styles.foot, !grid && styles.footRow]}>
                    <View style={[styles.tag, { backgroundColor: tone.bg }]}>
                      <Text style={[styles.tagText, { color: tone.fg }]}>{item.category}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={16} color="#C5CEDA" />
                  </View>
                </Pressable>
              );
            })}
          </View>
          {error ? <Text style={styles.empty}>{error}</Text> : null}
          {!ready && !error ? <Text style={styles.empty}>Loading tools...</Text> : null}
          {ready && visible.length === 0 ? <Text style={styles.empty}>No tools match your search.</Text> : null}
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  list: { gap: 12 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 20, padding: 14, minHeight: 168, borderWidth: 1, borderColor: '#EEF1F6' },
  cardRow: { width: '100%', minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16 },
  desc: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, marginTop: 4 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  footRow: { marginTop: 0, width: 92 },
  tag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontFamily: fonts.semibold, fontSize: 11 },
  empty: { textAlign: 'center', color: colors.muted, fontFamily: fonts.regular, marginTop: 24 },
});
