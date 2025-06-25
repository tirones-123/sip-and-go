import React, { useEffect } from 'react';
import { View, AppState, AppStateStatus, ActivityIndicator, Image } from 'react-native';
import tw from 'twrnc';
import { useFonts } from 'expo-font';
import { 
  Montserrat_400Regular, 
  Montserrat_600SemiBold, 
  Montserrat_700Bold,
  Montserrat_800ExtraBold
} from '@expo-google-fonts/montserrat';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { LogBox } from 'react-native';
import Constants from 'expo-constants';
import { isPWAInstalled, hideAddressBar, isWeb } from './src/utils/platform';
import { useFullScreen } from './src/hooks/useFullScreen';

// Configure Sentry if enabled
const initSentry = () => {
  try {
    const Sentry = require('@sentry/react-native');
    const dsn = Constants.expoConfig?.extra?.SENTRY_DSN;
    
    if (dsn) {
      Sentry.init({
        dsn,
        debug: __DEV__,
        environment: __DEV__ ? 'development' : 'production',
      });
      console.log('Sentry initialized successfully');
    }
  } catch (error) {
    console.log('Sentry not available or initialization failed:', error);
  }
};

// Initialize Sentry
initSentry();

// Ignore certain warnings
LogBox.ignoreLogs([
  'Constants.platform.ios.model has been deprecated',
  'Require cycle:',
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

/**
 * Main app component
 */
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    'FugazOne-Regular': require('./assets/fonts/FugazOne-Regular.ttf'),
    'LuckiestGuy-Regular': require('./assets/fonts/LuckiestGuy-Regular.ttf'),
  });

  // Use fullscreen hook
  const { enterFullScreen } = useFullScreen();

  useEffect(() => {
    if (!isWeb) return;

    // Hide address bar on load
    hideAddressBar();

    // Try to enter fullscreen on user interaction (required by browsers)
    const handleFirstInteraction = () => {
      enterFullScreen();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    // Add listeners for first user interaction
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    // Handle app state changes for web
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        hideAddressBar();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // PWA-specific optimizations
    if (isPWAInstalled()) {
      // Prevent pull-to-refresh
      document.body.style.overscrollBehavior = 'none';
      
      // Set viewport for full coverage
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no');
      }

      // Add PWA class to body for CSS customizations
      document.body.classList.add('pwa-installed');
    }

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      subscription.remove();
    };
  }, [enterFullScreen]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0B0E1A" />
        <View style={[tw`flex-1 bg-[#0B0E1A] items-center justify-center`]}>
          <Image
            source={require('./assets/logo-jauneclair.png')}
            style={{ width: 120, height: 120, marginBottom: 30 }}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#FF784F" />
        </View>
      </SafeAreaProvider>
    );
  }

  // Show error screen if fonts failed to load
  if (fontError) {
    console.error('Font loading error:', fontError);
    // Continue with default fonts
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0B0E1A" />
      <Navigation />
    </SafeAreaProvider>
  );
} 