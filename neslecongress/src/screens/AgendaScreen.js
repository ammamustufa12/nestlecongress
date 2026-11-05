import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader, Chip } from '../components/ui';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

const filters = ['All', 'Keynote', 'Nutrition', 'Research'];
const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function congressDate(day) {
  const match = String(day?.sub || '').match(/([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
  if (!match) return null;
  const month = MONTHS.indexOf(match[1]);
  if (month < 0) return null;
  return new Date(Number(match[3]), month, Number(match[2]));
}

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function monthCells(cursor) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const start = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const cells = Array(start).fill(null);
  for (let day = 1; day <= count; day += 1) cells.push(new Date(year, month, day));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export default function AgendaScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { days, sessions, toggleSession, ready, error } = useCongress();
  const [day, setDay] = useState(route.params?.all ? 'all' : 'd1');
  const [filter, setFilter] = useState('All');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [cursor, setCursor] = useState(() => new Date(2026, 4, 1));
  const [picked, setPicked] = useState(null);
  const placed = useRef(false);
  const schedule = days || [];
  const current = schedule.find((item) => item.id === day) || null;

  useEffect(() => {
    if (route.params?.all) {
      setDay('all');
      setPicked(null);
      return;
    }
    if (route.params?.all === false) {
      setDay((current) => (current === 'all' ? 'd1' : current));
    }
  }, [route.params?.all]);

  useEffect(() => {
    if (placed.current || !schedule.length) return;
    const first = congressDate(schedule[0]);
    if (!first) return;
    setCursor(new Date(first.getFullYear(), first.getMonth(), 1));
    if (!route.params?.all) {
      setDay(schedule[0].id);
      setPicked(first);
    }
    placed.current = true;
  }, [schedule]);

  const byDate = useMemo(() => {
    const map = {};
    schedule.forEach((item) => {
      const date = congressDate(item);
      if (date) map[dateKey(date)] = item;
    });
    return map;
  }, [schedule]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (sessions || []).filter((item) => {
      const sameDay = day === 'all' || item.day === day;
      const sameTag = filter === 'All' || item.tag === filter;
      const sameQuery = !q || item.title.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q);
      return sameDay && sameTag && sameQuery;
    });
  }, [day, filter, query, sessions]);

  const reset = () => {
    setFilter('All');
    setQuery('');
  };

  const chooseDate = (date) => {
    setPicked(date);
    const match = byDate[dateKey(date)];
    setDay(match ? match.id : '');
  };

  const shiftMonth = (step) => {
    setCursor((value) => new Date(value.getFullYear(), value.getMonth() + step, 1));
  };

  const cells = monthCells(cursor);
  const pickedKey = picked ? dateKey(picked) : '';
  const pickedLabel = picked
    ? picked.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <Screen>
      <DarkHeader title="Congress Agenda" onBack={() => navigation.goBack()} right="search" onRight={() => setSearching((value) => !value)} />
      {searching ? (
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color="#9AABC4" />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search sessions" placeholderTextColor="#8E9BB3" style={styles.search} autoFocus />
        </View>
      ) : null}
      <Pressable style={styles.hero} onPress={() => setCalendarOpen((open) => !open)}>
        <LinearGradient colors={['#F6C14A', '#F0A93A']} style={styles.heroIcon}>
          <Ionicons name="calendar" size={20} color="#1B2A4A" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>{day === 'all' ? 'Full Congress Schedule' : current?.heading || (picked ? 'No sessions' : 'Schedule')}</Text>
          <Text style={styles.heroSub}>{day === 'all' ? 'Every session on May 22 and May 23' : current?.sub || pickedLabel}</Text>
        </View>
        <Ionicons name={calendarOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#D6E2F5" />
      </Pressable>
      <View style={styles.dayRow}>
        <Pressable onPress={() => { setDay('all'); setPicked(null); }} style={[styles.day, day === 'all' && styles.dayOn]}>
          <Text style={[styles.dayLabel, day === 'all' && styles.dayLabelOn]}>All</Text>
          <Text style={[styles.dayDate, day === 'all' && styles.dayLabelOn]}>Both days</Text>
        </Pressable>
        {(days || []).map((item) => {
          const on = item.id === day;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                const date = congressDate(item);
                if (date) chooseDate(date);
                else setDay(item.id);
              }}
              style={[styles.day, on && styles.dayOn]}
            >
              <Text style={[styles.dayLabel, on && styles.dayLabelOn]}>{item.label}</Text>
              <Text style={[styles.dayDate, on && styles.dayLabelOn]}>{item.date}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
          {calendarOpen ? (
            <View style={styles.calendar}>
              <View style={styles.monthRow}>
                <Pressable onPress={() => shiftMonth(-1)} hitSlop={8} style={styles.monthBtn}>
                  <Ionicons name="chevron-back" size={18} color={colors.ink} />
                </Pressable>
                <Text style={styles.monthTitle}>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</Text>
                <Pressable onPress={() => shiftMonth(1)} hitSlop={8} style={styles.monthBtn}>
                  <Ionicons name="chevron-forward" size={18} color={colors.ink} />
                </Pressable>
              </View>
              <View style={styles.weekRow}>
                {WEEK.map((label, index) => (
                  <Text key={`${label}-${index}`} style={styles.weekLabel}>{label}</Text>
                ))}
              </View>
              <View style={styles.grid}>
                {cells.map((date, index) => {
                  if (!date) return <View key={`empty-${index}`} style={styles.cell} />;
                  const key = dateKey(date);
                  const match = byDate[key];
                  const selected = key === pickedKey;
                  return (
                    <Pressable key={key} style={styles.cell} onPress={() => chooseDate(date)}>
                      <View style={[styles.dayDot, selected && styles.dayDotOn, match && !selected && styles.dayDotEvent]}>
                        <Text style={[styles.dayNum, selected && styles.dayNumOn, match && !selected && styles.dayNumEvent]}>{date.getDate()}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>{day === 'all' ? 'All Sessions' : current ? `${current.label} Sessions` : 'Sessions'}</Text>
            <Pressable style={styles.reset} onPress={reset}>
              <Ionicons name="refresh" size={14} color={colors.blue} />
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {filters.map((item) => (
              <Chip key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />
            ))}
          </ScrollView>
          {rows.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.timeCol}>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={styles.period}>{item.period}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.tag}><Text style={styles.tagText}>{item.tag.toUpperCase()}</Text></View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{day === 'all' ? `${schedule.find((entry) => entry.id === item.day)?.label || ''} · ` : ''}{item.meta}</Text>
              </View>
              <Pressable onPress={() => toggleSession(item.id)} hitSlop={8}>
                <Ionicons name={item.bookmarked ? 'bookmark' : 'bookmark-outline'} size={20} color={item.bookmarked ? colors.blue : '#9AA6B8'} />
              </Pressable>
            </View>
          ))}
          {error ? <Text style={styles.empty}>{error}</Text> : null}
          {!ready ? <Text style={styles.empty}>Loading schedule...</Text> : null}
          {ready && rows.length === 0 ? (
            <Text style={styles.empty}>{picked && !current ? 'No sessions on this date.' : 'No sessions for this filter.'}</Text>
          ) : null}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: { marginHorizontal: 16, marginBottom: 8, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 },
  search: { flex: 1, color: '#fff', fontFamily: fonts.regular, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null) },
  hero: { marginHorizontal: 16, marginTop: 4, borderRadius: 20, padding: 14, backgroundColor: 'rgba(18,42,96,0.72)', flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: '#fff', fontFamily: fonts.bold, fontSize: 16 },
  heroSub: { color: colors.soft, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  dayRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 12 },
  day: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, paddingVertical: 10, alignItems: 'center' },
  dayOn: { backgroundColor: colors.gold },
  dayLabel: { color: '#fff', fontFamily: fonts.bold, fontSize: 14 },
  dayDate: { color: 'rgba(255,255,255,0.8)', fontFamily: fonts.medium, fontSize: 12 },
  dayLabelOn: { color: '#1B2A4A' },
  sheet: { flex: 1, backgroundColor: '#F7F8FC', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: 14, overflow: 'hidden' },
  calendar: { backgroundColor: '#fff', borderRadius: 20, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#EEF1F6' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F6FA' },
  monthTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16 },
  weekRow: { flexDirection: 'row', marginTop: 10 },
  weekLabel: { flex: 1, textAlign: 'center', color: colors.muted, fontFamily: fonts.semibold, fontSize: 11 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', height: 40, alignItems: 'center', justifyContent: 'center' },
  dayDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayDotOn: { backgroundColor: colors.gold },
  dayDotEvent: { backgroundColor: '#EAF1FF' },
  dayNum: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 13 },
  dayNumOn: { color: '#1B2A4A', fontFamily: fonts.bold },
  dayNumEvent: { color: colors.blue },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 18 },
  reset: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EAF1FF', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  resetText: { color: colors.blue, fontFamily: fonts.semibold, fontSize: 12 },
  chips: { gap: 8, paddingVertical: 12 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 10 },
  timeCol: { width: 52 },
  time: { color: colors.ink, fontFamily: fonts.extra, fontSize: 16 },
  period: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 11 },
  tag: { alignSelf: 'flex-start', backgroundColor: '#F8F1DE', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { color: '#B8923A', fontFamily: fonts.bold, fontSize: 9, letterSpacing: 0.4 },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 15, marginTop: 4 },
  meta: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 20, fontFamily: fonts.regular },
});
