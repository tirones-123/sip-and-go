import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { canInstallPWA, installPWA, isPWAInstalled, isIOSSafari, markPWAAsInstalled, hasPromptedForInstall } from '../utils/platform';
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
  const [autoShowModal, setAutoShowModal] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if PWA installation is available
    const checkInstallAvailability = () => {
      const canInstall = canInstallPWA();
      const isAlreadyInstalled = isPWAInstalled();
      const hasPrompted = hasPromptedForInstall();
      
      // Debug info (remove in production)
      console.log('PWA Status:', {
        canInstall,
        isAlreadyInstalled,
        hasPrompted,
        isIOSSafari: isIOSSafari(),
        standalone: window.matchMedia('(display-mode: standalone)').matches,
        navigator: (window.navigator as any).standalone
      });
      
      setShowInstallButton(canInstall && !isAlreadyInstalled);
      
      // Auto-show modal after 5 seconds for first-time visitors
      if (canInstall && !isAlreadyInstalled && !hasPrompted) {
        setAutoShowModal(true);
      }
    };

    checkInstallAvailability();

    // Start animations
    if (showInstallButton) {
      // Pulse animation
      Animated.loop(
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
      ).start();

      // Shine animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(shineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shineAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
        ])
      ).start();
    }

    // Auto-show modal after delay for first-time visitors
    let autoShowTimer: NodeJS.Timeout;
    if (autoShowModal && showInstallButton) {
      autoShowTimer = setTimeout(() => {
        setShowModal(true);
        setAutoShowModal(false);
      }, 5000);
    }

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
        if (autoShowTimer) clearTimeout(autoShowTimer);
      };
    }
  }, [showInstallButton, autoShowModal]);

  const handleInstall = () => {
    setShowModal(true);
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
          style={tw`bg-gradient-to-r from-orange-500 to-yellow-500 flex-row items-center justify-center px-5 py-3.5 rounded-2xl shadow-lg`}
          onPress={handleInstall}
          activeOpacity={0.8}
        >
          {/* Gradient background effect */}
          <View style={tw`absolute inset-0 bg-white/20 rounded-2xl`} />
          
          {/* Shine effect */}
          <Animated.View
            style={[
              tw`absolute -inset-1 rounded-2xl`,
              {
                opacity: shineAnim,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: [
                  {
                    translateX: shineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 100],
                    }),
                  },
                ],
              },
            ]}
          />
          
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
        onClose={() => setShowModal(false)} 
      />
    </View>
  );
};

export default InstallButton; 