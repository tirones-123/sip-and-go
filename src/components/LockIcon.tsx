import React from 'react';
import { View } from 'react-native';

/**
 * A small lock icon drawn with basic React Native views.
 */
interface LockIconProps {
  /** Overall icon size in pixels (square). */
  size?: number;
  /** Body color (filled part). */
  bodyColor?: string;
  /** Shackle border color. */
  shackleColor?: string;
}

const LockIcon: React.FC<LockIconProps> = ({ size = 32, bodyColor = '#F8E71C', shackleColor = '#FFFFFF' }) => {
  // Derived sizes for a nicer proportion
  const bodyWidth = size * 0.7;
  const bodyHeight = size * 0.6;
  const shackleHeight = size * 0.45;
  const shackleThickness = size * 0.13; // Border thickness of the shackle

  // Colours
  const keyholeColor = '#202020';

  return (
    <View style={{ width: size, alignItems: 'center' }}>
      {/* Shackle (U-shape) */}
      <View
        style={{
          width: bodyWidth,
          height: shackleHeight,
          borderWidth: shackleThickness,
          borderColor: shackleColor,
          borderBottomWidth: 0,
          borderTopLeftRadius: bodyWidth / 2,
          borderTopRightRadius: bodyWidth / 2,
        }}
      />

      {/* Body */}
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          backgroundColor: bodyColor,
          borderRadius: 4,
          overflow: 'hidden', // allow highlight to be clipped
          alignItems: 'center',
        }}
      >
        {/* Subtle top highlight */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: bodyHeight * 0.25,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />

        {/* Keyhole (circle + stem) */}
        <View style={{ marginTop: bodyHeight * 0.25, alignItems: 'center' }}>
          <View
            style={{
              width: bodyWidth * 0.18,
              height: bodyWidth * 0.18,
              borderRadius: (bodyWidth * 0.18) / 2,
              backgroundColor: keyholeColor,
            }}
          />
          <View
            style={{
              width: bodyWidth * 0.07,
              height: bodyHeight * 0.18,
              backgroundColor: keyholeColor,
              borderBottomLeftRadius: bodyWidth * 0.035,
              borderBottomRightRadius: bodyWidth * 0.035,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default LockIcon; 