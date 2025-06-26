import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { View, Text, FlatList, useWindowDimensions, TouchableOpacity, Image, Platform, findNodeHandle } from 'react-native';
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
import { showPaywall } from '../utils/superwall.web';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

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
const LOGO_HEIGHT = 100;
const HEADER_ELEMENT_TOP_PADDING = 10; // Padding from the safe area top inset
const FOOTER_MARGIN_BOTTOM = 24; // from tw`mb-6`
const FOOTER_ESTIMATED_HEIGHT = 90; // Estimated footer height for initial render
const VERTICAL_SPACING = 20; // Reduced back to give more space to cards

/**
 * ModeCarousel screen - Pack selection carousel
 */
const ModeCarousel: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ModeCarouselScreenNavigationProp>();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets(); // Get safe area insets
  
  const [footerHeight, setFooterHeight] = React.useState(0);
  const flatListRef = useRef<FlatList<Pack>>(null);
  const scrollX = useSharedValue(0);

  // Use the draggable scroll hook
  const draggableRef = useDraggableScroll({ outerRef: flatListRef });

  // Carousel layout constants
  const ITEM_SPACING = 16; // space between cards
  const ITEM_WIDTH = Math.min(width * 0.9, 360); // Increased from 0.85 to 0.9 and max from 320 to 360

  // Snap interval (integer) must include item width + spacing between items
  const SNAP_INTERVAL = Math.round(ITEM_WIDTH + ITEM_SPACING);

  // Side padding (integer) so the first/last card are centered on screen
  const sidePadding = Math.round((width - ITEM_WIDTH) / 2);
  
  // Get store data
  const packs = useGameStore(state => state.packs);
  const players = useGameStore(state => state.players);
  const startPack = useGameStore(state => state.startPack);
  const resetGame = useGameStore(state => state.resetGame);
  
  // Force header hidden
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Completely hide the header
    });
  }, [navigation]);

  const handlePlay = async (packId: string) => {
    const selectedPack = packs.find(p => p.id === packId);
    if (!selectedPack) return;

    await startPack(packId);
    navigation.navigate('Question', { packId });
  };
  
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

    const clampedScrollX = clamp(scrollX.value, inputRange[0], inputRange[inputRange.length - 1]);

    return {
      backgroundColor: interpolateColor(clampedScrollX, inputRange, outputRange),
    };
  });

  // Calculate dynamic dimensions to avoid overlap with header/footer
  const headerRenderedHeight = insets.top + HEADER_ELEMENT_TOP_PADDING + LOGO_HEIGHT;
  const footerRenderedHeight = (footerHeight > 0 
    ? footerHeight
    : FOOTER_ESTIMATED_HEIGHT) + insets.bottom + FOOTER_MARGIN_BOTTOM;

  // Calculate dynamic card height based on available space
  const availableHeight = height - headerRenderedHeight - footerRenderedHeight - (VERTICAL_SPACING * 2);
  const cardHeight = Math.min(Math.max(availableHeight * 0.8, 350), 500); // 80% of available space, min 350, max 500

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
          style={{ height: LOGO_HEIGHT, resizeMode: 'contain' }}
        />
      </View>

      {/* Carousel Container */}
      <View style={{ flex: 1, paddingTop: headerRenderedHeight, paddingBottom: footerRenderedHeight }}>
        <Animated.FlatList
          ref={draggableRef}
          data={packs}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
          snapToInterval={ITEM_WIDTH + ITEM_SPACING}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: sidePadding,
            alignItems: 'center',
          }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={{ flexGrow: 1 }}
          renderItem={({ item, index }) => (
            <View style={{
              marginLeft: index === 0 ? 0 : ITEM_SPACING / 2,
              marginRight: index === packs.length - 1 ? 0 : ITEM_SPACING / 2,
            }}>
              <PackCard 
                pack={item}
                onPlay={handlePlay}
                itemWidth={ITEM_WIDTH}
                heroImageSource={packImages[item.id]}
                cardHeight={cardHeight}
              />
            </View>
          )}
        />
      </View>
      
      {/* Footer - Back arrow + Player count */}
      <View
        onLayout={(e) => {
          if (e.nativeEvent.layout.height > 0 && footerHeight === 0) {
            setFooterHeight(e.nativeEvent.layout.height);
          }
        }}
        style={[
          tw`mx-4 px-6 py-4 rounded-2xl shadow-lg`,
          {
            position: 'absolute',
            bottom: insets.bottom,
            marginHorizontal: 16,
            marginBottom: FOOTER_MARGIN_BOTTOM,
            left: 0,
            right: 0,
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