import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import tw from 'twrnc';

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  textClassName?: string;
  disabled?: boolean;
  packColor?: string;
}

/**
 * Reusable button component
 */
const Button: React.FC<ButtonProps> = ({
  text,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  textClassName = '',
  packColor,
  style,
  ...props
}) => {
  // Base styles
  const baseStyle = tw`rounded-lg items-center justify-center`;
  
  // Size styles
  const sizeStyles = {
    small: tw`py-2 px-4`,
    medium: tw`py-3 px-6`,
    large: tw`py-4 px-8`
  };
  
  // Variant styles
  const getVariantStyles = () => {
    if (packColor) {
      return tw`bg-[${packColor}]`;
    }
    
    switch (variant) {
      case 'primary':
        return tw`bg-roseCTA`;
      case 'secondary':
        return tw`bg-classic`;
      case 'outline':
        return tw`border border-gray-300 bg-transparent`;
      default:
        return tw`bg-roseCTA`;
    }
  };
  
  // Text styles
  const textStyles = [
    tw`font-bold text-center`,
    size === 'small' ? tw`text-sm` : size === 'large' ? tw`text-lg` : tw`text-base`,
    variant === 'outline' ? tw`text-white` : tw`text-white`,
    textClassName
  ];
  
  // Width style
  const widthStyle = fullWidth ? tw`w-full` : {};
  
  // Disabled style
  const disabledStyle = disabled ? tw`opacity-50` : {};
  
  return (
    <TouchableOpacity
      style={[
        baseStyle,
        sizeStyles[size],
        getVariantStyles(),
        widthStyle,
        disabledStyle,
        style
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text style={textStyles}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button; 