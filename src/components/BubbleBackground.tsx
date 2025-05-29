import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BubbleData {
  id: number;
  size: number;
  startX: number;
  duration: number;
  opacity: number;
}

/**
 * Individual realistic bubble component with shine effect
 */
const RealisticBubble: React.FC<{ bubble: BubbleData; onComplete: (id: number) => void }> = ({ 
  bubble, 
  onComplete 
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT + bubble.size);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Scale in with bounce
    scale.value = withTiming(1, { 
      duration: 800, 
      easing: Easing.out(Easing.back(1.5)) 
    });
    
    // Move up with completion callback
    translateY.value = withTiming(-bubble.size - 50, { 
      duration: bubble.duration, 
      easing: Easing.out(Easing.quad) 
    }, (finished) => {
      if (finished) {
        runOnJS(onComplete)(bubble.id);
      }
    });
    
    // Natural horizontal drift
    const driftAmount = Math.random() * 60 - 30;
    translateX.value = withRepeat(
      withSequence(
        withTiming(driftAmount, { 
          duration: bubble.duration / 4, 
          easing: Easing.inOut(Easing.sin) 
        }),
        withTiming(-driftAmount * 0.7, { 
          duration: bubble.duration / 4, 
          easing: Easing.inOut(Easing.sin) 
        }),
        withTiming(driftAmount * 0.4, { 
          duration: bubble.duration / 4, 
          easing: Easing.inOut(Easing.sin) 
        }),
        withTiming(-driftAmount * 0.2, { 
          duration: bubble.duration / 4, 
          easing: Easing.inOut(Easing.sin) 
        })
      ),
      -1,
      false
    );

    // Gentle rotation
    rotation.value = withRepeat(
      withTiming(360, { 
        duration: bubble.duration * 1.5, 
        easing: Easing.linear 
      }),
      -1,
      false
    );
  }, [bubble, onComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [SCREEN_HEIGHT + bubble.size, -bubble.size - 50],
      [0, 1]
    );

    return {
      transform: [
        { translateX: bubble.startX + translateX.value },
        { translateY: translateY.value },
        { scale: scale.value * (1 + progress * 0.1) }, // Slight size increase as it rises
        { rotate: `${rotation.value}deg` },
      ],
      opacity: bubble.opacity * (1 - progress * 0.3), // Fade out as it rises
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: bubble.size,
          height: bubble.size,
        },
        animatedStyle,
      ]}
    >
      {/* Main bubble body */}
      <View
        style={{
          width: bubble.size,
          height: bubble.size,
          borderRadius: bubble.size / 2,
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.4)',
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: bubble.size / 3,
          elevation: 5,
        }}
      >
        {/* Top shine highlight */}
        <View
          style={{
            position: 'absolute',
            top: bubble.size * 0.15,
            left: bubble.size * 0.25,
            width: bubble.size * 0.3,
            height: bubble.size * 0.25,
            borderRadius: bubble.size * 0.15,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            shadowColor: '#FFFFFF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}
        />
        
        {/* Secondary smaller shine */}
        <View
          style={{
            position: 'absolute',
            top: bubble.size * 0.6,
            right: bubble.size * 0.2,
            width: bubble.size * 0.15,
            height: bubble.size * 0.15,
            borderRadius: bubble.size * 0.075,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        />
      </View>
    </Animated.View>
  );
};

interface BubbleBackgroundProps {
  bubbleCount?: number;
  spawnRate?: number; // bubbles per second
}

/**
 * Background component with continuous realistic bubbles
 */
const BubbleBackground: React.FC<BubbleBackgroundProps> = ({ 
  bubbleCount = 60, 
  spawnRate = 3 
}) => {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const bubbleIdCounter = useRef(0);
  const spawnTimer = useRef<NodeJS.Timeout | null>(null);

  // Create a new bubble
  const createBubble = (): BubbleData => {
    return {
      id: bubbleIdCounter.current++,
      size: Math.random() * 20 + 6, // 6-26px
      startX: Math.random() * (SCREEN_WIDTH + 60) - 30, // Can start slightly off-screen
      duration: Math.random() * 8000 + 12000, // 12-20s duration
      opacity: Math.random() * 0.4 + 0.4, // 0.4-0.8 opacity (much more visible)
    };
  };

  // Remove completed bubble
  const removeBubble = (id: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
  };

  // Spawn new bubble
  const spawnBubble = () => {
    setBubbles(prev => {
      if (prev.length < bubbleCount) {
        return [...prev, createBubble()];
      }
      return prev;
    });
  };

  // Continuous spawning
  useEffect(() => {
    // Initial burst of bubbles
    const initialBubbles: BubbleData[] = [];
    for (let i = 0; i < Math.min(bubbleCount, 20); i++) {
      setTimeout(() => {
        setBubbles(prev => [...prev, createBubble()]);
      }, i * 100);
    }

    // Continuous spawning
    const startContinuousSpawning = () => {
      const spawnInterval = 1000 / spawnRate; // Convert rate to interval
      
      const scheduleNext = () => {
        spawnTimer.current = setTimeout(() => {
          spawnBubble();
          scheduleNext();
        }, spawnInterval + Math.random() * 500); // Add some randomness
      };
      
      scheduleNext();
    };

    // Start continuous spawning after initial burst
    setTimeout(startContinuousSpawning, 2000);

    return () => {
      if (spawnTimer.current) {
        clearTimeout(spawnTimer.current);
      }
    };
  }, [bubbleCount, spawnRate]);

  return (
    <View 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        overflow: 'hidden' 
      }}
    >
      {bubbles.map((bubble) => (
        <RealisticBubble
          key={bubble.id}
          bubble={bubble}
          onComplete={removeBubble}
        />
      ))}
    </View>
  );
};

export default BubbleBackground; 