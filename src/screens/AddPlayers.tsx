import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
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
import InstallButton from '../components/InstallButton';
import InstalledBadge from '../components/InstalledBadge';
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
  const [showAlert, setShowAlert] = useState(false);
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
      if (Platform.OS !== 'web') {
        inputRef.current?.focus();
      }
    }
  };
  
  // Handle starting the game
  const handleStart = () => {
    if (players.length < 2) {
      setShowAlert(true);
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
    if (isFocused && Platform.OS !== 'web') {
      // Only auto-focus on native platforms
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

      {/* Main container with overflow protection */}
      <View style={[tw`flex-1`, { overflow: 'hidden' }]}>
        {/* Conditional KeyboardAvoidingView only for native platforms */}
        {Platform.OS === 'web' ? (
          <View style={tw`flex-1 p-6 pb-1 mt-32`}>
            <PlayerContent 
              players={players}
              playerName={playerName}
              setPlayerName={setPlayerName}
              handleAddPlayer={handleAddPlayer}
              handleStart={handleStart}
              removePlayer={removePlayer}
              inputRef={inputRef}
              listRef={listRef}
              t={t}
              BG_COLOR={BG_COLOR}
            />
          </View>
        ) : (
          <KeyboardAvoidingView
            style={tw`flex-1`}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? -20 : 0}
          >
            <View style={tw`flex-1 p-6 pb-1`}>
              <PlayerContent 
                players={players}
                playerName={playerName}
                setPlayerName={setPlayerName}
                handleAddPlayer={handleAddPlayer}
                handleStart={handleStart}
                removePlayer={removePlayer}
                inputRef={inputRef}
                listRef={listRef}
                t={t}
                BG_COLOR={BG_COLOR}
              />
            </View>
          </KeyboardAvoidingView>
        )}
      </View>

      {/* PWA-compatible Alert Modal */}
      <Modal
        visible={showAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAlert(false)}
      >
        <View style={tw`flex-1 bg-black/80 justify-center items-center px-6`}>
          <View 
            style={[
              tw`w-full max-w-sm rounded-xl p-6 border border-white/30`,
              { 
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
              }
            ]}
          >
            <Text style={tw`text-white text-lg font-bold mb-4 text-center`}>
              {t('addPlayers.playerCountError')}
            </Text>
            <TouchableOpacity
              style={tw`bg-white/15 rounded-lg py-3 px-6 border border-white/40`}
              onPress={() => setShowAlert(false)}
            >
              <Text style={tw`text-white font-bold text-center`}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

// Extracted content component to avoid duplication
const PlayerContent: React.FC<{
  players: string[];
  playerName: string;
  setPlayerName: (name: string) => void;
  handleAddPlayer: () => void;
  handleStart: () => void;
  removePlayer: (name: string) => void;
  inputRef: React.RefObject<TextInput | null>;
  listRef: React.RefObject<FlatList<string> | null>;
  t: (key: string) => string;
  BG_COLOR: string;
}> = ({
  players,
  playerName,
  setPlayerName,
  handleAddPlayer,
  handleStart,
  removePlayer,
  inputRef,
  listRef,
  t,
  BG_COLOR
}) => (
  <View style={[tw`flex-1`, { overflow: 'hidden' }]}>
    {/* Header Section */}
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
    </TouchableWithoutFeedback>

    {/* Player List Section with strict bounds */}
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[tw`flex-1 mb-4`, { overflow: 'hidden', minHeight: 0 }]}>
        <FlatList
          ref={listRef}
          data={players}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <PlayerListItem name={item} onRemove={removePlayer} />
          )}
          style={[tw`flex-1`, { overflow: 'hidden' }]}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
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
    </TouchableWithoutFeedback>

    {/* Input and Start Button Section - Fixed at bottom */}
    <View style={tw`pb-safe`}>
      <View style={tw`flex-row mb-4`}>
        <TextInput
          ref={inputRef}
          style={[
            tw`flex-1 bg-white/20 text-white text-base rounded-xl px-4 py-3.5 mr-2 border border-white/30`, 
            { 
              lineHeight: 20,
              fontSize: 16 // Prevent auto-zoom on mobile web
            }
          ]}
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
          textContentType="none"
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
        style={tw`bg-white py-4 rounded-xl shadow-md mb-4`}
        textClassName={`text-lg font-bold text-[${BG_COLOR}]`}
      />
      
      {/* Install PWA Button or Installed Badge */}
      <InstallButton style={tw`mb-6`} />
      <InstalledBadge style={tw`mb-6 self-center`} />
    </View>
  </View>
);

export default AddPlayers; 