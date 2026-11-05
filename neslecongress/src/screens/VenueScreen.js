import React, { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, DarkHeader } from '../components/ui';
import { useCongress } from '../context/CongressContext';
import { colors, fonts } from '../theme';

const VENUE_PIN = { latitude: 25.223346, longitude: 55.286934 };

function metersBetween(from, to) {
  const earth = 6371000;
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLng = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.asin(Math.sqrt(a));
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function GoogleMap({ uri }) {
  if (Platform.OS === 'web') {
    return React.createElement('iframe', {
      title: 'Venue map',
      src: uri,
      style: { border: 0, width: '100%', height: '100%' },
    });
  }

  return (
    <WebView
      source={{ uri }}
      style={styles.web}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      setSupportMultipleWindows={false}
    />
  );
}

function mapUrl(destination, origin) {
  const dest = `${destination.latitude},${destination.longitude}`;
  if (!origin) return `https://maps.google.com/maps?q=${dest}&z=16&output=embed`;
  const start = `${origin.latitude},${origin.longitude}`;
  return `https://maps.google.com/maps?saddr=${start}&daddr=${dest}&output=embed`;
}

export default function VenueScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { venue } = useCongress();
  const facilities = venue?.facilities || [];
  const destination = venue?.latitude && venue?.longitude
    ? { latitude: Number(venue.latitude), longitude: Number(venue.longitude) }
    : VENUE_PIN;
  const [here, setHere] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const [status, setStatus] = useState('locating');

  useEffect(() => {
    let watch;
    let active = true;

    (async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!active) return;
        if (permission.status !== 'granted') {
          setStatus('denied');
          return;
        }
        setStatus('tracking');
        watch = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 8, timeInterval: 3000 },
          (position) => {
            if (active) setHere(position.coords);
          },
        );
      } catch (error) {
        if (active) setStatus('denied');
      }
    })();

    return () => {
      active = false;
      watch?.remove();
    };
  }, []);

  useEffect(() => {
    if (!here) return;
    if (!anchor || metersBetween(anchor, here) > 40) setAnchor(here);
  }, [here, anchor]);

  const distance = here ? formatDistance(metersBetween(here, destination)) : null;
  const directions = here
    ? `https://www.google.com/maps/dir/?api=1&origin=${here.latitude},${here.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`;

  return (
    <Screen>
      <DarkHeader title="Venue" onBack={() => navigation.goBack()} right="navigate" gold onRight={() => Linking.openURL(directions)} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{venue?.name}</Text>
        <Text style={styles.date}>{venue?.date}</Text>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Ionicons name="location" size={16} color={colors.blue} />
            <Text style={styles.cardLabel}>Venue Address</Text>
          </View>
          <Text style={styles.address}>{venue?.address}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Ionicons name={status === 'tracking' ? 'navigate' : 'navigate-outline'} size={16} color={colors.blue} />
            <Text style={styles.cardLabel}>
              {status === 'tracking' ? 'Live location' : status === 'denied' ? 'Location off' : 'Finding you'}
            </Text>
          </View>
          <Text style={styles.track}>
            {distance
              ? `You are ${distance} from the venue. The map follows you as you move.`
              : status === 'denied'
                ? 'Allow location so the map can draw the route from where you are.'
                : 'Waiting for a GPS fix...'}
          </Text>
          <View style={styles.map}>
            <GoogleMap key={anchor ? `${anchor.latitude.toFixed(4)},${anchor.longitude.toFixed(4)}` : 'venue'} uri={mapUrl(destination, anchor)} />
          </View>
          <Pressable style={styles.open} onPress={() => Linking.openURL(directions)}>
            <Ionicons name="map" size={16} color="#fff" />
            <Text style={styles.openText}>Open in Google Maps</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Venue Facilities</Text>
          <View style={styles.facilities}>
            {facilities.map((item) => (
              <View key={item.id} style={styles.facility}>
                <View style={styles.facilityIcon}><Ionicons name={item.icon} size={18} color={colors.blue} /></View>
                <Text style={styles.facilityLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: '#fff', fontFamily: fonts.extra, fontSize: 26, lineHeight: 32 },
  date: { color: colors.soft, fontFamily: fonts.medium, fontSize: 14, marginTop: 8, marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 14, marginBottom: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardLabel: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 12 },
  address: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, marginTop: 8 },
  track: { color: colors.ink, fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, marginTop: 8 },
  map: { marginTop: 12, borderRadius: 16, overflow: 'hidden', height: 280, backgroundColor: '#E7F2FB' },
  web: { flex: 1, backgroundColor: 'transparent' },
  open: { marginTop: 12, height: 44, borderRadius: 14, backgroundColor: colors.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  openText: { color: '#fff', fontFamily: fonts.bold, fontSize: 14 },
  section: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16, marginBottom: 12 },
  facilities: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  facility: { width: '47%', backgroundColor: '#F6F8FB', borderRadius: 14, paddingVertical: 14, alignItems: 'center', gap: 6 },
  facilityIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#E8F0FF', alignItems: 'center', justifyContent: 'center' },
  facilityLabel: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 13 },
});
