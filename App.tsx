import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { useFonts, Montserrat_400Regular, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';
import { Text } from 'react-native';

import Navigation from './src/navigation';
import { useGameStore } from './src/store/useGameStore';
import { initRC } from './src/utils/revenueCat';
import { trackAppOpen } from './src/utils/analytics';

// Initialize Sentry
const SENTRY_DSN = Constants.expoConfig?.extra?.SENTRY_DSN as string;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableAutoSessionTracking: true,
    // Debug only in development
    debug: __DEV__,
  });
}

export default function App() {
  // Load Montserrat fonts
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_800ExtraBold,
    'FugazOne-Regular': require('./assets/fonts/FugazOne-Regular.ttf'),
  });

  // Set default font for all Text components once fonts are loaded
  if (fontsLoaded && !(Text as any)._hasSetDefaultFont) {
    const TextAny = Text as any;
    TextAny._hasSetDefaultFont = true;
    TextAny.defaultProps = {
      ...(TextAny.defaultProps || {}),
      style: [{ fontFamily: 'Montserrat_400Regular' }, (TextAny.defaultProps?.style || {})],
    };
  }

  // Get setPremium function from store
  const setPremium = useGameStore(state => state.setPremium);
  
  // Initialize RevenueCat and track app open
  useEffect(() => {
    // Initialize RevenueCat
    initRC(setPremium).catch(error => {
      console.error('Failed to initialize RevenueCat:', error);
      Sentry.captureException(error);
    });
    
    // Track app open event
    trackAppOpen();
  }, [setPremium]);
  
  if (!fontsLoaded) {
    // You can replace null with a splash screen if desired
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Navigation />
    </SafeAreaProvider>
  );
}; 