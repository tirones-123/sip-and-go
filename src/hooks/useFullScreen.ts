import { useState, useEffect } from 'react';
import { isWeb, isIOSSafari } from '../utils/platform';

/**
 * Hook to manage and detect PWA fullscreen mode
 */
export const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPWAMode, setIsPWAMode] = useState(false);

  useEffect(() => {
    if (!isWeb) return;

    const checkFullScreenStatus = () => {
      // Check if running in standalone mode (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isPWA = isStandalone || isIOSStandalone;
      
      // Check if actually fullscreen
      const isActuallyFullScreen = window.innerHeight === window.screen.height;
      
      setIsPWAMode(isPWA);
      setIsFullScreen(isPWA && isActuallyFullScreen);
      
      console.log('FullScreen Status:', {
        isStandalone,
        isIOSStandalone,
        isPWA,
        isActuallyFullScreen,
        windowHeight: window.innerHeight,
        screenHeight: window.screen.height,
        userAgent: navigator.userAgent.substring(0, 50)
      });
    };

    // Check initially
    checkFullScreenStatus();

    // Check on resize
    window.addEventListener('resize', checkFullScreenStatus);
    window.addEventListener('orientationchange', checkFullScreenStatus);

    // Check when visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(checkFullScreenStatus, 100);
      }
    });

    return () => {
      window.removeEventListener('resize', checkFullScreenStatus);
      window.removeEventListener('orientationchange', checkFullScreenStatus);
    };
  }, []);

  const requestFullScreen = () => {
    if (!isWeb) return;

    // For iOS, show instructions
    if (isIOSSafari() && !isPWAMode) {
      alert(`Pour utiliser l'app en plein écran :

1. Ajoutez d'abord l'app à votre écran d'accueil
2. Ouvrez l'app depuis l'écran d'accueil (pas depuis Safari)
3. L'app s'ouvrira automatiquement en plein écran !

Note: Les PWA iOS ne peuvent être en plein écran que si elles sont lancées depuis l'écran d'accueil.`);
      return;
    }

    // For other browsers, try native fullscreen API
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  };

  return {
    isFullScreen,
    isPWAMode,
    requestFullScreen
  };
}; 