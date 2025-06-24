import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { canInstallPWA, installPWA, isPWAInstalled, isIOSSafari } from '../utils/platform';
import { useTranslation } from '../utils/i18n';

interface InstallButtonProps {
  style?: any;
  textStyle?: any;
}

/**
 * Button component that shows PWA installation option when available
 */
const InstallButton: React.FC<InstallButtonProps> = ({ style, textStyle }) => {
  const { t } = useTranslation();
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if PWA installation is available
    const checkInstallAvailability = () => {
      const canInstall = canInstallPWA();
      const isAlreadyInstalled = isPWAInstalled();
      
      setShowInstallButton(canInstall && !isAlreadyInstalled);
    };

    checkInstallAvailability();

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

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installPWA();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't render if installation is not available
  if (!showInstallButton) {
    return null;
  }

  const buttonText = isIOSSafari() 
    ? t('install.iosInstructions') || 'Installer sur iPhone'
    : t('install.button') || 'Installer l\'app';

  const icon = isIOSSafari() ? 'phone-portrait' : 'download';

  return (
    <TouchableOpacity
      style={[
        tw`bg-white/20 flex-row items-center justify-center px-4 py-3 rounded-xl border border-white/30`,
        style
      ]}
      onPress={handleInstall}
      disabled={isInstalling}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color="#FFFFFF" 
        style={tw`mr-2`}
      />
      <Text
        style={[
          tw`text-white font-semibold text-base`,
          textStyle
        ]}
      >
        {isInstalling ? (t('install.installing') || 'Installation...') : buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default InstallButton; 