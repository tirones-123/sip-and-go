import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Linking, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import { PurchasesPackage } from 'react-native-purchases';

import { useTranslation } from '../utils/i18n';
import { useGameStore } from '../store/useGameStore';
import { RootStackParamList } from '../navigation';
import { getPackages, purchasePackage, restorePurchases } from '../utils/revenueCat';
import Button from '../components/Button';
import { AnalyticsEvent, posthog } from '../utils/analytics';

type PaywallScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Paywall'>;
type PaywallScreenRouteProp = RouteProp<RootStackParamList, 'Paywall'>;

/**
 * Paywall screen - Premium subscription screen
 */
const Paywall: React.FC = () => {
  const { t } = useTranslation();
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
  const startPack = useGameStore(state => state.startPack);
  
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
  
  // Navigate away if premium is already active
  useEffect(() => {
    if (premium && returnTo) {
      handleClose();
    }
  }, [premium, returnTo]);
  
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
        
        // Start the pack that was selected (if any)
        if (packId) {
          startPack(packId);
        }
        
        handleClose();
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
        
        // Handle navigation if pack was selected
        if (packId) {
          startPack(packId);
        }
        
        handleClose();
      }
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setIsRestoring(false);
    }
  };
  
  // Handle close
  const handleClose = () => {
    if (returnTo && packId) {
      // Return to the specified screen with the pack ID
      navigation.navigate(returnTo, { packId });
    } else if (returnTo) {
      // Return to the specified screen without params
      navigation.navigate(returnTo);
    } else {
      // Default to going back
      navigation.goBack();
    }
  };
  
  // Fixed feature list items
  const features = [
    t('paywall.features.0'),
    t('paywall.features.1'),
    t('paywall.features.2')
  ];
  
  return (
    <View style={tw`flex-1 bg-darkBg px-4 pt-12 pb-8`}>
      {/* Close button */}
      <TouchableOpacity
        style={tw`absolute top-12 left-4 z-10 w-10 h-10 items-center justify-center`}
        onPress={handleClose}
      >
        <Text style={tw`text-white text-3xl`}>✕</Text>
      </TouchableOpacity>
      
      {/* Content */}
      <View style={tw`flex-1 items-center justify-center`}>
        {/* App icon */}
        <View style={tw`w-24 h-24 bg-roseCTA rounded-3xl items-center justify-center mb-6`}>
          <Text style={tw`text-4xl`}>🍻</Text>
        </View>
        
        {/* Title */}
        <Text style={tw`text-white text-3xl font-bold mb-8`}>
          {t('paywall.title')}
        </Text>
        
        {/* Features list */}
        <View style={tw`mb-8 w-4/5`}>
          {features.map((feature, index) => (
            <Text key={index} style={tw`text-white text-lg mb-3`}>
              {feature}
            </Text>
          ))}
        </View>
        
        {/* Purchase button */}
        <Button
          text={t('paywall.callToAction')}
          size="large"
          fullWidth
          loading={isLoading}
          onPress={handlePurchase}
          style={tw`mb-2`}
        />
        
        {/* Subscription info */}
        <Text style={tw`text-white/60 text-sm mb-6`}>
          {t('paywall.trialInfo')}
        </Text>
        
        {/* Restore purchases */}
        <TouchableOpacity onPress={handleRestore} disabled={isRestoring}>
          <Text style={tw`text-white/80 underline text-base mb-4`}>
            {isRestoring ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              t('paywall.restorePurchase')
            )}
          </Text>
        </TouchableOpacity>
        
        {/* Legal links */}
        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://example.com/terms')}
            style={tw`mx-2`}
          >
            <Text style={tw`text-white/60 text-sm`}>{t('paywall.terms')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://example.com/privacy')}
            style={tw`mx-2`}
          >
            <Text style={tw`text-white/60 text-sm`}>{t('paywall.privacy')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Paywall; 