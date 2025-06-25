import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { canInstallPWA, installPWA, isPWAInstalled, isIOSSafari, markPWAAsInstalled } from '../utils/platform';
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
  const [showDebug, setShowDebug] = useState(false);

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

    // Show debug after 3 seconds if button is still visible
    const debugTimer = setTimeout(() => {
      if (showInstallButton) {
        setShowDebug(true);
      }
    }, 3000);

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
        clearTimeout(debugTimer);
      };
    }
  }, [showInstallButton]);

  const handleInstall = () => {
    setShowModal(true);
  };

  const handleMarkAsInstalled = () => {
    markPWAAsInstalled();
    setShowInstallButton(false);
    setShowDebug(false);
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

      {/* Debug button - remove in production */}
      {showDebug && (
        <TouchableOpacity
          style={tw`bg-red-500/20 flex-row items-center justify-center px-3 py-2 rounded-lg border border-red-500/30 mt-2`}
          onPress={handleMarkAsInstalled}
          activeOpacity={0.7}
        >
          <Text style={tw`text-red-300 text-xs`}>
            🐛 Marquer comme installé (debug)
          </Text>
        </TouchableOpacity>
      )}

      {/* Simple Install Modal */}
      <InstallModal 
        visible={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </View>
  );
};

export default InstallButton; 