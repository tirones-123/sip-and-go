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
 * Clear PWA installation marker (useful for testing)
 */
export const clearPWAInstallStatus = (): void => {
  if (!isWeb) return;
  
  try {
    localStorage.removeItem('pwa-installed');
    localStorage.removeItem('pwa-install-date');
  } catch (error) {
    console.warn('Could not clear PWA install status:', error);
  }
};

/**
 * Check if the app is currently running in standalone mode (actually launched as PWA)
 */
export const isRunningAsStandalone = (): boolean => {
  if (!isWeb) return false;
  
  // Method 1: Check display-mode standalone (most reliable)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Method 2: Check navigator.standalone (iOS Safari specific)
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  return isStandalone || isIOSStandalone;
};

/**
 * Check if the app is already installed as PWA
 * This now focuses on actual standalone mode detection rather than stored state
 */
export const isPWAInstalled = (): boolean => {
  if (!isWeb) return false;
  
  // Priority 1: Check if actually running in standalone mode RIGHT NOW
  const isCurrentlyStandalone = isRunningAsStandalone();
  
  // If running standalone, definitely installed
  if (isCurrentlyStandalone) {
    // Mark as installed for future reference
    markPWAAsInstalled();
    return true;
  }
  
  // Priority 2: If not running standalone, check if we can detect installation capability
  // This helps avoid showing "installed" when user is just browsing normally
  
  // For iOS Safari, check if we can show install prompt
  if (isIOSSafari()) {
    // If we have a clear indication it was installed but not running standalone,
    // it might have been uninstalled - be more conservative
    return false;
  }
  
  // For other browsers, check if beforeinstallprompt is available
  // If it is, the app is probably not installed
  if ('onbeforeinstallprompt' in window) {
    const deferredPrompt = (window as any).deferredPrompt;
    // If prompt is available, app is not installed
    if (deferredPrompt) {
      return false;
    }
  }
  
  // As a fallback, check our stored state but with less weight
  return isPWAMarkedAsInstalled();
};

/**
 * Check if PWA installation is available
 */
export const canInstallPWA = (): boolean => {
  if (!isWeb) return false;
  
  // Don't show install if already running in standalone mode
  if (isRunningAsStandalone()) {
    return false;
  }
  
  // For iOS Safari, we can always show install instructions
  if (isIOSSafari()) {
    return true;
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

/**
 * Debug function to reset PWA installation status
 * Available in browser console as window.resetPWAStatus()
 */
export const resetPWAStatus = (): void => {
  if (!isWeb) {
    console.log('This function is only available on web');
    return;
  }
  
  clearPWAInstallStatus();
  console.log('PWA installation status cleared');
  console.log('Current state:', {
    isRunningStandalone: isRunningAsStandalone(),
    isPWAInstalled: isPWAInstalled(),
    canInstallPWA: canInstallPWA(),
    isIOSSafari: isIOSSafari()
  });
  
  // Force refresh to update UI
  window.location.reload();
};

// Make debug function globally available
if (isWeb && typeof window !== 'undefined') {
  (window as any).resetPWAStatus = resetPWAStatus;
  (window as any).checkPWAStatus = () => {
    console.log('PWA Status:', {
      isRunningStandalone: isRunningAsStandalone(),
      isPWAInstalled: isPWAInstalled(),
      canInstallPWA: canInstallPWA(),
      isIOSSafari: isIOSSafari(),
      userAgent: navigator.userAgent.substring(0, 100),
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
      navigatorStandalone: (window.navigator as any).standalone
    });
  };
} 