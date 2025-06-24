import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { canInstallPWA, installPWA, isPWAInstalled, isIOSSafari } from '../utils/platform';
import { useTranslation } from '../utils/i18n';
import { LinearGradient } from 'expo-linear-gradient';
import InstallModal from './InstallModal';

interface InstallButtonProps {
  style?: any;
  textStyle?: any;
}

/**
 * Premium Install Button that makes users want to download the app
 */
const InstallButton: React.FC<InstallButtonProps> = ({ style, textStyle }) => {
  const { t } = useTranslation();
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [shimmerAnim] = useState(new Animated.Value(0));

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

  // Pulse animation
  useEffect(() => {
    if (showInstallButton) {
      const pulse = Animated.loop(
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
      pulse.start();

      // Shimmer effect
      const shimmer = Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      shimmer.start();

      return () => {
        pulse.stop();
        shimmer.stop();
      };
    }
  }, [showInstallButton, pulseAnim, shimmerAnim]);

  const handleInstall = () => {
    setShowModal(true);
  };

  // Don't render if installation is not available
  if (!showInstallButton) {
    return null;
  }

  const benefits = [
    "⚡ Lancement instantané",
    "📱 Comme une vraie app",
    "🚀 Plus rapide",
    "💾 Marche hors-ligne"
  ];

  return (
    <Animated.View 
      style={[
        { transform: [{ scale: pulseAnim }] },
        style
      ]}
    >
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53', '#FF6B6B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={tw`rounded-2xl p-0.5 shadow-lg`}
      >
        <TouchableOpacity
          style={tw`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20`}
          onPress={handleInstall}
          disabled={isInstalling}
          activeOpacity={0.8}
        >
          {/* Header with icon and main text */}
          <View style={tw`flex-row items-center justify-center mb-3`}>
            <View style={tw`bg-white/20 rounded-full p-2 mr-3`}>
              <Ionicons 
                name={isIOSSafari() ? "phone-portrait" : "download"} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white font-bold text-lg`}>
                {isInstalling ? "Installation..." : "📱 Installer l'App"}
              </Text>
              <Text style={tw`text-white/80 text-sm`}>
                Gratuit • Recommandé
              </Text>
            </View>
            <View style={tw`bg-green-500 px-2 py-1 rounded-full`}>
              <Text style={tw`text-white text-xs font-bold`}>GRATUIT</Text>
            </View>
          </View>

          {/* Benefits */}
          <View style={tw`flex-row flex-wrap justify-between mb-3`}>
            {benefits.map((benefit, index) => (
              <Text 
                key={index} 
                style={tw`text-white/90 text-xs mb-1 w-1/2`}
              >
                {benefit}
              </Text>
            ))}
          </View>

          {/* Call to action */}
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={tw`rounded-xl py-3 px-4`}
          >
            <Text style={tw`text-white font-bold text-center text-base`}>
              🚀 Découvrir les avantages
            </Text>
          </LinearGradient>

          {/* Small hint */}
          <Text style={tw`text-white/60 text-xs text-center mt-2`}>
            Appuyez pour voir pourquoi c'est génial !
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Premium Install Modal */}
      <InstallModal 
        visible={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </Animated.View>
  );
};

export default InstallButton; 