import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { isIOSSafari, installPWA } from '../utils/platform';
import { useTranslation } from '../utils/i18n';

interface InstallModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Premium installation modal with detailed benefits and visual instructions
 */
const InstallModal: React.FC<InstallModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible]);

  const benefits = [
    {
      icon: "⚡",
      title: "Lancement Ultra-Rapide",
      description: "Ouvrez l'app en 0.5 seconde, plus rapide que Safari"
    },
    {
      icon: "📱",
      title: "Expérience Native",
      description: "Interface plein écran, comme une vraie app iPhone"
    },
    {
      icon: "🚀",
      title: "Performance Optimisée",
      description: "Consomme 50% moins de batterie et mémoire"
    },
    {
      icon: "💾",
      title: "Mode Hors-ligne",
      description: "Jouez même sans connexion internet"
    },
    {
      icon: "🔒",
      title: "Sécurisé",
      description: "Aucune donnée partagée, 100% privé"
    },
    {
      icon: "🎮",
      title: "Notifications",
      description: "Recevez les nouveaux packs en premier"
    }
  ];

  const iosSteps = [
    {
      icon: "📤",
      title: "1. Appuyez sur Partager",
      description: "Touchez l'icône de partage en bas de l'écran"
    },
    {
      icon: "📱",
      title: "2. Ajoutez à l'écran d'accueil",
      description: "Faites défiler et sélectionnez cette option"
    },
    {
      icon: "✅",
      title: "3. Confirmez",
      description: "Appuyez sur 'Ajouter' en haut à droite"
    }
  ];

  const handleInstall = async () => {
    try {
      await installPWA();
      onClose();
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        <Animated.View
          style={[
            tw`bg-white rounded-3xl max-w-sm w-full shadow-2xl`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={tw`rounded-t-3xl p-6 items-center`}
          >
            <View style={tw`bg-white/20 rounded-full p-4 mb-4`}>
              <Ionicons name="phone-portrait" size={32} color="#FFFFFF" />
            </View>
            <Text style={tw`text-white font-bold text-2xl text-center`}>
              Installer SIP&GO!
            </Text>
            <Text style={tw`text-white/90 text-center mt-2`}>
              Transformez votre expérience de jeu
            </Text>
            
            {/* Close button */}
            <TouchableOpacity
              style={tw`absolute top-4 right-4 bg-white/20 rounded-full p-2`}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={tw`max-h-96`}>
            {/* Benefits */}
            <View style={tw`p-6`}>
              <Text style={tw`text-gray-800 font-bold text-lg mb-4 text-center`}>
                🎉 Pourquoi installer l'app ?
              </Text>
              
              {benefits.map((benefit, index) => (
                <View key={index} style={tw`flex-row items-center mb-3`}>
                  <Text style={tw`text-2xl mr-3`}>{benefit.icon}</Text>
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-semibold text-gray-800`}>
                      {benefit.title}
                    </Text>
                    <Text style={tw`text-gray-600 text-sm`}>
                      {benefit.description}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Installation Steps for iOS */}
              {isIOSSafari() && (
                <View style={tw`mt-6`}>
                  <Text style={tw`text-gray-800 font-bold text-lg mb-4 text-center`}>
                    📖 Comment installer (3 étapes)
                  </Text>
                  
                  {iosSteps.map((step, index) => (
                    <View key={index} style={tw`flex-row items-center mb-4 p-3 bg-gray-50 rounded-xl`}>
                      <Text style={tw`text-2xl mr-3`}>{step.icon}</Text>
                      <View style={tw`flex-1`}>
                        <Text style={tw`font-semibold text-gray-800`}>
                          {step.title}
                        </Text>
                        <Text style={tw`text-gray-600 text-sm`}>
                          {step.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={tw`p-6 pt-0`}>
            <TouchableOpacity
              style={tw`bg-green-500 rounded-2xl py-4 mb-3 shadow-lg`}
              onPress={handleInstall}
              activeOpacity={0.8}
            >
              <Text style={tw`text-white font-bold text-lg text-center`}>
                {isIOSSafari() ? "🚀 Voir les instructions" : "⬇️ Installer maintenant"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={tw`py-3`}
              onPress={onClose}
            >
              <Text style={tw`text-gray-500 text-center`}>
                Plus tard
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default InstallModal; 