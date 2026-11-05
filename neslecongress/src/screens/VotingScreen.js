import React, { useRef, useState } from 'react';
import { PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader } from '../components/ui';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

export default function VotingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { polls, vote } = useCongress();
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [pending, setPending] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const list = polls || [];
  const safeIndex = list.length ? Math.min(index, list.length - 1) : 0;
  const poll = list[safeIndex];
  const selected = poll?.selected_option_id ?? null;
  const choice = poll ? (pending[poll.id] ?? selected) : null;

  const next = () => setIndex((value) => (list.length ? (value + 1) % list.length : 0));
  const prev = () => setIndex((value) => (list.length ? (value - 1 + list.length) % list.length : 0));
  const pan = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 18 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx <= -48) next();
      else if (gesture.dx >= 48) prev();
    },
  })).current;

  const submit = async () => {
    if (!poll || !choice || locked || saving || choice === selected) return;
    setSaving(true);
    setNotice('');
    try {
      await vote(poll.id, choice);
      setPending((current) => {
        const nextPending = { ...current };
        delete nextPending[poll.id];
        return nextPending;
      });
    } catch (error) {
      setNotice(error.message || 'Vote could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  if (!poll) {
    return (
      <Screen>
        <DarkHeader title="Live Voting" onBack={() => navigation.goBack()} right="lock-open-outline" />
      </Screen>
    );
  }

  return (
    <Screen>
      <DarkHeader title="Live Voting" onBack={() => navigation.goBack()} right={locked ? 'lock-closed' : 'lock-open-outline'} onRight={() => setLocked((v) => !v)} />
      <View style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="stats-chart" size={20} color="#1B2A4A" /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>Audience Interaction</Text>
          <Text style={styles.heroSub}>Swipe polls, choose answers, and submit your vote</Text>
        </View>
      </View>
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
          <View style={styles.card} {...pan.panHandlers}>
            <View style={styles.cardTop}>
              <View style={styles.voted}><Text style={styles.votedText}>{selected ? 'VOTED' : 'OPEN'}</Text></View>
              <Text style={styles.tag}>{poll.tag}</Text>
            </View>
            <Text style={styles.question}>{poll.question}</Text>
            <Text style={styles.total}>{poll.total} total votes</Text>
            {poll.options.map((option) => {
              const on = choice === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.option, on && styles.optionOn]}
                  onPress={() => {
                    if (locked || saving) return;
                    setNotice('');
                    setPending((current) => ({ ...current, [poll.id]: option.id }));
                  }}
                >
                  <View style={styles.optionHead}>
                    <View style={[styles.radio, on && styles.radioOn]}>
                      {on ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
                    </View>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.percent}>{option.percent}%</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${option.percent}%` }, on && styles.fillOn]} />
                  </View>
                  <Text style={styles.votes}>{option.votes} votes</Text>
                </Pressable>
              );
            })}
            {locked ? <Text style={styles.lockNote}>This poll is locked. Open the lock to vote.</Text> : null}
            {notice ? <Text style={styles.lockNote}>{notice}</Text> : null}
            <Pressable
              style={[styles.submit, (!choice || locked || choice === selected) && styles.submitOff]}
              onPress={submit}
              disabled={!choice || locked || saving || choice === selected}
            >
              <Text style={styles.submitText}>
                {saving ? 'Saving vote...' : !choice ? 'Select an answer' : choice === selected ? 'Vote submitted' : selected ? 'Update vote' : 'Submit vote'}
              </Text>
            </Pressable>
          </View>
          <View style={styles.dots}>
            {list.map((item, dot) => (
              <View key={item.id} style={[styles.dot, dot === safeIndex && styles.dotOn]} />
            ))}
            <Text style={styles.page}>{safeIndex + 1} of {list.length}</Text>
          </View>
          <View style={styles.nav}>
            <Pressable style={styles.arrow} onPress={prev}><Ionicons name="chevron-back" size={18} color={colors.ink} /></Pressable>
            <Pressable style={styles.next} onPress={next}>
              <LinearGradient colors={['#1A46F0', '#3EC0FF']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.nextFill}>
                <Text style={styles.nextText}>Next Poll</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={styles.arrow} onPress={next}><Ionicons name="chevron-forward" size={18} color={colors.ink} /></Pressable>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: 16, borderRadius: 20, padding: 14, backgroundColor: '#F6C14A', flexDirection: 'row', gap: 12, alignItems: 'center' },
  heroIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.45)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: '#1B2A4A', fontFamily: fonts.bold, fontSize: 16 },
  heroSub: { color: '#3E4E6E', fontFamily: fonts.regular, fontSize: 12, marginTop: 3, lineHeight: 16 },
  sheet: { flex: 1, backgroundColor: colors.sheet, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: 16, overflow: 'hidden' },
  card: { backgroundColor: '#fff', borderRadius: 22, padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  voted: { backgroundColor: '#EEF4FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  votedText: { color: colors.blue, fontFamily: fonts.bold, fontSize: 10 },
  tag: { color: colors.muted, fontFamily: fonts.medium, fontSize: 12 },
  question: { color: colors.ink, fontFamily: fonts.extra, fontSize: 22, lineHeight: 28, marginTop: 12 },
  total: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 6, marginBottom: 8 },
  option: { borderRadius: 14, padding: 10, marginTop: 8 },
  optionOn: { backgroundColor: '#F3F7FF' },
  optionHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#D5DDEA', alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.blue, borderColor: colors.blue },
  optionLabel: { flex: 1, color: colors.ink, fontFamily: fonts.semibold, fontSize: 14 },
  percent: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  track: { height: 6, borderRadius: 3, backgroundColor: '#EEF1F6', marginTop: 8, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: '#D5DDEA' },
  fillOn: { backgroundColor: colors.blue },
  votes: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11, marginTop: 4 },
  lockNote: { color: '#E25555', fontFamily: fonts.medium, fontSize: 12, marginTop: 8 },
  submit: { marginTop: 14, height: 46, borderRadius: 14, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  submitOff: { backgroundColor: '#D5DDEA' },
  submitText: { color: '#fff', fontFamily: fonts.bold, fontSize: 15 },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D5DDEA' },
  dotOn: { width: 18, backgroundColor: colors.blue },
  page: { marginLeft: 6, color: colors.muted, fontFamily: fonts.semibold, fontSize: 12 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  arrow: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  next: { flex: 1 },
  nextFill: { height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nextText: { color: '#fff', fontFamily: fonts.bold, fontSize: 15 },
});
