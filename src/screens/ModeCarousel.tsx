import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  clamp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pack } from '../types';

import { useTranslation } from '../utils/i18n';
import { useGameStore } from '../store/useGameStore';
import { RootStackParamList } from '../navigation';
import PackCard from '../components/PackCard';
import { tintColor } from '../utils/colorUtils';
import { showPaywall } from '../utils/superwall';

type ModeCarouselScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ModeCarousel'>;

// Use Animated FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Pack>);

// Static mapping of hero images for each pack (replace PNGs with your actual assets)
const packImages: Record<string, any> = {
  classic: require('../../assets/hero/classic.png'),
  girls: require('../../assets/hero/girls.png'),
  guys: require('../../assets/hero/guys.png'),
  spicy: require('../../assets/hero/spicy.png'),
  couples: require('../../assets/hero/couples.png'),
};

const FALLBACK_COLOR_DARK = '#0B0E1A'; // For footer
const TINT_AMOUNT = 0.5; // 40% towards white, making it darker than before
const HEADER_ELEMENT_TOP_PADDING = 10; // Padding from the safe area top inset

/**
 * ModeCarousel screen - Pack selection carousel
 */
const ModeCarousel: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ModeCarouselScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets(); // Get safe area insets
  
  // Carousel layout constants
  const ITEM_SPACING = 16; // space between cards

  // Width of each carousel item (take 85 % of screen but max 320px) and round to nearest pixel
  const rawItemWidth = Math.min(width * 0.85, 320);
  const ITEM_WIDTH = Math.round(rawItemWidth);

  // Snap interval (integer) must include item width + spacing between items
  const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;

  // Side padding (integer) so the first/last card are centered on screen
  const sidePadding = Math.round((width - ITEM_WIDTH) / 2);
  
  // Get store data
  const packs = useGameStore(state => state.packs);
  const players = useGameStore(state => state.players);
  const premium = useGameStore(state => state.premium);
  const startPack = useGameStore(state => state.startPack);
  const resetGame = useGameStore(state => state.resetGame);
  
  // Animation setup: Scroll-dependent background color
  const scrollX = useSharedValue(0);

  // Force header hidden
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Completely hide the header
    });
  }, [navigation]);
  
  // Handle pack selection
  const handlePlayPack = async (packId: string) => {
    const selectedPack = packs.find(p => p.id === packId);
    
    // If the pack is locked and user is not premium, show Superwall paywall
    if (selectedPack?.access === 'LOCKED' && !premium) {
      // Show Superwall paywall – placement can be dynamic per pack
      const placement = 'pack_click';
      await showPaywall(placement, () => {
        // Vérifie si l'utilisateur est devenu premium avant de démarrer la partie
        const { premium: nowPremium } = useGameStore.getState();
        if (nowPremium) {
          startPack(packId);
          navigation.navigate('Question', { packId });
        }
      });
      return;
    }

    // Free pack or premium user
    startPack(packId);
    navigation.navigate('Question', { packId });
  };
  
  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  
  const snapToOffsets = React.useMemo(
    () => packs.map((_, index) => index * SNAP_INTERVAL),
    [packs, SNAP_INTERVAL]
  );

  const animatedBgStyle = useAnimatedStyle(() => {
    if (!packs || packs.length === 0) {
      return { backgroundColor: tintColor(FALLBACK_COLOR_DARK, TINT_AMOUNT) };
    }
    if (packs.length === 1) {
      return { backgroundColor: tintColor(packs[0].color, TINT_AMOUNT) };
    }

    const inputRange = packs.map((_, index) => index * SNAP_INTERVAL);
    const outputRange = packs.map(pack => tintColor(pack.color, TINT_AMOUNT));

    // Clamp scrollX to avoid issues with interpolateColor if scrolling beyond defined input ranges
    const clampedScrollX = clamp(scrollX.value, inputRange[0], inputRange[inputRange.length - 1]);

    return {
      backgroundColor: interpolateColor(clampedScrollX, inputRange, outputRange),
    };
  });

  return (
    <Animated.View style={[tw`flex-1`, animatedBgStyle]}>
      {/* Custom top elements: Back button and Logo */}
      <View 
        style={{
          position: 'absolute',
          top: insets.top + HEADER_ELEMENT_TOP_PADDING,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 1, // Ensure logo is on top
        }}
      >
        <Image
          source={require('../../assets/logo-jauneclair.png')}
          style={{ height: 100, resizeMode: 'contain' }}
        />
      </View>

      {/* Carousel */}
      <AnimatedFlatList
        data={packs}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
        contentContainerStyle={[
          tw`py-4 items-center`,
          { 
            paddingHorizontal: sidePadding, 
            // Add padding to ensure content starts below custom header elements
            // Approximate height of custom header area: logo height + top padding + some buffer
            paddingTop: insets.top + HEADER_ELEMENT_TOP_PADDING + 35 + 20, 
          }
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ overflow: 'visible' }}
        renderItem={({ item, index }) => (
          <View style={{
            marginLeft: index === 0 ? 0 : ITEM_SPACING / 2,
            marginRight: index === packs.length - 1 ? 0 : ITEM_SPACING / 2,
          }}>
            <PackCard 
              pack={item}
              onPlay={handlePlayPack}
              isPremium={premium}
              itemWidth={ITEM_WIDTH}
              heroImageSource={packImages[item.id]}
            />
          </View>
        )}
      />
      
      {/* Footer - Back arrow + Player count */}
      <View
        style={[
          tw`mx-4 mb-6 px-6 py-4 rounded-2xl shadow-lg`,
          {
            backgroundColor: FALLBACK_COLOR_DARK,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        {/* Back arrow */}
        <TouchableOpacity
          onPress={() => {
            resetGame();
            navigation.reset({ index: 0, routes: [{ name: 'AddPlayers' }] });
          }}
          style={{
            position: 'absolute',
            left: 16,
            padding: 10,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
          }}
        >
          <Text style={[tw`text-white font-black`, { fontSize: 20, fontWeight: '900' }]}>←</Text>
        </TouchableOpacity>

        {/* Player count */}
        <Text style={[tw`text-white text-lg font-bold`, { fontFamily: 'Montserrat_800ExtraBold' }]}> 
          {t('modeCarousel.playerCount', { count: players.length })}
        </Text>
      </View>
    </Animated.View>
  );
};

export default ModeCarousel;