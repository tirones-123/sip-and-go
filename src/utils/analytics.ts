import { PostHog } from 'posthog-react-native';
import Constants from 'expo-constants';

// Get PostHog key and host from app config
const posthogKey = Constants.expoConfig?.extra?.POSTHOG_KEY as string;
const posthogHost = Constants.expoConfig?.extra?.POSTHOG_HOST as string || 'https://eu.posthog.com';

/**
 * Initialize and export PostHog instance
 */
export const posthog = new PostHog(posthogKey, { host: posthogHost });

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