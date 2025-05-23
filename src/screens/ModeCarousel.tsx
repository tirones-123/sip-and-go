import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { Pack } from '../types';

import { useTranslation } from '../utils/i18n';
import { useGameStore } from '../store/useGameStore';
import { RootStackParamList } from '../navigation';
import PackCard from '../components/PackCard';

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

/**
 * ModeCarousel screen - Pack selection carousel
 */
const ModeCarousel: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ModeCarouselScreenNavigationProp>();
  const { width } = useWindowDimensions();
  
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
  
  // Force header back to AddPlayers
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => {
          resetGame();
          navigation.reset({ index: 0, routes: [{ name: 'AddPlayers' }] });
        }}>
          <Text style={tw`text-white text-3xl`}>‹</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, resetGame]);
  
  // Handle pack selection
  const handlePlayPack = (packId: string) => {
    const selectedPack = packs.find(p => p.id === packId);
    
    // If the pack is locked and user is not premium, show paywall
    if (selectedPack?.access === 'LOCKED' && !premium) {
      navigation.navigate('Paywall', { returnTo: 'ModeCarousel', packId });
      return;
    }
    
    // Start the pack and navigate to Question screen
    startPack(packId);
    navigation.navigate('Question', { packId });
  };
  
  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Animation logic could be added here if needed
    },
  });
  
  const snapToOffsets = React.useMemo(
    () => packs.map((_, index) => index * SNAP_INTERVAL),
    [packs, SNAP_INTERVAL]
  );

  return (
    <View style={tw`flex-1 bg-carouselBg`}>
      {/* Carousel */}
      <AnimatedFlatList
        data={packs}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
        contentContainerStyle={[tw`py-4`, { paddingHorizontal: sidePadding }]}
        onScroll={scrollHandler}
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
      
      {/* Footer - Player count */}
      <View style={tw`pb-8 items-center`}>
        <Text style={tw`text-darkBg/70`}>
          {t('modeCarousel.playerCount', { count: players.length })}
        </Text>
      </View>
    </View>
  );
};

export default ModeCarousel; 