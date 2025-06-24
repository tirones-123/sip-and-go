/**
 * Web implementation of Superwall functions
 * Provides stub implementations for web platform
 */

export const showPaywall = async (placement?: string, onSuccess?: () => void): Promise<void> => {
  // For web, we could redirect to a payment page or show a modal
  // For now, just log and call onSuccess if provided
  console.log('Paywall requested for placement:', placement);
  
  // In a real implementation, you would:
  // - Show a payment modal
  // - Redirect to a payment processor
  // - Handle payment success/failure
  
  if (onSuccess) {
    onSuccess();
  }
};

export const initSuperwall = async (): Promise<void> => {
  // Stub for web - no initialization needed
  console.log('Superwall initialized for web');
}; 