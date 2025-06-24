import React, { useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Linking, 
  Share,
  Platform,
  Image,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { showPaywall } from '../utils/superwall';
import { restorePurchases as restorePurchasesRC } from '../utils/revenueCat';

import { useTranslation, getLanguage } from '../utils/i18n';
import { useGameStore } from '../store/useGameStore';
import { RootStackParamList } from '../navigation';
import { setLanguage } from '../utils/i18n';
import { posthog, AnalyticsEvent } from '../utils/analytics';
import en from '../strings/en';
import fr from '../strings/fr';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

// Main background color
const BG_COLOR = '#fe8763';

/**
 * Settings screen - App settings and subscription management
 */
const Settings: React.FC = () => {
  const { t, lang } = useTranslation();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  // Premium status from store
  const current = useGameStore.getState().premium;
  const setPremium = useGameStore.getState().setPremium;
  
  // Set header background color and hide the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: BG_COLOR,
      },
      headerTintColor: '#fff',
      headerTitle: t('settings.title'),
    });
  }, [navigation, t]);
  
  // Change language
  const changeLanguage = (newLang: 'en' | 'fr') => {
    if (newLang !== lang) {
      setLanguage(newLang);
      
      // Track language change
      posthog.capture(AnalyticsEvent.LANGUAGE_CHANGE, { language: newLang });
    }
  };
  
  // Open premium purchase
  const openPremium = async () => {
    await showPaywall('pack_click');
  };
  
  // Rate app
  const rateApp = () => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id000000000',
      android: 'https://play.google.com/store/apps/details?id=com.sipandgoapp.first',
      default: 'https://example.com/rate'
    });
    
    Linking.openURL(storeUrl);
  };
  
  // Share app
  const shareApp = async () => {
    try {
      const result = await Share.share({
        message: Platform.select({
          ios: 'Check out SIP&GO!, the ultimate drinking game app! https://apps.apple.com/app/id000000000',
          android: 'Check out SIP&GO!, the ultimate drinking game app! https://play.google.com/store/apps/details?id=com.sipandgoapp.first',
          default: 'Check out SIP&GO!, the ultimate drinking game app!'
        })
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };
  
  // Contact us
  const contactUs = () => {
    Linking.openURL('mailto:support@sipandgo.app?subject=SIP&GO! App Support');
  };
  
  // Toggle premium for development
  const togglePremiumDev = () => {
    const cur = useGameStore.getState().premium;
    setPremium(!cur);
  };

  // Restore purchases
  const restorePurchases = async () => {
    const success = await restorePurchasesRC();
    // Add user feedback here if needed
  };
  
  // Languages available
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    // Can easily add more languages here
  ];
  
  // Go back
  const goBack = () => {
    navigation.goBack();
  };
  
  return (
    <View style={tw`flex-1 bg-[${BG_COLOR}]`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-4 pb-10`}>
        {/* Logo */}
        <View style={tw`items-center justify-center my-6`}>
          <Image
            source={require('../../assets/logo-jauneclair.png')}
            style={{ width: 120, height: 120, resizeMode: 'contain' }}
          />
        </View>
        
        {/* Language selection */}
        <View style={tw`w-full mb-6`}>
          <Text style={tw`text-lg font-bold text-white mb-4`}>
            {t('settings.language.title')}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`pr-4`}
          >
            <View style={tw`flex-row`}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={tw`mr-2`}
                  onPress={() => changeLanguage(language.code as 'en' | 'fr')}
                >
                  <View style={[
                    tw`p-3 rounded-xl border-2 w-24 items-center`,
                    lang === language.code
                      ? tw`border-white bg-white/20`
                      : tw`border-white/30 bg-white/10`,
                  ]}>
                    <Text style={tw`text-3xl mb-1`}>{language.flag}</Text>
                    <Text style={tw`text-xs font-medium text-center text-white`} numberOfLines={1}>
                      {language.name}
                    </Text>
                    {lang === language.code && (
                      <Ionicons name="checkmark-circle" size={16} color="white" style={tw`absolute top-1 right-1`} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Premium section - only show on native platforms */}
        {Platform.OS !== 'web' && (
          <View style={tw`w-full mb-6`}>
            <Text style={tw`text-lg font-bold text-white mb-4`}>
              {t('settings.premium.title')}
            </Text>
            
            {/* Premium button - more attractive */}
            <TouchableOpacity
              style={[
                tw`bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-4 rounded-2xl shadow-lg mb-4`,
                styles.premiumGlow
              ]}
              onPress={openPremium}
            >
              {/* Premium badge */}
              <View style={tw`bg-yellow-300 px-3 py-1 rounded-full self-start mb-2`}>
                <Text style={tw`text-black text-xs font-bold`}>PREMIUM</Text>
              </View>
              
              <Text style={tw`text-black text-xl font-bold mb-2`}>
                {t('settings.premium.title')}
              </Text>
              
              <Text style={tw`text-black text-sm mb-3`}>
                {t('settings.premium.description')}
              </Text>
              
              {/* Features list */}
              {(lang === 'fr' ? fr.settings.premium.features : en.settings.premium.features).map((feature: string, index: number) => (
                <View key={index} style={tw`flex-row items-center mb-1`}>
                  <Text style={tw`text-black text-lg mr-2`}>✓</Text>
                  <Text style={tw`text-black text-sm flex-1`}>{feature}</Text>
                </View>
              ))}
              
              <View style={tw`bg-black/20 px-4 py-2 rounded-xl mt-2`}>
                <Text style={tw`text-black text-center font-bold`}>
                  {t('settings.premium.upgradeButton')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Web platform message */}
        {Platform.OS === 'web' && (
          <View style={tw`w-full mb-6 bg-green-600 p-4 rounded-2xl`}>
            <Text style={tw`text-white text-lg font-bold mb-2 text-center`}>
              🎉 Version Web Gratuite !
            </Text>
            <Text style={tw`text-white text-sm text-center`}>
              Tous les packs sont gratuits sur la version web. Pour soutenir le développement, téléchargez l'app mobile !
            </Text>
          </View>
        )}

        {/* Restore purchases - only on native */}
        {Platform.OS !== 'web' && (
          <TouchableOpacity
            style={tw`w-full bg-blue-600 px-6 py-3 rounded-2xl mb-4`}
            onPress={restorePurchases}
          >
            <Text style={tw`text-white font-bold text-center`}>
              {t('settings.restorePurchases')}
            </Text>
          </TouchableOpacity>
        )}
        
        {/* Support section */}
        <View style={[tw`bg-white/90 rounded-2xl mb-6 overflow-hidden`, styles.shadow]}>
          <View style={tw`bg-white/20 p-4 border-b border-white/10`}>
            <Text style={[tw`font-bold text-lg`, { color: BG_COLOR }]}>
              {t('settings.support.title')}
            </Text>
          </View>
          
          <View>
            <SupportItem 
              icon="star" 
              title={t('settings.support.rateApp')} 
              onPress={rateApp} 
            />
            
            <SupportItem 
              icon="share-social" 
              title={t('settings.support.shareApp')} 
              onPress={shareApp} 
            />
            
            <SupportItem 
              icon="mail" 
              title={t('settings.support.contactUs')} 
              onPress={contactUs} 
              isLast 
            />
          </View>
        </View>
        
        {/* Development section - Only visible during development */}
        {__DEV__ && (
          <View style={[tw`bg-red-100 rounded-2xl mb-6 overflow-hidden border-2 border-red-300`, styles.shadow]}>
            <View style={tw`bg-red-200 p-4 border-b border-red-300`}>
              <Text style={tw`text-red-800 font-bold text-lg`}>
                🚧 Development Tools
              </Text>
            </View>
            
            <View style={tw`p-4`}>
              <TouchableOpacity 
                style={[
                  tw`flex-row items-center justify-between p-4 rounded-xl`,
                  { backgroundColor: current ? '#10B981' : '#EF4444' }
                ]}
                onPress={togglePremiumDev}
              >
                <View style={tw`flex-row items-center`}>
                  <Ionicons 
                    name={current ? "star" : "star-outline"} 
                    size={24} 
                    color="white" 
                    style={tw`mr-3`} 
                  />
                  <View>
                    <Text style={tw`text-white font-bold text-base`}>
                      Premium Status
                    </Text>
                    <Text style={tw`text-white/80 text-sm`}>
                      Currently: {current ? 'PREMIUM' : 'FREE'}
                    </Text>
                  </View>
                </View>
                <Text style={tw`text-white font-bold text-lg`}>
                  {current ? 'DISABLE' : 'ENABLE'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Support item component
const SupportItem: React.FC<{ 
  icon: string; 
  title: string; 
  onPress: () => void;
  isLast?: boolean;
}> = ({ 
  icon, 
  title, 
  onPress,
  isLast = false
}) => (
  <TouchableOpacity 
    style={tw`flex-row items-center p-4 ${!isLast ? 'border-b border-gray-200' : ''}`}
    onPress={onPress}
  >
    <Ionicons name={icon as any} size={22} color="#FF784F" style={tw`mr-3`} />
    <Text style={[tw`text-[#FF784F] flex-1 text-base`, { color: '#FF784F' }]}>{title}</Text>
    <Ionicons name="chevron-forward" size={18} color="#FF784F" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  premiumGlow: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaButton: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  }
});

export default Settings; 