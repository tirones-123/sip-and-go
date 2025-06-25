import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Animated, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { isIOSSafari, installPWA, markPWAAsInstalled } from '../utils/platform';
import { useTranslation } from '../utils/i18n';

interface InstallModalProps {
  visible: boolean;
  onClose: () => void;
}

// Detect browser type for tailored instructions
const getBrowserType = (): 'safari' | 'chrome' | 'firefox' | 'edge' | 'android' | 'other' => {
  if (typeof window === 'undefined') return 'other';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/android/.test(userAgent)) return 'android';
  if (/edg/.test(userAgent)) return 'edge';
  if (/firefox|fxios/.test(userAgent)) return 'firefox';
  if (/chrome|crios/.test(userAgent) && !/edg/.test(userAgent)) return 'chrome';
  if (/safari/.test(userAgent) && !/chrome|crios/.test(userAgent)) return 'safari';
  
  return 'other';
};

// Get device type
const getDeviceType = (): 'ios' | 'android' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/ipad|iphone|ipod/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  
  return 'desktop';
};

/**
 * Enhanced installation modal with browser-specific tutorials
 */
const InstallModal: React.FC<InstallModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [currentStep, setCurrentStep] = useState(0);
  const browserType = getBrowserType();
  const deviceType = getDeviceType();
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 15,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      setCurrentStep(0);
    }
  }, [visible]);

  const handleInstall = async () => {
    try {
      const result = await installPWA();
      if (result || deviceType === 'ios') {
        // For iOS, mark as installed after showing instructions
        markPWAAsInstalled();
        onClose();
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleSkipAndContinue = () => {
    // Mark as installed to hide the button
    markPWAAsInstalled();
    onClose();
  };

  // Get browser-specific instructions
  const getInstructions = () => {
    if (deviceType === 'ios') {
      return [
        {
          icon: 'share-outline',
          title: 'Appuyez sur Partager',
          description: browserType === 'safari' 
            ? "Touchez l'icône de partage en bas de l'écran"
            : "Touchez le menu ⋯ en haut à droite",
          visual: 'ios-share'
        },
        {
          icon: 'add-circle-outline',
          title: 'Sur l\'écran d\'accueil',
          description: browserType === 'safari'
            ? "Faites défiler et sélectionnez cette option"
            : "Sélectionnez « Ajouter à l'écran d'accueil »",
          visual: 'ios-add-home'
        },
        {
          icon: 'checkmark-circle',
          title: 'Ajouter',
          description: "Appuyez sur « Ajouter » en haut à droite",
          visual: 'ios-confirm'
        }
      ];
    } else if (deviceType === 'android' || browserType === 'chrome') {
      return [
        {
          icon: 'ellipsis-vertical',
          title: 'Menu Chrome',
          description: "Touchez les trois points en haut à droite",
          visual: 'chrome-menu'
        },
        {
          icon: 'phone-portrait-outline',
          title: 'Installer l\'application',
          description: "Sélectionnez « Installer l'application »",
          visual: 'chrome-install'
        },
        {
          icon: 'checkmark-circle',
          title: 'Installer',
          description: "Confirmez l'installation",
          visual: 'chrome-confirm'
        }
      ];
    } else if (browserType === 'edge') {
      return [
        {
          icon: 'ellipsis-horizontal',
          title: 'Menu Edge',
          description: "Cliquez sur les trois points en haut à droite",
          visual: 'edge-menu'
        },
        {
          icon: 'apps-outline',
          title: 'Applications',
          description: "Sélectionnez « Applications » puis « Installer ce site »",
          visual: 'edge-install'
        },
        {
          icon: 'checkmark-circle',
          title: 'Installer',
          description: "Confirmez l'installation",
          visual: 'edge-confirm'
        }
      ];
    }
    
    return [];
  };

  const instructions = getInstructions();

  // Visual representations for each step (simplified)
  const renderVisual = (step: number) => {
    const instruction = instructions[step];
    if (!instruction) return null;

    // For now, we'll use icon-based visuals
    // In a real implementation, you'd have actual screenshots
    return (
      <View style={tw`items-center justify-center h-48 bg-gray-50 rounded-xl mb-4`}>
        {step === 0 && deviceType === 'ios' && (
          <View style={tw`items-center`}>
            <View style={tw`bg-blue-500 rounded-full p-4 mb-2`}>
              <Ionicons name="share-outline" size={32} color="white" />
            </View>
            {browserType === 'safari' ? (
              <Text style={tw`text-gray-600 text-sm text-center`}>En bas de votre écran</Text>
            ) : (
              <Text style={tw`text-gray-600 text-sm text-center`}>Menu ⋯ en haut</Text>
            )}
          </View>
        )}
        
        {step === 1 && (
          <View style={tw`bg-white rounded-lg p-4 shadow-sm`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
              <Text style={tw`ml-2 text-gray-800 font-medium`}>Sur l'écran d'accueil</Text>
            </View>
            <View style={tw`h-px bg-gray-200`} />
          </View>
        )}
        
        {step === 2 && (
          <View style={tw`items-center`}>
            <TouchableOpacity style={tw`bg-blue-500 rounded-lg px-6 py-3`}>
              <Text style={tw`text-white font-medium`}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/80 justify-center items-center p-4`}>
        <Animated.View
          style={[
            tw`bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden`,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              maxHeight: '90%'
            },
          ]}
        >
          {/* Header with gradient */}
          <LinearGradient
            colors={['#FF784F', '#ff9571']}
            style={tw`px-6 pt-6 pb-4`}
          >
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-row items-center flex-1`}>
                <Image
                  source={require('../../assets/logo-jauneclair.png')}
                  style={{ width: 40, height: 40, resizeMode: 'contain' }}
                />
                <View style={tw`ml-3 flex-1`}>
                  <Text style={tw`text-white font-bold text-xl`}>
                    Installer SIP&GO!
                  </Text>
                  <Text style={tw`text-white/80 text-xs`}>
                    Comme une vraie app sur votre appareil
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={tw`bg-white/20 rounded-full p-2`}
                onPress={onClose}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Benefits */}
            <View style={tw`flex-row justify-around`}>
              <View style={tw`items-center`}>
                <View style={tw`bg-white/20 rounded-full p-2 mb-1`}>
                  <Ionicons name="rocket" size={16} color="white" />
                </View>
                <Text style={tw`text-white/90 text-xs`}>Rapide</Text>
              </View>
              <View style={tw`items-center`}>
                <View style={tw`bg-white/20 rounded-full p-2 mb-1`}>
                  <Ionicons name="expand" size={16} color="white" />
                </View>
                <Text style={tw`text-white/90 text-xs`}>Plein écran</Text>
              </View>
              <View style={tw`items-center`}>
                <View style={tw`bg-white/20 rounded-full p-2 mb-1`}>
                  <Ionicons name="cloud-offline" size={16} color="white" />
                </View>
                <Text style={tw`text-white/90 text-xs`}>Hors-ligne</Text>
              </View>
              <View style={tw`items-center`}>
                <View style={tw`bg-white/20 rounded-full p-2 mb-1`}>
                  <Ionicons name="phone-portrait" size={16} color="white" />
                </View>
                <Text style={tw`text-white/90 text-xs`}>Natif</Text>
              </View>
            </View>
          </LinearGradient>

          <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6`}>
            {instructions.length > 0 ? (
              <>
                {/* Progress dots */}
                <View style={tw`flex-row justify-center mb-6`}>
                  {instructions.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        tw`mx-1 rounded-full`,
                        index === currentStep
                          ? tw`w-8 h-2 bg-blue-500`
                          : tw`w-2 h-2 bg-gray-300`
                      ]}
                    />
                  ))}
                </View>

                {/* Current step visual */}
                {renderVisual(currentStep)}

                {/* Step instruction */}
                <View style={tw`mb-6`}>
                  <View style={tw`flex-row items-center mb-2`}>
                    <View style={tw`bg-blue-100 rounded-full p-2 mr-3`}>
                      <Ionicons 
                        name={instructions[currentStep].icon as any} 
                        size={20} 
                        color="#3B82F6" 
                      />
                    </View>
                    <Text style={tw`text-gray-900 font-semibold text-lg`}>
                      Étape {currentStep + 1}: {instructions[currentStep].title}
                    </Text>
                  </View>
                  <Text style={tw`text-gray-600 text-base ml-11`}>
                    {instructions[currentStep].description}
                  </Text>
                </View>

                {/* iOS URL bar notice */}
                {deviceType === 'ios' && currentStep === 0 && (
                  <View style={tw`bg-blue-50 rounded-lg p-3 mb-4`}>
                    <View style={tw`flex-row items-start`}>
                      <Ionicons name="information-circle" size={20} color="#3B82F6" style={tw`mr-2 mt-0.5`} />
                      <View style={tw`flex-1`}>
                        <Text style={tw`text-blue-900 font-medium text-sm mb-1`}>
                          Astuce iOS
                        </Text>
                        <Text style={tw`text-blue-700 text-xs`}>
                          La barre d'URL disparaîtra complètement une fois l'app installée et lancée depuis votre écran d'accueil.
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Navigation buttons */}
                <View style={tw`flex-row justify-between`}>
                  {currentStep > 0 && (
                    <TouchableOpacity
                      style={tw`bg-gray-100 rounded-xl py-3 px-6`}
                      onPress={() => setCurrentStep(currentStep - 1)}
                    >
                      <Text style={tw`text-gray-700 font-medium`}>Précédent</Text>
                    </TouchableOpacity>
                  )}
                  
                  {currentStep < instructions.length - 1 ? (
                    <TouchableOpacity
                      style={tw`bg-blue-500 rounded-xl py-3 px-6 ml-auto`}
                      onPress={() => setCurrentStep(currentStep + 1)}
                    >
                      <Text style={tw`text-white font-medium`}>Suivant</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={tw`bg-green-500 rounded-xl py-3 px-6 ml-auto`}
                      onPress={handleInstall}
                    >
                      <Text style={tw`text-white font-medium`}>
                        {deviceType === 'ios' ? "J'ai compris !" : "Installer maintenant"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Skip option */}
                <TouchableOpacity
                  style={tw`mt-4 py-2`}
                  onPress={handleSkipAndContinue}
                >
                  <Text style={tw`text-gray-500 text-center text-sm`}>
                    Ignorer et continuer sur le navigateur
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              /* Fallback for desktop or unsupported browsers */
              <View style={tw`items-center py-8`}>
                <View style={tw`bg-orange-100 rounded-full p-6 mb-4`}>
                  <Ionicons name="desktop-outline" size={48} color="#FF784F" />
                </View>
                <Text style={tw`text-gray-900 font-semibold text-lg mb-2 text-center`}>
                  Installation sur ordinateur
                </Text>
                <Text style={tw`text-gray-600 text-center mb-6`}>
                  Pour une meilleure expérience, ouvrez SIP&GO! sur votre téléphone mobile et installez l'application.
                </Text>
                <TouchableOpacity
                  style={tw`bg-blue-500 rounded-xl py-3 px-8`}
                  onPress={onClose}
                >
                  <Text style={tw`text-white font-medium`}>Continuer quand même</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default InstallModal; 