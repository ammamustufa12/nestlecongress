import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import { AuthProvider } from './src/context/AuthContext';
import { CongressProvider } from './src/context/CongressContext';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import QuickAccessScreen from './src/screens/QuickAccessScreen';
import AgendaScreen from './src/screens/AgendaScreen';
import SpeakersScreen from './src/screens/SpeakersScreen';
import SpeakerProfileScreen from './src/screens/SpeakerProfileScreen';
import NameTagScreen from './src/screens/NameTagScreen';
import VenueScreen from './src/screens/VenueScreen';
import VotingScreen from './src/screens/VotingScreen';
import AskQAScreen from './src/screens/AskQAScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import ExhibitorsScreen from './src/screens/ExhibitorsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#071433' },
};

export default function App() {
  const [loaded, error] = useFonts({
    ...Ionicons.font,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  if (!loaded && !error) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color="#F5C84B" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CongressProvider>
        <View style={styles.root}>
          <View style={styles.phone}>
            <StatusBar style="light" />
            <NavigationContainer theme={navTheme}>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  contentStyle: { backgroundColor: '#071433' },
                }}
              >
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="QuickAccess" component={QuickAccessScreen} />
                <Stack.Screen name="Agenda" component={AgendaScreen} />
                <Stack.Screen name="Speakers" component={SpeakersScreen} />
                <Stack.Screen name="SpeakerProfile" component={SpeakerProfileScreen} />
                <Stack.Screen name="NameTag" component={NameTagScreen} />
                <Stack.Screen name="Venue" component={VenueScreen} />
                <Stack.Screen name="Voting" component={VotingScreen} />
                <Stack.Screen name="AskQA" component={AskQAScreen} />
                <Stack.Screen name="Resources" component={ResourcesScreen} />
                <Stack.Screen name="Exhibitors" component={ExhibitorsScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </View>
        </CongressProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: '#06102B', alignItems: 'center', justifyContent: 'center' },
  root: {
    flex: 1,
    backgroundColor: '#03060f',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { minHeight: '100vh' } : null),
  },
  phone: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#071433',
    ...(Platform.OS === 'web' ? { minHeight: '100vh' } : null),
  },
});
