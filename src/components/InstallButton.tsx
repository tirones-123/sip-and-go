import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { canInstallPWA, installPWA, isPWAInstalled, isIOSSafari, markPWAAsInstalled, hasPromptedForInstall, hasUserDismissedInstall } from '../utils/platform';
import { useTranslation } from '../utils/i18n';
import InstallModal from './InstallModal';

interface InstallButtonProps {
  style?: any;
  textStyle?: any;
}

/**
 * Enhanced install button with animation to catch attention
 */
const InstallButton: React.FC<InstallButtonProps> = ({ style, textStyle }) => {
  const { t } = useTranslation();
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Check if PWA installation is available
    const checkInstallAvailability = () => {
      const canInstall = canInstallPWA();
      const isAlreadyInstalled = isPWAInstalled();
      
      console.log('PWA Install Button Status:', {
        canInstall,
        isAlreadyInstalled,
        hasPrompted: hasPromptedForInstall(),
        isIOSSafari: isIOSSafari(),
      });
      
      // Only show button if can install and not already installed
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

  // Pulse animation
  useEffect(() => {
    if (showInstallButton && Platform.OS === 'web') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      
      return () => animation.stop();
    }
  }, [showInstallButton, pulseAnim]);

  const handleInstall = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Mark as prompted so it doesn't auto-show again
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pwa-install-modal-closed', 'true');
      } catch (error) {
        console.warn('Could not save modal close state:', error);
      }
    }
  };

  // Don't render if installation is not available
  if (!showInstallButton) {
    return null;
  }

  return (
    <View style={style}>
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        <TouchableOpacity
          style={tw`bg-orange-500 flex-row items-center justify-center px-5 py-3.5 rounded-2xl shadow-lg`}
          onPress={handleInstall}
          activeOpacity={0.8}
        >
          <View style={tw`flex-row items-center`}>
            <View style={tw`bg-white/25 rounded-full p-1.5 mr-2.5`}>
              <Ionicons 
                name="phone-portrait" 
                size={18} 
                color="#FFFFFF" 
              />
            </View>
            <View>
              <Text style={tw`text-white text-base font-bold`}>
                Installer l'application
              </Text>
              <Text style={tw`text-white/80 text-xs`}>
                Plus rapide • Plein écran • Hors-ligne
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Small hint text */}
      <Text style={tw`text-white/60 text-xs text-center mt-2`}>
        📱 Ajoutez à votre écran d'accueil
      </Text>

      {/* Install Modal */}
      <InstallModal 
        visible={showModal} 
        onClose={handleModalClose} 
      />
    </View>
  );
};

export default InstallButton; 