import { useEffect, useState, useCallback } from 'react';
import { isWeb, hideAddressBar, requestFullscreen, isPWAInstalled } from '../utils/platform';

/**
 * Hook to manage fullscreen mode and hide address bar for PWA experience
 */
export const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (!isWeb) return;

    // Check if fullscreen API is supported
    const checkSupport = () => {
      const doc = document as any;
      const supported = !!(
        doc.fullscreenEnabled ||
        doc.webkitFullscreenEnabled ||
        doc.mozFullScreenEnabled ||
        doc.msFullscreenEnabled
      );
      setIsSupported(supported);
    };

    // Hide address bar on load for mobile browsers
    const handleLoad = () => {
      hideAddressBar();
      
      // Re-hide address bar after a short delay to ensure it works
      setTimeout(hideAddressBar, 100);
      setTimeout(hideAddressBar, 300);
    };

    // Check fullscreen state
    const checkFullScreen = () => {
      const doc = document as any;
      const isFS = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullScreen(isFS);
    };

    // Event listeners for fullscreen changes
    const handleFullScreenChange = () => {
      checkFullScreen();
    };

    // Prevent scroll bounce on iOS
    const preventBounce = (e: TouchEvent) => {
      if (!isPWAInstalled()) return;
      
      const target = e.target as HTMLElement;
      const scrollable = target.closest('.scrollable');
      
      if (!scrollable) {
        e.preventDefault();
      }
    };

    // Add event listeners
    checkSupport();
    checkFullScreen();
    handleLoad();

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);
    
    // Handle orientation changes
    window.addEventListener('orientationchange', handleLoad);
    window.addEventListener('resize', handleLoad);
    
    // Prevent pull-to-refresh on PWA
    if (isPWAInstalled()) {
      document.addEventListener('touchmove', preventBounce, { passive: false });
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
      window.removeEventListener('orientationchange', handleLoad);
      window.removeEventListener('resize', handleLoad);
      
      if (isPWAInstalled()) {
        document.removeEventListener('touchmove', preventBounce);
      }
    };
  }, []);

  const enterFullScreen = useCallback(async () => {
    if (!isWeb || !isSupported) return false;
    
    try {
      const success = await requestFullscreen();
      if (success) {
        hideAddressBar();
      }
      return success;
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      return false;
    }
  }, [isSupported]);

  const exitFullScreen = useCallback(() => {
    if (!isWeb) return;

    const doc = document as any;
    
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  }, [isFullScreen, enterFullScreen, exitFullScreen]);

  return {
    isFullScreen,
    isSupported,
    enterFullScreen,
    exitFullScreen,
    toggleFullScreen,
  };
}; 