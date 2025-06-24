import { Platform } from 'react-native';

// Only import Superwall on native platforms
let Superwall: any = null;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Superwall = require('@superwall/react-native-superwall').default;
  } catch (e) {
    console.warn('[Superwall] Module not available on this platform');
  }
}

/**
 * Helper to show a Superwall paywall for a given placement.
 * On web, this is a no-op since everything is free.
 * Calls `onUnlock` when the user is entitled (purchase or already premium).
 */
export const showPaywall = async (
  placement: string,
  onUnlock?: () => void
): Promise<void> => {
  // On web, always call onUnlock immediately (everything is free)
  if (Platform.OS === 'web') {
    console.log('[Superwall] Paywall skipped on web platform - all content is free');
    if (onUnlock) onUnlock();
    return;
  }

  if (!Superwall) {
    console.warn('[Superwall] Module not available');
    return;
  }

  try {
    await Superwall.shared.register({
      placement,
      feature: () => {
        if (onUnlock) onUnlock();
      },
    });
  } catch (e) {
    console.error('[Superwall] Failed to present paywall:', e);
  }
}; 