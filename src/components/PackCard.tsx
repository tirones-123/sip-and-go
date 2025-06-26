import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType, Platform } from 'react-native';
import tw from 'twrnc';
// import Button from './Button'; // Button component might be replaced by custom button style
import { Pack } from '../types';
import { useTranslation } from '../utils/i18n';
import { tintColor } from '../utils/colorUtils'; // Import tintColor
import LockIcon from './LockIcon';

interface PackCardProps {
  pack: Pack;
  onPlay: (packId: string) => void;
  itemWidth?: number;
  heroImageSource: ImageSourcePropType;
  cardHeight?: number;
}

// Helper function to calculate darker/lighter shades of a hex color
// percent: -1.0 (black) to 1.0 (white)
const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(String(R * (1 + percent)));
  G = parseInt(String(G * (1 + percent)));
  B = parseInt(String(B * (1 + percent)));

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;
  
  R = (R > 0) ? R : 0;
  G = (G > 0) ? G : 0;
  B = (B > 0) ? B : 0;

  const RR = ((R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16));

  return `#${RR}${GG}${BB}`;
};

/**
 * Card component for displaying a game pack in the carousel, redesigned.
 */
const PackCard: React.FC<PackCardProps> = ({ pack, onPlay, itemWidth, heroImageSource, cardHeight }) => {
  const { t } = useTranslation();
  
  // Get the pack title and description from translations
  const packTitle = t(`modeCarousel.packs.${pack.id}.title`, { defaultValue: pack.title });
  const packDescription = t(`modeCarousel.packs.${pack.id}.description`, { defaultValue: pack.description });
  
  // Derived colors
  // Using pack.color as the primary color.
  // For dark elements (pill, button, description text), derive a dark shade.
  // For secondary background (bottom part), derive a light shade.
  
  // Example: -0.5 for 50% darker, 0.7 for 70% lighter (towards white)
  // These percentages might need adjustment based on the actual pack.color values
  const darkAccentColor = shadeColor(pack.color, -0.5); 
  const veryDarkTextColor = shadeColor(pack.color, -0.7); // Even darker for text for contrast
  const lightSecondaryBgColor = shadeColor(pack.color, 0.15); // Further adjusted for better harmony
  const descriptionTextColor = '#FFFFFF'; // Description always white
  // const lightPillButtonTextColor = shadeColor(pack.color, 0.9); // For pill and button text - Now using white

  return (
    <TouchableOpacity
      style={[
        tw`rounded-3xl my-4 bg-transparent`,
        // Shadow to match the mockup (offset to the right and slightly down, soft)
        {
          shadowColor: '#000',
          shadowOpacity: 0.25, // Darker shadow
          shadowRadius: 16, // Slightly larger blur radius
          shadowOffset: { width: 6, height: 4 }, // Slightly reduced offset for balance
          elevation: 10, // Slight bump for Android shadow
        },
        { width: itemWidth ?? 320, height: cardHeight ?? 450 }, // Dynamic height with fallback
      ]}
      onPress={() => onPlay(pack.id)}
      activeOpacity={0.9}
    >
      {/* Inner container with clipping */}
      <View style={[tw`rounded-3xl overflow-hidden`, { flex: 1 }]}>

      {/* Top Part */}
      <View
        style={[tw`relative items-center pt-3`, { backgroundColor: pack.color, flex: 2 }]}
      >
        {/* Title Pill */}
        <View style={[tw`px-5 py-1.5 rounded-full mb-2 shadow-md`, { backgroundColor: darkAccentColor }]}>
          <Text style={[tw`font-bold text-base text-center text-white`, { fontFamily: 'Montserrat_800ExtraBold' }]}>{packTitle}</Text>
        </View>
        
        {/* Hero Image Container - aligned to bottom */}
        <View
          style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}
        >
          {/* Image takes full width of this container, resizeMode contain will handle aspect ratio */}
          <Image
            source={heroImageSource}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>
      </View>
      
      {/* Bottom Part */}
      <View
        style={[
          tw`p-4 items-center rounded-b-3xl`,
          { backgroundColor: lightSecondaryBgColor, flex: 1 },
        ]}
      >
        <Text
          style={[
            tw`text-xl text-center mb-3`,
            {
              color: descriptionTextColor,
              fontFamily: 'Montserrat_800ExtraBold',
              textShadowColor: 'rgba(0,0,0,0.25)',
              textShadowOffset: { width: 2, height: 4 },
              textShadowRadius: 5,
            },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {packDescription}
        </Text>
        
        {/* Play Button */}
        <View
          style={[
            tw`px-12 py-3 rounded-full shadow-md items-center justify-center`,
            { backgroundColor: darkAccentColor },
          ]}
        >
          <Text style={[tw`font-bold uppercase text-lg text-white`, { fontFamily: 'Montserrat_800ExtraBold' }]}>
            {t('modeCarousel.playButton')}
          </Text>
        </View>
      </View>

      </View>{/* end inner container */}
    </TouchableOpacity>
  );
};

export default PackCard; 