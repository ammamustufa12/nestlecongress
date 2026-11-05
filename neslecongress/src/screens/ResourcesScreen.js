import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader, HeroCard, Chip } from '../components/ui';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

const filters = ['All', 'PDF', 'Slides', 'Videos', 'Saved'];

export default function ResourcesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { resources, toggleResource, error: loadError } = useCongress();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (resources || []).filter((item) => {
      const kindOk = filter === 'All' || filter === 'Saved' || item.kind === filter;
      const savedOk = filter !== 'Saved' || item.saved;
      const queryOk = !q || item.title.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q);
      return kindOk && savedOk && queryOk;
    });
  }, [filter, query, resources]);

  const save = async (item) => {
    if (busyId) return;
    setBusyId(item.id);
    setNotice('');
    try {
      const saved = await toggleResource(item.id);
      setNotice(saved?.saved ? `${item.title} is saved in the database.` : `${item.title} was removed from saved.`);
    } catch (error) {
      setNotice(error.message || 'Could not save this resource.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Screen>
      <DarkHeader title="Resources" onBack={() => navigation.goBack()} right={filter === 'Saved' ? 'bookmark' : 'bookmark-outline'} onRight={() => setFilter((value) => (value === 'Saved' ? 'All' : 'Saved'))} />
      <HeroCard icon="cloud-download-outline" title="Congress Library" subtitle="Access presentations, documents and media files" />
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color="#98A4B8" />
            <TextInput value={query} onChangeText={setQuery} placeholder="Search resources" placeholderTextColor="#A3AEC0" style={styles.input} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {filters.map((item) => (
              <Chip key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />
            ))}
          </ScrollView>
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          {loadError ? <Text style={styles.notice}>{loadError}</Text> : null}
          {rows.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={[styles.fileIcon, { backgroundColor: `${item.tint}22` }]}>
                <Ionicons name={item.icon} size={20} color={item.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.kind}>{item.kind}</Text>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.detail} numberOfLines={1}>{item.detail}</Text>
                <Text style={styles.size}>{item.size}</Text>
              </View>
              <Pressable onPress={() => save(item)} hitSlop={8} disabled={busyId === item.id}>
                <Ionicons name={item.saved ? 'bookmark' : 'bookmark-outline'} size={20} color={item.saved ? colors.blue : '#9AA6B8'} />
              </Pressable>
            </View>
          ))}
          {rows.length === 0 ? <Text style={styles.empty}>No files in this view.</Text> : null}
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
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 10 },
  fileIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  kind: { color: colors.muted, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.4 },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 14, marginTop: 2 },
  detail: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  size: { color: '#A3AEC0', fontFamily: fonts.medium, fontSize: 11, marginTop: 4 },
  notice: { color: colors.blue, fontFamily: fonts.semibold, fontSize: 12, marginBottom: 10 },
  empty: { textAlign: 'center', color: colors.muted, fontFamily: fonts.regular, marginTop: 16 },
});
