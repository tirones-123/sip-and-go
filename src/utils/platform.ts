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
 * Note: On iOS, all browsers use Safari's WebKit engine, so PWA installation works the same way
 */
export const isIOSSafari = (): boolean => {
  if (!isWeb) return false;
  
  const userAgent = navigator.userAgent;
  const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
  
  // On iOS, all browsers (Safari, Chrome, Firefox, etc.) use Safari's WebKit
  // So PWA installation works the same way regardless of the browser
  return isIOSDevice;
};

/**
 * Mark PWA as installed in localStorage
 */
export const markPWAAsInstalled = (): void => {
  if (!isWeb) return;
  
  try {
    localStorage.setItem('pwa-installed', 'true');
    localStorage.setItem('pwa-install-date', new Date().toISOString());
  } catch (error) {
    console.warn('Could not save PWA install status:', error);
  }
};

/**
 * Check if PWA was marked as installed in localStorage
 */
export const isPWAMarkedAsInstalled = (): boolean => {
  if (!isWeb) return false;
  
  try {
    return localStorage.getItem('pwa-installed') === 'true';
  } catch (error) {
    return false;
  }
};

/**
 * Check if the app is already installed as PWA
 */
export const isPWAInstalled = (): boolean => {
  if (!isWeb) return false;
  
  // First check if user manually marked as installed
  if (isPWAMarkedAsInstalled()) {
    return true;
  }
  
  // Multiple ways to detect PWA installation
  
  // Method 1: Check display-mode standalone
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Method 2: Check navigator.standalone (iOS Safari specific)
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  // Method 3: Check if window.navigator.userAgent contains specific PWA indicators
  const userAgent = navigator.userAgent;
  const isPWAMode = userAgent.includes('wv'); // WebView indicator
  
  // Method 4: Check window size and screen properties (PWA often runs fullscreen)
  const isFullscreen = window.screen.height === window.innerHeight;
  
  // Method 5: Check if app was launched from home screen (iOS)
  const isFromHomeScreen = !document.referrer || document.referrer === '';
  
  // Debug info
  console.log('PWA Detection Methods:', {
    isStandalone,
    isIOSStandalone,
    isPWAMode,
    isFullscreen,
    isFromHomeScreen,
    userAgent: userAgent.substring(0, 100),
    referrer: document.referrer,
    screenHeight: window.screen.height,
    innerHeight: window.innerHeight,
    markedAsInstalled: isPWAMarkedAsInstalled()
  });
  
  const isInstalled = isStandalone || isIOSStandalone || (isIOSSafari() && isFromHomeScreen && isFullscreen);
  
  // If we detect it's installed, mark it for future reference
  if (isInstalled) {
    markPWAAsInstalled();
  }
  
  return isInstalled;
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
  
  const userAgent = navigator.userAgent;
  const isChrome = /CriOS/.test(userAgent);
  const isFirefox = /FxiOS/.test(userAgent);
  
  let browserName = 'Safari';
  let shareIcon = '📤';
  
  if (isChrome) {
    browserName = 'Chrome';
    shareIcon = '⋮'; // Chrome uses 3 dots menu
  } else if (isFirefox) {
    browserName = 'Firefox';
    shareIcon = '⋮';
  }
  
  const instructions = `Pour installer SIP&GO! sur votre iPhone :

1. Appuyez sur le menu ${shareIcon} ${browserName === 'Safari' ? 'en bas' : 'en haut à droite'}
2. ${browserName === 'Safari' ? 'Faites défiler et ' : ''}Appuyez sur "Ajouter à l'écran d'accueil"
3. Appuyez sur "Ajouter" en haut à droite
4. L'app apparaîtra sur votre écran d'accueil !

Note: Sur iOS, tous les navigateurs utilisent le même système d'installation.`;

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