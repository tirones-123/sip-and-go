import React, { useLayoutEffect, useRef } from 'react';
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
  const premium = useGameStore(state => state.premium);
  const setPremium = useGameStore(state => state.setPremium);
  
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
      android: 'https://play.google.com/store/apps/details?id=com.yourcompany.picolo',
      default: 'https://example.com/rate'
    });
    
    Linking.openURL(storeUrl);
  };
  
  // Share app
  const shareApp = async () => {
    try {
      const result = await Share.share({
        message: Platform.select({
          ios: 'Check out Picolo, a fun drinking game app! https://apps.apple.com/app/id000000000',
          android: 'Check out Picolo, a fun drinking game app! https://play.google.com/store/apps/details?id=com.yourcompany.picolo',
          default: 'Check out Picolo, a fun drinking game app!'
        })
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };
  
  // Contact us
  const contactUs = () => {
    Linking.openURL('mailto:support@example.com?subject=Picolo App Support');
  };
  
  // Toggle premium for development
  const togglePremiumDev = () => {
    setPremium(!premium);
  };
  
  /**
   * Hidden gesture for TestFlight / production debug:
   * Long-press 3 s on the logo toggles premium status.
   */
  const logoPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogoPressIn = () => {
    // Appui long 3s pour basculer premium (utilisable en prod et dev)
    logoPressTimer.current = setTimeout(() => {
      setPremium(!premium);
    }, 3000); // 3 seconds
  };

  const handleLogoPressOut = () => {
    if (logoPressTimer.current) {
      clearTimeout(logoPressTimer.current);
      logoPressTimer.current = null;
    }
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
        {/* Logo (long-press 3 s en prod pour toggle premium) */}
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handleLogoPressIn}
          onPressOut={handleLogoPressOut}
          style={tw`items-center justify-center my-6`}
        >
          <Image
            source={require('../../assets/logo-jauneclair.png')}
            style={{ width: 120, height: 120, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
        
        {/* Premium button - more attractive */}
        {!premium && (
          <TouchableOpacity 
            onPress={openPremium}
            style={[
              tw`bg-white rounded-2xl p-6 mb-6 relative overflow-hidden`,
              styles.shadow,
              styles.premiumGlow
            ]}
          >
            {/* Premium badge */}
            <View style={tw`absolute top-0 right-0 bg-yellow-400 px-3 py-1 rounded-bl-xl`}>
              <Text style={tw`text-black text-xs font-bold`}>PREMIUM</Text>
            </View>
            
            {/* Header */}
            <View style={tw`flex-row items-center justify-center mb-3`}>
              <Ionicons name="star" size={28} color="#FFD700" />
              <Text style={[tw`text-2xl font-bold ml-2`, { color: BG_COLOR }]}>
                {t('settings.premium.title')}
              </Text>
              <Ionicons name="star" size={28} color="#FFD700" />
            </View>
            
            {/* Features list */}
            <View style={tw`mb-4`}>
              {(lang === 'fr' ? fr.settings.premium.features : en.settings.premium.features).map((feature: string, index: number) => (
                <View key={index} style={tw`flex-row items-center mb-2`}>
                  <Text style={[tw`text-base`, { color: BG_COLOR }]}>{feature}</Text>
                </View>
              ))}
            </View>
            
            {/* CTA Button */}
            <View style={[
              tw`rounded-xl px-8 py-4 items-center`,
              styles.ctaButton,
              { backgroundColor: BG_COLOR }
            ]}>
              <Text style={[tw`font-bold text-lg`, { color: '#FFFFFF' }]}>
                {t('settings.premium.upgradeButton')}
              </Text>
            </View>
            
            {/* Sparkle effects */}
            <View style={tw`absolute top-4 left-4`}>
              <Text style={tw`text-yellow-400 text-lg`}>✨</Text>
            </View>
            <View style={tw`absolute bottom-4 right-4`}>
              <Text style={tw`text-yellow-400 text-lg`}>✨</Text>
            </View>
          </TouchableOpacity>
        )}
        
        {/* Language section - redesigned for multiple languages */}
        <View style={[tw`bg-white/90 rounded-2xl mb-6 overflow-hidden`, styles.shadow]}>
          <View style={tw`bg-white/20 p-4 border-b border-white/10`}>
            <Text style={[tw`font-bold text-lg`, { color: BG_COLOR }]}>
              {t('settings.language.title')}
            </Text>
          </View>
          
          <View style={tw`p-4`}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`pr-4`}
            >
              <View style={tw`flex-row`}>
                {languages.map((language, index) => (
                  <TouchableOpacity
                    key={language.code}
                    style={tw`mr-2`}
                    onPress={() => changeLanguage(language.code as 'en' | 'fr')}
                  >
                    <View style={[
                      tw`p-3 rounded-xl border-2 w-24 items-center`,
                      lang === language.code
                        ? { borderColor: BG_COLOR, backgroundColor: `${BG_COLOR}1A` } // 10% opacity
                        : { borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
                    ]}>
                      <Text style={tw`text-3xl mb-1`}>{language.flag}</Text>
                      <Text style={[tw`text-xs font-medium text-center`, { color: BG_COLOR }]} numberOfLines={1}>
                        {language.name}
                      </Text>
                      {lang === language.code && (
                        <Ionicons name="checkmark-circle" size={16} color={BG_COLOR} style={tw`absolute top-1 right-1`} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
        
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
        
        {/* Premium toggle section - Always visible for testing */}
        {true && (
          <View style={[tw`bg-red-100 rounded-2xl mb-6 overflow-hidden border-2 border-red-300`, styles.shadow]}>
            <View style={tw`bg-red-200 p-4 border-b border-red-300`}>
              <Text style={tw`text-red-800 font-bold text-lg`}>
                🚧 {__DEV__ ? 'Development' : 'Test'} Tools
              </Text>
            </View>
            
            <View style={tw`p-4`}>
              <TouchableOpacity 
                style={[
                  tw`flex-row items-center justify-between p-4 rounded-xl`,
                  { backgroundColor: premium ? '#10B981' : '#EF4444' }
                ]}
                onPress={togglePremiumDev}
              >
                <View style={tw`flex-row items-center`}>
                  <Ionicons 
                    name={premium ? "star" : "star-outline"} 
                    size={24} 
                    color="white" 
                    style={tw`mr-3`} 
                  />
                  <View>
                    <Text style={tw`text-white font-bold text-base`}>
                      Premium Status
                    </Text>
                    <Text style={tw`text-white/80 text-sm`}>
                      Currently: {premium ? 'PREMIUM' : 'FREE'}
                    </Text>
                  </View>
                </View>
                <Text style={tw`text-white font-bold text-lg`}>
                  {premium ? 'DISABLE' : 'ENABLE'}
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