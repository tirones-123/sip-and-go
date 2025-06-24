import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { canInstallPWA, installPWA, isPWAInstalled, isIOSSafari } from '../utils/platform';
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
      
      // Debug info (remove in production)
      console.log('PWA Status:', {
        canInstall,
        isAlreadyInstalled,
        isIOSSafari: isIOSSafari(),
        standalone: window.matchMedia('(display-mode: standalone)').matches,
        navigator: (window.navigator as any).standalone
      });
      
      setShowInstallButton(canInstall && !isAlreadyInstalled);
    };

    checkInstallAvailability();

    // Recheck when app comes back to foreground (iOS)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkInstallAvailability();
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

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
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

      {/* Simple Install Modal */}
      <InstallModal 
        visible={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </View>
  );
};

export default InstallButton; 