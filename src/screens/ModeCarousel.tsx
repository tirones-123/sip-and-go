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

/**
 * ModeCarousel screen - Pack selection carousel
 */
const ModeCarousel: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ModeCarouselScreenNavigationProp>();
  const { width } = useWindowDimensions();
  
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
  
  return (
    <View style={tw`flex-1 bg-darkBg`}>
      {/* Carousel */}
      <AnimatedFlatList
        data={packs}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.85}
        decelerationRate="fast"
        contentContainerStyle={tw`py-4 px-2`}
        onScroll={scrollHandler}
        renderItem={({ item }) => (
          <PackCard 
            pack={item}
            onPlay={handlePlayPack}
            isPremium={premium}
          />
        )}
      />
      
      {/* Footer - Player count */}
      <View style={tw`pb-8 items-center`}>
        <Text style={tw`text-white/70`}>
          {t('modeCarousel.playerCount', { count: players.length })}
        </Text>
      </View>
    </View>
  );
};

export default ModeCarousel; 