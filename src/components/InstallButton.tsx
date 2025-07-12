import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { canInstallPWA, isPWAInstalled } from '../utils/platform';
import { useTranslation } from '../utils/i18n';
import InstallModal from './InstallModal';

interface InstallButtonProps {
  style?: any;
  textStyle?: any;
}

/**
 * Simple and discrete install button
 */
const InstallButton: React.FC<InstallButtonProps> = ({ style, textStyle }) => {
  const { t } = useTranslation();
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if PWA installation is available
    const checkInstallAvailability = () => {
      const canInstall = canInstallPWA();
      const isAlreadyInstalled = isPWAInstalled();
      
      // Debug logs for troubleshooting
      console.log('InstallButton - Check availability:', {
        canInstall,
        isAlreadyInstalled,
        showButton: canInstall && !isAlreadyInstalled
      });
      
      setShowInstallButton(canInstall && !isAlreadyInstalled);
    };

    checkInstallAvailability();

    // Recheck when app comes back to foreground
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        setTimeout(checkInstallAvailability, 100); // Small delay to ensure state is updated
      }
    };

    // Listen for beforeinstallprompt event (for Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setShowInstallButton(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowInstallButton(false);
      (window as any).deferredPrompt = null;
    };

    // Listen for display mode changes (when switching between standalone and browser)
    const handleDisplayModeChange = () => {
      setTimeout(checkInstallAvailability, 100);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Listen for display mode changes
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleDisplayModeChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleDisplayModeChange);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleDisplayModeChange);
        } else {
          mediaQuery.removeListener(handleDisplayModeChange);
        }
      };
    }
  }, []);

  const handleInstall = () => {
    setShowModal(true);
  };

  // Don't render if installation is not available
  if (!showInstallButton) {
    return null;
  }

  return (
    <View style={style}>
      <TouchableOpacity
        style={tw`bg-white/15 flex-row items-center justify-center px-4 py-3 rounded-xl border border-white/20`}
        onPress={handleInstall}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="download-outline" 
          size={18} 
          color="#FFFFFF" 
          style={tw`mr-2`}
        />
        <Text style={tw`text-white text-sm font-medium`}>
          Installer l'app
        </Text>
      </TouchableOpacity>

      {/* Install Modal */}
      <InstallModal 
        visible={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </View>
  );
};

export default InstallButton; 