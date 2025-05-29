import Constants from 'expo-constants';
import { Platform } from 'react-native';
import Superwall from '@superwall/react-native-superwall';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { PurchasesPackage as RCPackage } from 'react-native-purchases';

// Use `any` to avoid type errors when the module isn't present
let Purchases: any = null;

// Dynamically require Purchases only outside Expo Go
if (Constants.appOwnership !== 'expo') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Purchases = require('react-native-purchases');
  } catch {
    Purchases = null;
  }
}

export type PurchasesPackage = RCPackage;

// Get API keys from app config
const iosKey = Constants.expoConfig?.extra?.RC_KEY_IOS as string;
const androidKey = Constants.expoConfig?.extra?.RC_KEY_ANDROID as string;

/**
 * Initialize RevenueCat SDK
 * @param setIsPremium Callback to update premium status in store
 */
export async function initRC(setIsPremium: (isPremium: boolean) => void): Promise<void> {
  if (!Purchases) {
    if (__DEV__) console.warn('[RevenueCat] Module not available in Expo Go – skipping init.');
    return;
  }
  try {
    // Use the appropriate key based on platform
    const apiKey = Platform.OS === 'ios' ? iosKey : androidKey;
    
    if (!apiKey) {
      console.error('RevenueCat API key is missing');
      return;
    }
    
    // Initialize RevenueCat
    await Purchases.configure({ apiKey, observerMode: true });
    
    // Get initial customer info
    const { customerInfo } = await Purchases.getCustomerInfo();
    const premium = customerInfo.entitlements.active.premium !== undefined;
    setIsPremium(premium);
    
    // Inform Superwall immediately
    try {
      const sw = (Superwall as any)?.shared;
      if (sw) {
        sw.subscriptionStatus = premium
          ? { state: 'active', entitlements: new Set(['premium']) }
          : { state: 'inactive' };
      }
    } catch {}
    
    // Set up listener for entitlement changes
    Purchases.addCustomerInfoUpdateListener((info: any) => {
      const isPremium = info.entitlements.active.premium !== undefined;
      setIsPremium(isPremium);

      // Sync with Superwall
      try {
        const sw = (Superwall as any)?.shared;
        if (sw) {
          sw.subscriptionStatus = isPremium
            ? { state: 'active', entitlements: new Set(['premium']) }
            : { state: 'inactive' };
        }
      } catch {}
    });
    
    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
  }
}

/**
 * Get available packages from RevenueCat
 * @returns List of available purchase packages
 */
export async function getPackages(): Promise<PurchasesPackage[]> {
  if (!Purchases) return [];
  try {
    const offerings = await Purchases.getOfferings();
    
    if (!offerings.current) {
      console.warn('No offerings available from RevenueCat');
      return [];
    }
    
    return offerings.current.availablePackages;
  } catch (error) {
    console.error('Failed to get packages:', error);
    return [];
  }
}

/**
 * Purchase a package
 * @param packageToPurchase The package to purchase
 * @returns Success status
 */
export async function purchasePackage(packageToPurchase: PurchasesPackage): Promise<boolean> {
  if (!Purchases) return false;
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo.entitlements.active.premium !== undefined;
  } catch (error: any) {
    // User cancelled or purchase failed
    if (!error.userCancelled) {
      console.error('Purchase failed:', error);
    }
    return false;
  }
}

/**
 * Restore purchases
 * @returns Success status
 */
export async function restorePurchases(): Promise<boolean> {
  if (!Purchases) return false;
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return customerInfo.entitlements.active.premium !== undefined;
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
} 