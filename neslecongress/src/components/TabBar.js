import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts } from '../theme';

export function TabBar({ navigation, active }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Tab
        icon="home"
        label="Home"
        active={active === 'home'}
        onPress={() => navigation.navigate('Home')}
      />
      <Tab
        icon="person"
        label="Profile"
        active={active === 'profile'}
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function Tab({ icon, label, active, onPress }) {
  const inner = (
    <View style={styles.inner}>
      <Ionicons name={active ? icon : `${icon}-outline`} size={18} color={active ? '#fff' : '#A9B7D0'} />
      <Text style={[styles.label, active && styles.labelOn]}>{label}</Text>
    </View>
  );
  return (
    <Pressable onPress={onPress}>
      {active ? (
        <LinearGradient colors={['#1A46F0', '#3AA0FF']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.on}>
          {inner}
        </LinearGradient>
      ) : (
        <View style={styles.off}>{inner}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#071433',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  on: { borderRadius: 18, paddingHorizontal: 26, paddingVertical: 8 },
  off: { borderRadius: 18, paddingHorizontal: 26, paddingVertical: 8 },
  inner: { alignItems: 'center', gap: 2 },
  label: { color: '#A9B7D0', fontFamily: fonts.medium, fontSize: 11 },
  labelOn: { color: '#fff', fontFamily: fonts.semibold },
});
