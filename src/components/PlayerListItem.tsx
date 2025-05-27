import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useTranslation } from '../utils/i18n';

interface PlayerListItemProps {
  name: string;
  onRemove: (name: string) => void;
  canRemove?: boolean;
}

/**
 * Component for displaying a player in the list
 */
const PlayerListItem: React.FC<PlayerListItemProps> = ({ name, onRemove, canRemove = true }) => {
  const { t } = useTranslation();
  
  return (
    <View style={tw`flex-row items-center justify-between bg-white/10 rounded-lg p-2 mb-2`}>
      <Text style={tw`text-white font-medium text-base flex-1`}>{name}</Text>
      {canRemove && (
        <TouchableOpacity
          onPress={() => onRemove(name)}
          style={tw`h-7 w-7 rounded-full bg-white/20 items-center justify-center`}
          accessibilityLabel={t('addPlayers.deleteButton')}
        >
          <Text style={tw`text-white text-base font-bold`}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PlayerListItem; 