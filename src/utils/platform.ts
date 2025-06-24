import { Platform } from 'react-native';

/**
 * Check if the app is currently running on web
 */
export const isWeb = Platform.OS === 'web';

/**
 * Check if the app is running on mobile (iOS or Android)
 */
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Get platform-specific configuration
 */
export const platformConfig = {
  isWeb,
  isMobile,
  supportsRevenueCat: isMobile,
  supportsNativeAnalytics: isMobile,
  supportsHaptics: isMobile,
  supportsPushNotifications: isMobile,
};

/**
 * Execute code only on mobile platforms
 */
export function onMobile<T>(callback: () => T): T | undefined {
  return isMobile ? callback() : undefined;
}

/**
 * Execute code only on web platform
 */
export function onWeb<T>(callback: () => T): T | undefined {
  return isWeb ? callback() : undefined;
}

/**
 * Get appropriate message for premium features on web
 */
export function getPremiumMessage(): string {
  if (isWeb) {
    return "Les fonctionnalités premium ne sont disponibles que sur l'application mobile. Téléchargez l'app pour accéder à tous les packs !";
  }
  return "Débloquez tous les packs avec un abonnement premium !";
} 