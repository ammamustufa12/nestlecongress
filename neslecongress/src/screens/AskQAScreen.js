import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader, HeroCard, GradientButton, Chip } from '../components/ui';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

const topics = ['General', 'Nutrition', 'Research', 'GI'];
const buckets = ['Popular', 'Recent', 'Answered'];

export default function AskQAScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('General');
  const [bucket, setBucket] = useState('Recent');
  const [replyTo, setReplyTo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState('');
  const { questions, addQuestion, upvoteQuestion } = useCongress();
  const [error, setError] = useState('');

  const visible = (questions || []).filter((item) => {
    if (bucket === 'Answered') return item.status === 'Answered';
    if (bucket === 'Popular') return item.bucket === 'Popular' || item.votes >= 18;
    return item.bucket === 'Recent' || item.mine || item.status === 'Open';
  }).sort((a, b) => (bucket === 'Popular' ? b.votes - a.votes : b.id - a.id));

  const submit = async () => {
    if (busy) return;
    if (!text.trim()) {
      setError('Type a question before submitting.');
      setSent('');
      return;
    }
    try {
      setBusy(true);
      setError('');
      const body = replyTo ? `@${replyTo} ${text.trim()}` : text.trim();
      await addQuestion({ text: body, topic });
      setText('');
      setReplyTo(null);
      setSent('Your question is live in Recent.');
      setBucket('Recent');
    } catch (err) {
      setSent('');
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const upvote = async (item) => {
    if (item.upvoted) return;
    try {
      setError('');
      await upvoteQuestion(item.id);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Screen>
      <DarkHeader title="Ask Q&A" onBack={() => navigation.goBack()} right="chatbubble-ellipses" gold />
      <HeroCard icon="chatbubble-ellipses" title="Ask the Experts" subtitle="Submit your questions and vote for top discussions" />
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>{replyTo ? `Reply to ${replyTo}` : 'Write your question'}</Text>
          {replyTo ? (
            <Pressable onPress={() => setReplyTo(null)} style={styles.replying}>
              <Text style={styles.replyingText}>Replying to {replyTo}</Text>
              <Ionicons name="close" size={14} color={colors.blue} />
            </Pressable>
          ) : null}
          <TextInput
            value={text}
            onChangeText={(value) => { setText(value); setError(''); }}
            placeholder="Type your question for the speaker..."
            placeholderTextColor="#A3AEC0"
            multiline
            style={styles.box}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {topics.map((item) => (
              <Chip key={item} label={item} active={topic === item} onPress={() => setTopic(item)} />
            ))}
          </ScrollView>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {sent ? <Text style={styles.sent}>{sent}</Text> : null}
          <GradientButton label={busy ? 'Sending...' : 'Submit Question'} leading="paper-plane" onPress={submit} />
          <View style={styles.tabs}>
            {buckets.map((item) => (
              <Pressable key={item} onPress={() => setBucket(item)} style={[styles.tab, bucket === item && styles.tabOn]}>
                <Text style={[styles.tabText, bucket === item && styles.tabTextOn]}>{item}</Text>
              </Pressable>
            ))}
          </View>
          {visible.map((item) => {
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Pressable style={[styles.count, item.upvoted && styles.countOn]} onPress={() => upvote(item)}>
                    <Ionicons name="chevron-up" size={14} color={item.upvoted ? '#fff' : colors.blue} />
                    <Text style={[styles.countText, item.upvoted && styles.countTextOn]}>{item.votes}</Text>
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <View style={styles.tags}>
                      <Text style={styles.topic}>{item.topic}</Text>
                      <Text style={[styles.status, item.status === 'Answered' ? styles.answered : styles.open]}>{item.status}</Text>
                    </View>
                    <Text style={styles.question}>{item.text}</Text>
                    <Text style={styles.author}>
                      {item.mine ? 'You' : item.author}
                      {'  ·  '}
                      <Text style={styles.reply} onPress={() => { setReplyTo(item.mine ? 'You' : item.author); setTopic(item.topic); setSent(''); }}>Reply</Text>
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
          {visible.length === 0 ? <Text style={styles.empty}>Nothing in {bucket} yet.</Text> : null}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: 16, overflow: 'hidden' },
  label: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16 },
  box: { marginTop: 10, minHeight: 72, borderRadius: 16, backgroundColor: colors.field, padding: 12, color: colors.ink, fontFamily: fonts.regular, fontSize: 14, textAlignVertical: 'top', ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null) },
  chips: { gap: 8, paddingVertical: 12 },
  error: { color: '#E25555', fontFamily: fonts.medium, fontSize: 12, marginBottom: 8 },
  sent: { color: '#1E9D62', fontFamily: fonts.semibold, fontSize: 12, marginBottom: 8 },
  replying: { marginTop: 8, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F0FF', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  replyingText: { color: colors.blue, fontFamily: fonts.semibold, fontSize: 12 },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: colors.field },
  tabOn: { backgroundColor: colors.gold },
  tabText: { color: '#66758C', fontFamily: fonts.semibold, fontSize: 13 },
  tabTextOn: { color: '#1B2A4A' },
  card: { borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 12, marginBottom: 10 },
  cardTop: { flexDirection: 'row', gap: 10 },
  count: { width: 42, alignItems: 'center', backgroundColor: '#F4F7FF', borderRadius: 12, paddingVertical: 6 },
  countOn: { backgroundColor: colors.blue },
  countText: { color: colors.blue, fontFamily: fonts.bold, fontSize: 13 },
  countTextOn: { color: '#fff' },
  tags: { flexDirection: 'row', gap: 6 },
  topic: { color: colors.blue, fontFamily: fonts.semibold, fontSize: 11, backgroundColor: '#E8F0FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  status: { fontFamily: fonts.semibold, fontSize: 11, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  answered: { color: '#1E9D62', backgroundColor: '#E7F8EF' },
  open: { color: '#B8923A', backgroundColor: '#F8F1DE' },
  question: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, marginTop: 8 },
  author: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 8 },
  reply: { color: colors.blue, fontFamily: fonts.semibold },
  empty: { color: colors.muted, textAlign: 'center', fontFamily: fonts.regular, marginTop: 8 },
});
