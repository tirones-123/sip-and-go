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
  
  // Rate app
  const rateApp = () => {
    Linking.openURL('mailto:support@sipandgo.app?subject=SIP&GO! App Support');
  };
  
  // Share app
  const shareApp = async () => {
    const shareData = {
      title: 'SIP&GO! - Jeu à Boire',
      text: 'Découvrez SIP&GO!, l\'application de jeu à boire ultime !',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://sipandgo.app'
    };

    try {
      // Check if Web Share API is supported
      if (typeof navigator !== 'undefined' && navigator.share && Platform.OS === 'web') {
        await navigator.share(shareData);
      } else if (Platform.OS === 'web') {
        // Fallback for web browsers without Web Share API
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(
            `${shareData.text} ${shareData.url}`
          );
          // Show a simple feedback (you could replace this with a toast)
          alert('Lien copié dans le presse-papiers !');
        }
      } else {
        // Native share for mobile
        const result = await Share.share({
          message: Platform.select({
            ios: 'Check out SIP&GO!, the ultimate drinking game app! https://apps.apple.com/app/id000000000',
            android: 'Check out SIP&GO!, the ultimate drinking game app! https://play.google.com/store/apps/details?id=com.sipandgoapp.first',
            default: `${shareData.text} ${shareData.url}`
          })
        });
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      // Fallback: copy to clipboard
      try {
        if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(
            `${shareData.text} ${shareData.url}`
          );
          alert('Lien copié dans le presse-papiers !');
        }
      } catch (clipboardError) {
        console.error('Clipboard fallback failed:', clipboardError);
      }
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
      <ScrollView 
        style={tw`flex-1`} 
        contentContainerStyle={tw`px-4 pb-10`}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
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
          <View style={[{ overflow: 'hidden' }]}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`pr-4`}
              bounces={false}
              overScrollMode="never"
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
        </View>

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
              isLast 
            />
          </View>
        </View>
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