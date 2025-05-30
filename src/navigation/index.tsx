import React, { useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from '../utils/i18n';

// Import screens
import AddPlayers from '../screens/AddPlayers';
import ModeCarousel from '../screens/ModeCarousel';
import Question from '../screens/Question';
import Settings from '../screens/Settings';

// Define the root stack parameter list (Paywall screen now handled by Superwall)
export type RootStackParamList = {
  AddPlayers: undefined;
  ModeCarousel: undefined;
  Question: { packId: string; relaunchGame?: boolean };
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

  return (
    <NavigationContainer
      ref={navRef}
    >
      <Stack.Navigator
        initialRouteName="AddPlayers"
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: route.name === 'ModeCarousel' ? '#FFFFFF' : '#0B0E1A',
          },
          headerTintColor: route.name === 'ModeCarousel' ? '#0B0E1A' : '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: route.name === 'ModeCarousel' ? '#0B0E1A' : '#fff',
          },
          contentStyle: {
            backgroundColor: route.name === 'ModeCarousel' ? '#FFFFFF' : '#0B0E1A',
          },
        })}
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