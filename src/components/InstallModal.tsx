import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
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
 * Simple installation modal with clear instructions
 */
const InstallModal: React.FC<InstallModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

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
      <View style={tw`flex-1 bg-black/60 justify-center items-center p-6`}>
        <Animated.View
          style={[
            tw`bg-white rounded-2xl w-full max-w-sm shadow-xl`,
            { opacity: fadeAnim },
          ]}
        >
          {/* Header */}
          <View style={tw`p-6 pb-4 border-b border-gray-100`}>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`bg-blue-100 rounded-full p-2 mr-3`}>
                  <Ionicons name="phone-portrait" size={20} color="#3B82F6" />
                </View>
                <Text style={tw`text-gray-900 font-semibold text-lg`}>
                  Installer SIP&GO!
                </Text>
              </View>
              <TouchableOpacity
                style={tw`p-1`}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`p-6`}>
            {/* Why install */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-gray-600 text-sm mb-3`}>
                Pourquoi installer l'app :
              </Text>
              <View style={tw`space-y-2`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-blue-500 mr-2`}>⚡</Text>
                  <Text style={tw`text-gray-700 text-sm`}>Plus rapide à ouvrir</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-blue-500 mr-2`}>📱</Text>
                  <Text style={tw`text-gray-700 text-sm`}>Interface plein écran</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-blue-500 mr-2`}>💾</Text>
                  <Text style={tw`text-gray-700 text-sm`}>Fonctionne hors-ligne</Text>
                </View>
              </View>
            </View>

            {/* Installation Steps for iOS */}
            {isIOSSafari() && (
              <View style={tw`mb-6`}>
                <Text style={tw`text-gray-800 font-medium mb-4`}>
                  Comment installer :
                </Text>
                
                <View style={tw`space-y-3`}>
                  <View style={tw`flex-row items-start p-3 bg-gray-50 rounded-lg`}>
                    <View style={tw`bg-white rounded-full p-2 mr-3 shadow-sm`}>
                      <Ionicons name="share-outline" size={16} color="#3B82F6" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-medium text-gray-800 text-sm`}>
                        1. Appuyez sur le bouton Partager
                      </Text>
                      <Text style={tw`text-gray-600 text-xs mt-1`}>
                        L'icône 📤 en bas de votre écran
                      </Text>
                    </View>
                  </View>

                  <View style={tw`flex-row items-start p-3 bg-gray-50 rounded-lg`}>
                    <View style={tw`bg-white rounded-full p-2 mr-3 shadow-sm`}>
                      <Ionicons name="add-circle-outline" size={16} color="#3B82F6" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-medium text-gray-800 text-sm`}>
                        2. "Sur l'écran d'accueil"
                      </Text>
                      <Text style={tw`text-gray-600 text-xs mt-1`}>
                        Faites défiler et sélectionnez cette option
                      </Text>
                    </View>
                  </View>

                  <View style={tw`flex-row items-start p-3 bg-gray-50 rounded-lg`}>
                    <View style={tw`bg-white rounded-full p-2 mr-3 shadow-sm`}>
                      <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-medium text-gray-800 text-sm`}>
                        3. Appuyez sur "Ajouter"
                      </Text>
                      <Text style={tw`text-gray-600 text-xs mt-1`}>
                        L'app apparaîtra sur votre écran d'accueil
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={tw`bg-blue-500 rounded-xl py-3 px-4`}
              onPress={handleInstall}
              activeOpacity={0.8}
            >
              <Text style={tw`text-white font-medium text-center`}>
                {isIOSSafari() ? "Voir les instructions" : "Installer maintenant"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default InstallModal; 