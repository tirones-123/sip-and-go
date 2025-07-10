import Constants from 'expo-constants';
import { PostHog } from 'posthog-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get PostHog key & host from app config (values injected via .env → app.config.ts)
const posthogKey = Constants.expoConfig?.extra?.POSTHOG_KEY as string | undefined;
const posthogHost = (Constants.expoConfig?.extra?.POSTHOG_HOST as string) || 'https://eu.posthog.com';

/**
 * Lightweight interface to avoid `any` when PostHog is disabled.
 */
interface AnalyticsClient {
  capture(event: string, properties?: Record<string, unknown>): void;
}

function createDisabledClient(): AnalyticsClient {
  return {
    capture: (event, props) => {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.debug('[PostHog disabled]', event, props);
      }
    },
  };
}

let client: AnalyticsClient = createDisabledClient();

if (posthogKey && Constants.appOwnership !== 'expo') {
  try {
    client = new PostHog(
      process.env.EXPO_PUBLIC_POSTHOG_KEY!,
      {
        host: process.env.EXPO_PUBLIC_POSTHOG_HOST!,
        customStorage: AsyncStorage,
      }
    );
  } catch (e) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('[PostHog] Native module not found, running in Expo Go – analytics disabled.');
    }
  }
}

export const posthog: AnalyticsClient = client;

/**
 * Event names for consistent tracking
 */
export enum AnalyticsEvent {
  APP_OPEN = 'app_open',
  GAME_START = 'game_start',
  PACK_SELECT = 'pack_select',
  QUESTION_VIEWED = 'question_viewed',
  GAME_COMPLETED = 'game_completed',
  PLAYER_ADDED = 'player_added',
  PREMIUM_VIEW = 'premium_view',
  PREMIUM_PURCHASE = 'premium_purchase',
  PREMIUM_RESTORE = 'premium_restore',
  LANGUAGE_CHANGE = 'language_change',
  ERROR = 'error'
}

/**
 * Track app open with device info
 */
export function trackAppOpen(): void {
  posthog.capture(AnalyticsEvent.APP_OPEN, {
    timestamp: new Date().toISOString()
  });
}

/**
 * Track game start
 * @param playerCount Number of players
 */
export function trackGameStart(playerCount: number): void {
  posthog.capture(AnalyticsEvent.GAME_START, {
    playerCount
  });
}

/**
 * Track pack selection
 * @param packId Pack ID
 * @param isPremium Whether user has premium access
 */
export function trackPackSelect(packId: string, isPremium: boolean): void {
  posthog.capture(AnalyticsEvent.PACK_SELECT, {
    packId,
    isPremium
  });
}

/**
 * Track question view
 * @param packId Pack ID
 * @param questionId Question ID
 */
export function trackQuestionViewed(packId: string, questionId: string): void {
  posthog.capture(AnalyticsEvent.QUESTION_VIEWED, {
    packId,
    questionId
  });
}

/**
 * Track error event
 * @param errorMessage Error message
 * @param errorCode Optional error code
 */
export function trackError(errorMessage: string, errorCode?: string): void {
  posthog.capture(AnalyticsEvent.ERROR, {
    errorMessage,
    errorCode
  });
}

// Simple PWA download counter
export const trackPWAInstall = async () => {
  try {
    // URL vers notre Vercel Function
    const STATS_URL = '/api/count';
    
    await fetch(STATS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'install' })
    });
    
    console.log('PWA install tracked');
  } catch (error) {
    console.error('Failed to track PWA install:', error);
  }
};

// Fonction pour forcer le tracking (utile pour les tests)
export const forceTrackPWA = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pwa_tracked'); // Reset le flag
    await trackPWAInstall();
    localStorage.setItem('pwa_tracked', 'true');
    console.log('PWA tracking forcé');
  }
};

// Exposer la fonction globalement pour les tests
if (typeof window !== 'undefined') {
  (window as any).forceTrackPWA = forceTrackPWA;
}

// Détection PWA pour Safari et autres navigateurs
const detectAndTrackPWA = () => {
  if (typeof window === 'undefined') return;
  
  // Vérifier si l'app est en mode standalone (PWA installée)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
  
  // Vérifier si c'est une PWA installée
  const isPWA = isStandalone || isInStandaloneMode;
  
  if (isPWA) {
    // Vérifier si c'est la première fois qu'on détecte la PWA
    const hasTrackedPWA = localStorage.getItem('pwa_tracked');
    if (!hasTrackedPWA) {
      console.log('PWA détectée - tracking installation');
      trackPWAInstall();
      localStorage.setItem('pwa_tracked', 'true');
    }
  }
};

// Track PWA installation events
if (typeof window !== 'undefined') {
  // Chrome/Edge - événement standard
  window.addEventListener('appinstalled', () => {
    trackPWAInstall();
    localStorage.setItem('pwa_tracked', 'true');
  });
  
  // Safari/iOS - détection au chargement
  window.addEventListener('load', detectAndTrackPWA);
  
  // Vérifier aussi au changement de display-mode
  if (window.matchMedia) {
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      if (e.matches) {
        detectAndTrackPWA();
      }
    });
  }
  
  // Optional: track install prompt shown
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt ready');
    // Ne pas tracker ici car c'est juste la proposition
  });
} 