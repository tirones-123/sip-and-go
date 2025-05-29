import Superwall from '@superwall/react-native-superwall';

/**
 * Helper to show a Superwall paywall for a given placement.
 * Calls `onUnlock` when the user is entitled (purchase or already premium).
 */
export const showPaywall = async (
  placement: string,
  onUnlock?: () => void
): Promise<void> => {
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