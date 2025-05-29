import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Linking, 
  Platform,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { PurchasesPackage } from 'react-native-purchases';

import { useTranslation, getLanguage } from '../utils/i18n';
import { useGameStore } from '../store/useGameStore';
import { RootStackParamList } from '../navigation';
import { getPackages, purchasePackage, restorePurchases } from '../utils/revenueCat';
import Button from '../components/Button';
import { AnalyticsEvent, posthog } from '../utils/analytics';
import { tintColor } from '../utils/colorUtils';
import en from '../strings/en';
import fr from '../strings/fr';

type PaywallScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Paywall'>;
type PaywallScreenRouteProp = RouteProp<RootStackParamList, 'Paywall'>;

// Main background color
const BG_COLOR = '#FBA464';

/**
 * Paywall screen - Premium subscription screen
 */
const Paywall: React.FC = () => {
  const { t, lang } = useTranslation();
  const navigation = useNavigation<PaywallScreenNavigationProp>();
  const route = useRoute<PaywallScreenRouteProp>();
  const { returnTo, packId } = route.params || {};
  
  // State
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  // Premium status from store
  const premium = useGameStore(state => state.premium);
  const setPremium = useGameStore(state => state.setPremium);
  const storePacks = useGameStore(state => state.packs);
  const resetGame = useGameStore(state => state.resetGame);
  
  // Background gradient
  const lighterBg = tintColor(BG_COLOR, 0.15);
  
  // Load packages
  useEffect(() => {
    const loadPackages = async () => {
      const availablePackages = await getPackages();
      setPackages(availablePackages);
      
      // Select the weekly package by default (if available)
      const weeklyPackage = availablePackages.find(p => p.packageType === 'WEEKLY');
      if (weeklyPackage) {
        setSelectedPackage(weeklyPackage);
      } else if (availablePackages.length > 0) {
        setSelectedPackage(availablePackages[0]);
      }
    };
    
    loadPackages();
    
    // Track paywall view
    posthog.capture(AnalyticsEvent.PREMIUM_VIEW);
  }, []);
  
  // Auto-close if premium and not in a 'replay' flow (where paywall should be shown)
  useEffect(() => {
    if (premium && returnTo && returnTo !== 'Question') {
      // If user is premium and paywall was opened from a context like Settings,
      // navigate back to that screen.
      switch (returnTo) {
        case 'AddPlayers':
          navigation.navigate('AddPlayers');
          break;
        case 'ModeCarousel':
          navigation.navigate('ModeCarousel');
          break;
        case 'Settings':
          navigation.navigate('Settings');
          break;
        // 'Question' is excluded by the if condition
        // 'Paywall' itself is an unlikely returnTo target here
        default:
          // Fallback or handle other specific screens if needed
          navigation.goBack(); 
          break;
      }
    }
  }, [premium, returnTo, navigation]);
  
  // Handle purchase
  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    setIsLoading(true);
    
    try {
      const success = await purchasePackage(selectedPackage);
      
      if (success) {
        // Track purchase
        posthog.capture(AnalyticsEvent.PREMIUM_PURCHASE, {
          package: selectedPackage.identifier
        });
        
        // No need to call startPack here, Question screen will handle it via relaunchGame
        handleCloseAfterAction();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle restore
  const handleRestore = async () => {
    setIsRestoring(true);
    
    try {
      const success = await restorePurchases();
      
      if (success) {
        // Track restore
        posthog.capture(AnalyticsEvent.PREMIUM_RESTORE);
        
        // Update premium status
        setPremium(true);
        
        // No need to call startPack here, Question screen will handle it via relaunchGame
        handleCloseAfterAction();
      }
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setIsRestoring(false);
    }
  };
  
  // Handles navigation after a successful purchase or restore
  const handleCloseAfterAction = () => {
    const packInfo = storePacks.find(p => p.id === packId);
    const canPlayPack = premium || packInfo?.access === 'FREE';

    if (returnTo === 'Question' && packId && canPlayPack) {
      navigation.navigate('Question', { packId, relaunchGame: true });
    } else if (returnTo === 'Question') {
      navigation.navigate('ModeCarousel');
    } else if (returnTo) {
      // Navigate to the specified screen
      // This needs to be type-safe based on RootStackParamList
      switch (returnTo) {
        case 'AddPlayers':
          navigation.navigate('AddPlayers');
          break;
        case 'ModeCarousel':
          navigation.navigate('ModeCarousel');
          break;
        case 'Settings':
          navigation.navigate('Settings');
          break;
        // It's unlikely to be 'Question' here without packId/relaunchGame logic handled above
        // or 'Paywall' as a returnTo for itself.
        default:
          // Fallback if returnTo is a screen not explicitly handled or no params are needed
          navigation.goBack(); 
          break;
      }
    } else {
      navigation.goBack();
    }
  };

  // Handler for the "X" close button
  const handleExplicitClosePress = () => {
    if (returnTo === 'Question') {
      // If closing the paywall that was shown for 'Replay',
      // cancel replay, reset game state, and go to ModeCarousel.
      resetGame(); // Reset the game state
      navigation.replace('ModeCarousel');
    } else {
      // Otherwise (e.g. paywall opened from Settings), just go back
      navigation.goBack();
    }
  };
  
  // Get features from strings
  const features = lang === 'fr' ? fr.settings.premium.features : en.settings.premium.features;
  
  return (
    <LinearGradient
      colors={[lighterBg, BG_COLOR]}
      style={tw`flex-1`}
    >
      {/* Close button */}
      <TouchableOpacity
        style={tw`absolute top-14 right-4 z-10 w-10 h-10 items-center justify-center bg-white/20 rounded-full`}
        onPress={handleExplicitClosePress}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
      
      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`px-4 pt-20 pb-8`}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={tw`items-center mb-8`}>
          <Image 
            source={require('../../assets/logo-jauneclair.png')} 
            style={{ width: 140, height: 140, resizeMode: 'contain' }}
          />
        </View>
        
        {/* Premium card */}
        <View style={[tw`bg-white rounded-3xl p-6 mb-6 relative overflow-hidden`, styles.premiumCard]}>
          {/* Premium badge */}
          <View style={tw`absolute top-0 right-0 bg-yellow-400 px-4 py-2 rounded-bl-2xl`}>
            <Text style={tw`text-black text-sm font-bold`}>PREMIUM</Text>
          </View>
          
          {/* Title with stars */}
          <View style={tw`flex-row items-center justify-center mb-6 mt-2`}>
            <Ionicons name="star" size={32} color="#FFD700" />
            <Text style={[
              tw`text-[${BG_COLOR}] text-3xl font-bold mx-3 text-center`,
              { fontFamily: 'Montserrat_800ExtraBold' }
            ]}>
              {t('paywall.title')}
            </Text>
            <Ionicons name="star" size={32} color="#FFD700" />
          </View>
          
          {/* Features list */}
          <View style={tw`mb-6`}>
            {features.map((feature, index) => (
              <View key={index} style={tw`flex-row items-start mb-3`}>
                <Text style={tw`text-[${BG_COLOR}] text-lg`}>{feature}</Text>
              </View>
            ))}
          </View>
          
          {/* Sparkle effects */}
          <View style={tw`absolute top-6 left-6`}>
            <Text style={tw`text-yellow-400 text-2xl`}>✨</Text>
          </View>
          <View style={tw`absolute bottom-6 right-6`}>
            <Text style={tw`text-yellow-400 text-2xl`}>✨</Text>
          </View>
        </View>
        
        {/* Subscription info */}
        <Text style={tw`text-white text-center text-base mb-2`}>
          {t('paywall.trialInfo')}
        </Text>
        
        {/* Purchase button */}
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={isLoading}
          style={[
            tw`bg-white rounded-2xl py-5 px-8 mb-6`,
            styles.ctaButton
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={BG_COLOR} />
          ) : (
            <Text style={tw`text-[${BG_COLOR}] text-xl font-bold text-center`}>
              {t('paywall.callToAction')}
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Restore purchases */}
        <TouchableOpacity 
          onPress={handleRestore} 
          disabled={isRestoring}
          style={tw`mb-6`}
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={tw`text-white text-center underline text-base`}>
              {t('paywall.restorePurchase')}
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Legal links */}
        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://example.com/terms')}
            style={tw`mx-3`}
          >
            <Text style={tw`text-white/80 text-sm underline`}>{t('paywall.terms')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://example.com/privacy')}
            style={tw`mx-3`}
          >
            <Text style={tw`text-white/80 text-sm underline`}>{t('paywall.privacy')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  premiumCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaButton: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }
});

export default Paywall; 