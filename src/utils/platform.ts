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
 * Get detailed browser type for enhanced PWA instructions
 */
export const getBrowserInfo = () => {
  if (typeof window === 'undefined' || !navigator) {
    return { browser: 'unknown', device: 'unknown', isStandalone: false };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
  
  // Device detection
  let device: 'ios' | 'android' | 'desktop' = 'desktop';
  if (/ipad|iphone|ipod/.test(userAgent)) device = 'ios';
  else if (/android/.test(userAgent)) device = 'android';
  
  // Browser detection
  let browser = 'unknown';
  if (/edg/.test(userAgent)) browser = 'edge';
  else if (/firefox|fxios/.test(userAgent)) browser = 'firefox';
  else if (/chrome|crios/.test(userAgent) && !/edg/.test(userAgent)) browser = 'chrome';
  else if (/safari/.test(userAgent) && !/chrome|crios/.test(userAgent)) browser = 'safari';
  
  return { browser, device, isStandalone };
};

/**
 * Force fullscreen mode for better app experience
 */
export const requestFullscreen = async (): Promise<boolean> => {
  if (!isWeb) return false;
  
  try {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
      return true;
    } else if ((elem as any).webkitRequestFullscreen) {
      await (elem as any).webkitRequestFullscreen();
      return true;
    } else if ((elem as any).mozRequestFullScreen) {
      await (elem as any).mozRequestFullScreen();
      return true;
    } else if ((elem as any).msRequestFullscreen) {
      await (elem as any).msRequestFullscreen();
      return true;
    }
  } catch (error) {
    console.log('Fullscreen request failed:', error);
  }
  
  return false;
};

/**
 * Hide the address bar on mobile browsers
 */
export const hideAddressBar = (): void => {
  if (!isWeb) return;
  
  // Scroll a tiny bit to hide the address bar
  window.scrollTo(0, 1);
  
  // Also try to set the viewport height to 100vh
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover, minimal-ui');
  }
  
  // For iOS, we can use a special meta tag
  if (isIOSSafari()) {
    const appleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (appleMeta) {
      appleMeta.setAttribute('content', 'yes');
    }
  }
};

/**
 * Mark PWA as installed in localStorage
 */
export const markPWAAsInstalled = (): void => {
  if (!isWeb) return;
  
  try {
    localStorage.setItem('pwa-installed', 'true');
    localStorage.setItem('pwa-install-date', new Date().toISOString());
    localStorage.setItem('pwa-install-prompted', 'true'); // Mark that we've shown the prompt
  } catch (error) {
    console.warn('Could not save PWA install status:', error);
  }
};

/**
 * Check if we've already prompted for PWA installation
 */
export const hasPromptedForInstall = (): boolean => {
  if (!isWeb) return true;
  
  try {
    return localStorage.getItem('pwa-install-prompted') === 'true';
  } catch (error) {
    return false;
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
  
  // Method 6: Check for fullscreen or minimal-ui display mode
  const isFullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
  
  // Debug info
  console.log('PWA Detection Methods:', {
    isStandalone,
    isIOSStandalone,
    isPWAMode,
    isFullscreen,
    isFromHomeScreen,
    isFullscreenMode,
    isMinimalUI,
    userAgent: userAgent.substring(0, 100),
    referrer: document.referrer,
    screenHeight: window.screen.height,
    innerHeight: window.innerHeight,
    markedAsInstalled: isPWAMarkedAsInstalled()
  });
  
  const isInstalled = isStandalone || isIOSStandalone || isFullscreenMode || isMinimalUI || 
                     (isIOSSafari() && isFromHomeScreen && isFullscreen);
  
  // If we detect it's installed, mark it for future reference
  if (isInstalled) {
    markPWAAsInstalled();
  }
  
  return isInstalled;
};

/**
 * Check if user has dismissed the install modal
 */
export const hasUserDismissedInstall = (): boolean => {
  if (!isWeb) return true;
  
  try {
    return localStorage.getItem('pwa-install-modal-closed') === 'true';
  } catch (error) {
    return false;
  }
};

/**
 * Check if PWA installation is available
 */
export const canInstallPWA = (): boolean => {
  if (!isWeb) return false;
  
  // If already installed, don't show
  if (isPWAInstalled()) {
    return false;
  }
  
  // If user has dismissed the modal, don't show
  if (hasUserDismissedInstall()) {
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
    // Mark as prompted so we don't show again automatically
    try {
      localStorage.setItem('pwa-install-prompted', 'true');
    } catch (error) {
      console.warn('Could not save prompt status:', error);
    }
    return true; // Return true to indicate instructions were shown
  }
  
  // For other browsers with beforeinstallprompt support
  if ('onbeforeinstallprompt' in window) {
    try {
      const deferredPrompt = (window as any).deferredPrompt;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        
        // Mark as prompted regardless of outcome
        try {
          localStorage.setItem('pwa-install-prompted', 'true');
        } catch (error) {
          console.warn('Could not save prompt status:', error);
        }
        
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