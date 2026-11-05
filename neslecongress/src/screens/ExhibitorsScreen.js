import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader, HeroCard, Chip } from '../components/ui';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

const filters = ['All', 'Saved'];

export default function ExhibitorsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { exhibitors, toggleExhibitor, error: loadError } = useCongress();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (exhibitors || []).filter((item) => {
      const savedOk = filter !== 'Saved' || item.saved;
      const queryOk = !q || item.name.toLowerCase().includes(q) || item.booth.toLowerCase().includes(q) || item.focus.toLowerCase().includes(q);
      return savedOk && queryOk;
    });
  }, [exhibitors, filter, query]);

  const save = async (item) => {
    if (busyId) return;
    setBusyId(item.id);
    setNotice('');
    try {
      const saved = await toggleExhibitor(item.id);
      setNotice(saved?.saved ? `${item.name} saved.` : `${item.name} removed from saved.`);
    } catch (error) {
      setNotice(error.message || 'Could not save this exhibitor.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Screen>
      <DarkHeader title="Exhibitors" onBack={() => navigation.goBack()} right={filter === 'Saved' ? 'bookmark' : 'bookmark-outline'} onRight={() => setFilter((value) => (value === 'Saved' ? 'All' : 'Saved'))} />
      <HeroCard icon="briefcase" title="Exhibition Floor" subtitle="Companies and institutions at the Dubai congress" />
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color="#98A4B8" />
            <TextInput value={query} onChangeText={setQuery} placeholder="Search exhibitors" placeholderTextColor="#A3AEC0" style={styles.input} />
          </View>
          <View style={styles.chips}>
            {filters.map((item) => (
              <Chip key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />
            ))}
          </View>
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          {loadError ? <Text style={styles.notice}>{loadError}</Text> : null}
          {rows.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.icon}><Ionicons name="business" size={18} color={colors.blue} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.booth} · {item.focus}</Text>
              </View>
              <Pressable onPress={() => save(item)} hitSlop={8} disabled={busyId === item.id}>
                <Ionicons name={item.saved ? 'bookmark' : 'bookmark-outline'} size={20} color={item.saved ? colors.blue : '#9AA6B8'} />
              </Pressable>
            </View>
          ))}
          {rows.length === 0 ? <Text style={styles.empty}>{filter === 'Saved' ? 'No saved exhibitors yet.' : 'No exhibitors match.'}</Text> : null}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.sheet, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: 16, overflow: 'hidden' },
  search: { height: 48, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 },
  input: { flex: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: 14, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null) },
  chips: { flexDirection: 'row', gap: 8, paddingVertical: 14 },
  notice: { color: colors.blue, fontFamily: fonts.semibold, fontSize: 12, marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#E8F0FF', alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.ink, fontFamily: fonts.bold, fontSize: 15 },
  meta: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  empty: { textAlign: 'center', color: colors.muted, fontFamily: fonts.regular, marginTop: 16 },
});
