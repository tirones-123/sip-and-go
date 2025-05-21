import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import Button from './Button';
import { Pack } from '../types';
import { useTranslation } from '../utils/i18n';

interface PackCardProps {
  pack: Pack;
  onPlay: (packId: string) => void;
  isPremium: boolean;
}

/**
 * Card component for displaying a game pack in the carousel
 */
const PackCard: React.FC<PackCardProps> = ({ pack, onPlay, isPremium }) => {
  const { t } = useTranslation();
  const isLocked = pack.access === 'LOCKED' && !isPremium;
  
  // Get the pack title and description from translations
  const packTitle = t(`modeCarousel.packs.${pack.id}.title`);
  const packDescription = t(`modeCarousel.packs.${pack.id}.description`);
  
  return (
    <View style={tw`bg-darkBg w-80 rounded-3xl overflow-hidden my-4 mx-2 shadow-lg`}>
      {/* Pack image or color block */}
      <View style={[tw`h-48 w-full`, { backgroundColor: pack.color }]}>
        {/* Chip title */}
        <View style={tw`absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20`}>
          <Text style={tw`text-white font-bold`}>{packTitle}</Text>
        </View>
        
        {/* Lock overlay for premium packs */}
        {isLocked && (
          <View style={tw`absolute inset-0 bg-black/60 items-center justify-center`}>
            <View style={tw`absolute top-3 right-3`}>
              <Text style={tw`text-white text-2xl`}>🔒</Text>
            </View>
          </View>
        )}
      </View>
      
      {/* Description section */}
      <View style={tw`p-4`}>
        <Text style={tw`text-white text-lg font-bold mb-2`}>{packTitle}</Text>
        <Text style={tw`text-white/80 mb-4`}>{packDescription}</Text>
        
        {/* Play button */}
        <Button
          text={t('modeCarousel.playButton')}
          fullWidth
          packColor={pack.color}
          onPress={() => onPlay(pack.id)}
        />
      </View>
    </View>
  );
};

export default PackCard; 