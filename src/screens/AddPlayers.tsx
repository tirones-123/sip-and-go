import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import { useTranslation } from '../utils/i18n';
import { useGameStore } from '../store/useGameStore';
import { RootStackParamList } from '../navigation';
import PlayerListItem from '../components/PlayerListItem';
import Button from '../components/Button';

type AddPlayersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddPlayers'>;

/**
 * AddPlayers screen - Initial screen for adding players
 */
const AddPlayers: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AddPlayersScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [playerName, setPlayerName] = useState('');
  const inputRef = useRef<TextInput>(null);
  
  // Get players and actions from store
  const players = useGameStore(state => state.players);
  const addPlayer = useGameStore(state => state.addPlayer);
  const removePlayer = useGameStore(state => state.removePlayer);
  
  // Handle adding a player
  const handleAddPlayer = () => {
    const trimmedName = playerName.trim();
    if (trimmedName) {
      addPlayer(trimmedName);
      setPlayerName('');
      // Keep the keyboard open and focus in the input for quicker multi-add
      inputRef.current?.focus();
    }
  };
  
  // Handle starting the game
  const handleStart = () => {
    if (players.length < 2) {
      Alert.alert('', t('addPlayers.playerCountError'));
      return;
    }
    
    navigation.navigate('ModeCarousel');
  };
  
  // Open settings
  const openSettings = () => {
    navigation.navigate('Settings');
  };
  
  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isFocused]);
  
  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-darkBg`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={tw`flex-1 p-4 pb-8`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <View>
            <Text style={tw`text-white text-2xl font-bold`}>{t('addPlayers.title')}</Text>
            <Text style={tw`text-white/70 mt-1`}>{t('addPlayers.subtitle')}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={openSettings}
            style={tw`w-10 h-10 bg-white/10 rounded-full items-center justify-center`}
          >
            <Text style={tw`text-white text-xl`}>⚙️</Text>
          </TouchableOpacity>
        </View>
        
        {/* Add player input */}
        <View style={tw`flex-row mb-6`}>
          <TextInput
            ref={inputRef}
            style={tw`flex-1 bg-white/10 text-white rounded-lg px-4 py-3 mr-2`}
            placeholder={t('addPlayers.inputPlaceholder')}
            placeholderTextColor="#ffffff80"
            value={playerName}
            onChangeText={setPlayerName}
            onSubmitEditing={handleAddPlayer}
            returnKeyType="done"
            returnKeyLabel={t('addPlayers.addButton')}
            blurOnSubmit={false}
            maxLength={20}
            autoCorrect={false}
            autoCapitalize="words"
            spellCheck={false}
            autoComplete="off"
            importantForAutofill="no"
            // autoFocus handled via focus effect
          />
          
          <TouchableOpacity
            style={tw`bg-classic w-12 items-center justify-center rounded-lg`}
            onPress={handleAddPlayer}
          >
            <Text style={tw`text-white text-2xl font-bold`}>+</Text>
          </TouchableOpacity>
        </View>
        
        {/* Player list */}
        <FlatList
          data={players}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <PlayerListItem name={item} onRemove={removePlayer} />
          )}
          style={tw`flex-1 mb-6`}
          ListEmptyComponent={
            <Text style={tw`text-white/50 text-center mt-8`}>
              {t('addPlayers.playerCountError')}
            </Text>
          }
        />
        
        {/* Start button */}
        <Button
          text={t('addPlayers.startButton')}
          fullWidth
          size="large"
          disabled={players.length < 2}
          onPress={handleStart}
          style={tw`mb-2`}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddPlayers; 