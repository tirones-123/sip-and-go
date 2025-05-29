import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import { useTranslation } from '../utils/i18n';
import { useGameStore } from '../store/useGameStore';
import { RootStackParamList } from '../navigation';
import PlayerListItem from '../components/PlayerListItem';
import Button from '../components/Button';
import BubbleBackground from '../components/BubbleBackground';
import { tintColor } from '../utils/colorUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type AddPlayersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddPlayers'>;

// Classic pack color for styling
const CLASSIC_COLOR = '#9C5BD1';

/**
 * AddPlayers screen - Initial screen for adding players
 */
const AddPlayers: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AddPlayersScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [playerName, setPlayerName] = useState('');
  const inputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList<string>>(null);
  
  // Get players and actions from store
  const players = useGameStore(state => state.players);
  const addPlayer = useGameStore(state => state.addPlayer);
  const removePlayer = useGameStore(state => state.removePlayer);
  // New background palette
  const BG_COLOR = '#FF784F'; // Much darker purple
  const lighterBg = tintColor(BG_COLOR, 0.15); // Less tinting to keep it darker
  // Keep classic pack color for other accents (button text)
  const classicPack = useGameStore(state => state.packs.find(p => p.id === 'classic'));
  const baseColor = classicPack?.color || CLASSIC_COLOR;
  
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
  
  // Hide default header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isFocused]);
  
  return (
    <LinearGradient
      colors={[lighterBg, BG_COLOR]}
      style={tw`flex-1`}
    >
      {/* Animated bubbles background */}
      <BubbleBackground bubbleCount={50} spawnRate={4} />

      {/* Top logo & settings */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 10,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 4,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../../assets/logo-jauneclair.png')}
          style={{ height: 95, resizeMode: 'contain' }}
        />
      </View>

      {/* Settings button */}
      <TouchableOpacity 
        onPress={openSettings}
        style={{ position: 'absolute', top: insets.top + 20, right: 20, zIndex: 5 }}
      >
        <Ionicons name="settings-sharp" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -20 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={tw`flex-1 p-6 pb-1`}>
            {/* Header Section */}
            <View style={tw`items-center mt-42 mb-5`}>
              <Text
                style={[
                  tw`text-white text-3xl font-bold tracking-tight text-center`,
                  {
                    fontFamily: 'Montserrat_800ExtraBold',
                    textShadowColor: 'rgba(0,0,0,0.25)',
                    textShadowOffset: { width: 2, height: 4 },
                    textShadowRadius: 5,
                  },
                ]}
              >
                {t('addPlayers.title')}
              </Text>
            </View>

            {/* Player List Section */}
            <View style={tw`flex-1`}>
              <FlatList
                ref={listRef}
                data={players}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <PlayerListItem name={item} onRemove={removePlayer} />
                )}
                style={tw`mb-4`}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
                ListEmptyComponent={
                  <View style={tw`flex-1 justify-center items-center`}>
                    <Text style={tw`text-white/60 text-center text-lg`}>
                      {t('addPlayers.playerCountError')}
                    </Text>
                  </View>
                }
              />
            </View>

            {/* Input and Start Button Section */}
            <View>
              <View style={tw`flex-row mb-4`}>
                <TextInput
                  ref={inputRef}
                  style={[tw`flex-1 bg-white/20 text-white text-base rounded-xl px-4 py-3.5 mr-2 border border-white/30`, { lineHeight: 20 }]}
                  placeholder={t('addPlayers.inputPlaceholder')}
                  placeholderTextColor="#ffffff90"
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
                  textAlignVertical="center"
                />
                
                <TouchableOpacity
                  style={tw`bg-white/20 w-12 h-12 items-center justify-center rounded-xl border border-white/30`}
                  onPress={handleAddPlayer}
                >
                  <Text style={tw`text-white text-2xl font-bold`}>+</Text>
                </TouchableOpacity>
              </View>
              
              <Button
                text={t('addPlayers.startButton')}
                fullWidth
                size="large"
                disabled={players.length < 2}
                onPress={handleStart}
                style={tw`bg-white py-4 rounded-xl shadow-md mb-6`}
                textClassName={`text-lg font-bold text-[${BG_COLOR}]`}
              />
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AddPlayers; 