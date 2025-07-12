import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { isPWAInstalled, isWeb } from '../utils/platform';

interface InstalledBadgeProps {
  style?: any;
}

/**
 * Small badge that shows when the PWA is already installed
 */
const InstalledBadge: React.FC<InstalledBadgeProps> = ({ style }) => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (!isWeb) return;

    const checkInstallStatus = () => {
      const installed = isPWAInstalled();
      console.log('InstalledBadge - Check status:', { installed });
      setIsInstalled(installed);
    };

    checkInstallStatus();

    // Recheck when app comes back to foreground
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        setTimeout(checkInstallStatus, 100); // Small delay to ensure state is updated
      }
    };

    // Listen for display mode changes
    const handleDisplayModeChange = () => {
      setTimeout(checkInstallStatus, 100);
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Listen for display mode changes
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleDisplayModeChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleDisplayModeChange);
      }

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleDisplayModeChange);
        } else {
          mediaQuery.removeListener(handleDisplayModeChange);
        }
      };
    }
  }, []);

  // Don't render if not installed or not on web
  if (!isInstalled || !isWeb) {
    return null;
  }

  return (
    <View style={[tw`bg-green-500/20 flex-row items-center px-3 py-2 rounded-lg border border-green-500/30`, style]}>
      <Ionicons 
        name="checkmark-circle" 
        size={16} 
        color="#10B981" 
        style={tw`mr-2`}
      />
      <Text style={tw`text-green-700 text-xs font-medium`}>
        App installée
      </Text>
    </View>
  );
};

export default InstalledBadge; 