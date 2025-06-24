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
 * Check if the app is running on iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if the app is running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Check if running on iOS Safari (for PWA installation)
 */
export const isIOSSafari = (): boolean => {
  if (!isWeb) return false;
  
  const userAgent = navigator.userAgent;
  const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
  
  return isIOSDevice && isSafari;
};

/**
 * Check if the app is already installed as PWA
 */
export const isPWAInstalled = (): boolean => {
  if (!isWeb) return false;
  
  // Check if running in standalone mode (installed PWA)
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

/**
 * Check if PWA installation is available
 */
export const canInstallPWA = (): boolean => {
  if (!isWeb) return false;
  
  // For iOS Safari, we can always show install instructions
  if (isIOSSafari()) {
    return !isPWAInstalled();
  }
  
  // For other browsers, check if beforeinstallprompt is supported
  return 'onbeforeinstallprompt' in window;
};

/**
 * Show PWA installation instructions for iOS
 */
export const showIOSInstallInstructions = (): void => {
  if (!isIOSSafari()) return;
  
  const instructions = `Pour installer SIP&GO! sur votre iPhone :

1. Appuyez sur le bouton "Partager" 📤 en bas de Safari
2. Faites défiler et appuyez sur "Sur l'écran d'accueil"
3. Appuyez sur "Ajouter" en haut à droite
4. L'app apparaîtra sur votre écran d'accueil !`;

  alert(instructions);
};

/**
 * Trigger PWA installation for supported browsers
 */
export const installPWA = async (): Promise<boolean> => {
  if (!isWeb) return false;
  
  // For iOS Safari, show instructions
  if (isIOSSafari()) {
    showIOSInstallInstructions();
    return true;
  }
  
  // For other browsers with beforeinstallprompt support
  if ('onbeforeinstallprompt' in window) {
    try {
      const deferredPrompt = (window as any).deferredPrompt;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        return result.outcome === 'accepted';
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  }
  
  return false;
};

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