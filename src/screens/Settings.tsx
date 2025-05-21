import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Linking, 
  Share,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';

import { useTranslation } from '../utils/i18n';
import { useGameStore } from '../store/useGameStore';
import { RootStackParamList } from '../navigation';
import { setLanguage } from '../utils/i18n';
import { posthog, AnalyticsEvent } from '../utils/analytics';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

/**
 * Settings screen - App settings and subscription management
 */
const Settings: React.FC = () => {
  const { t, lang } = useTranslation();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  // Premium status from store
  const premium = useGameStore(state => state.premium);
  
  // Change language
  const changeLanguage = (newLang: 'en' | 'fr') => {
    if (newLang !== lang) {
      setLanguage(newLang);
      
      // Track language change
      posthog.capture(AnalyticsEvent.LANGUAGE_CHANGE, { language: newLang });
    }
  };
  
  // Open subscription management
  const openSubscriptionManagement = () => {
    const url = Platform.select({
      ios: 'https://apps.apple.com/account/subscriptions',
      android: 'https://play.google.com/store/account/subscriptions',
      default: 'https://example.com/manage-subscription'
    });
    
    Linking.openURL(url);
  };
  
  // Open premium purchase
  const openPremium = () => {
    navigation.navigate('Paywall', { returnTo: 'Settings' });
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
  
  // Settings section component
  const SettingsSection: React.FC<{ title?: string; children: React.ReactNode }> = ({ 
    title, 
    children 
  }) => (
    <View style={tw`bg-darkBg rounded-xl p-4 mb-4`}>
      {title && <Text style={tw`text-white text-lg font-bold mb-2`}>{title}</Text>}
      {children}
    </View>
  );
  
  // Settings item component
  const SettingsItem: React.FC<{ 
    title: string; 
    subtitle?: string;
    onPress: () => void;
    showChevron?: boolean;
    active?: boolean; 
  }> = ({ 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    active = false 
  }) => (
    <TouchableOpacity 
      style={tw`flex-row justify-between items-center py-3 border-b border-white/10 ${active ? 'bg-white/5' : ''}`}
      onPress={onPress}
    >
      <View>
        <Text style={tw`text-white text-base font-medium`}>{title}</Text>
        {subtitle && <Text style={tw`text-white/60 text-sm mt-1`}>{subtitle}</Text>}
      </View>
      
      {showChevron && (
        <Text style={tw`text-white/60 text-lg`}>›</Text>
      )}
    </TouchableOpacity>
  );
  
  return (
    <ScrollView style={tw`flex-1 bg-darkBg`}>
      <View style={tw`p-4`}>
        {/* Premium section */}
        <SettingsSection>
          <SettingsItem
            title={t('settings.premium.title')}
            subtitle={t('settings.premium.subtitle')}
            onPress={openPremium}
            active={!premium}
          />
          
          <SettingsItem
            title={t('settings.subscription.title')}
            subtitle={t('settings.subscription.subtitle')}
            onPress={openSubscriptionManagement}
            active={premium}
          />
        </SettingsSection>
        
        {/* Language section */}
        <SettingsSection title={t('settings.language.title')}>
          <SettingsItem
            title={t('settings.language.en')}
            onPress={() => changeLanguage('en')}
            showChevron={false}
            active={lang === 'en'}
          />
          
          <SettingsItem
            title={t('settings.language.fr')}
            onPress={() => changeLanguage('fr')}
            showChevron={false}
            active={lang === 'fr'}
          />
        </SettingsSection>
        
        {/* Support section */}
        <SettingsSection title={t('settings.support.title')}>
          <SettingsItem
            title={t('settings.support.rateApp')}
            onPress={rateApp}
          />
          
          <SettingsItem
            title={t('settings.support.shareApp')}
            onPress={shareApp}
          />
          
          <SettingsItem
            title={t('settings.support.contactUs')}
            onPress={contactUs}
          />
        </SettingsSection>
      </View>
    </ScrollView>
  );
};

export default Settings; 