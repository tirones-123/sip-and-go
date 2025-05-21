import React, { useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from '../utils/i18n';

// Import screens
import AddPlayers from '../screens/AddPlayers';
import ModeCarousel from '../screens/ModeCarousel';
import Question from '../screens/Question';
import Paywall from '../screens/Paywall';
import Settings from '../screens/Settings';

// Define the root stack parameter list
export type RootStackParamList = {
  AddPlayers: undefined;
  ModeCarousel: undefined;
  Question: { packId: string };
  Paywall: { returnTo?: keyof RootStackParamList; packId?: string };
  Settings: undefined;
};

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main navigation container for the app
 */
const Navigation: React.FC = () => {
  const { t } = useTranslation();
  
  const navRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  const handleReady = () => {
    // Cast to any to bypass generic constraint for initial navigation
    (navRef.current as any)?.navigate('Paywall');
  };

  return (
    <NavigationContainer
      ref={navRef}
      onReady={handleReady}
    >
      <Stack.Navigator
        initialRouteName="AddPlayers"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0B0E1A',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0B0E1A',
          },
        }}
      >
        <Stack.Screen
          name="AddPlayers"
          component={AddPlayers}
          options={{
            title: t('addPlayers.title'),
          }}
        />
        
        <Stack.Screen
          name="ModeCarousel"
          component={ModeCarousel}
          options={{
            title: t('modeCarousel.title'),
          }}
        />
        
        <Stack.Screen
          name="Question"
          component={Question}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        
        <Stack.Screen
          name="Paywall"
          component={Paywall}
          options={{
            presentation: 'modal',
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            presentation: 'modal',
            title: t('settings.title'),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation; 