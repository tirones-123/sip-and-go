import Purchases, { PurchasesPackage } from 'react-native-purchases';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get API keys from app config
const iosKey = Constants.expoConfig?.extra?.RC_KEY_IOS as string;
const androidKey = Constants.expoConfig?.extra?.RC_KEY_ANDROID as string;

/**
 * Initialize RevenueCat SDK
 * @param setIsPremium Callback to update premium status in store
 */
export async function initRC(setIsPremium: (isPremium: boolean) => void): Promise<void> {
  try {
    // Use the appropriate key based on platform
    const apiKey = Platform.OS === 'ios' ? iosKey : androidKey;
    
    if (!apiKey) {
      console.error('RevenueCat API key is missing');
      return;
    }
    
    // Initialize RevenueCat
    await Purchases.configure({ apiKey });
    
    // Get initial customer info
    const { customerInfo } = await Purchases.getCustomerInfo();
    const premium = customerInfo.entitlements.active.premium !== undefined;
    setIsPremium(premium);
    
    // Set up listener for entitlement changes
    Purchases.addCustomerInfoUpdateListener(info => {
      const isPremium = info.entitlements.active.premium !== undefined;
      setIsPremium(isPremium);
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
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return customerInfo.entitlements.active.premium !== undefined;
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
} 