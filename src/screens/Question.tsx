import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Pressable,
  TextInput,
  Keyboard,
  Animated
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';

import { useTranslation } from '../utils/i18n';
import { useGameStore } from '../store/useGameStore';
import { RootStackParamList } from '../navigation';
import { formatQuestionParts, QuestionPart } from '../utils/pickQuestions';
import { randomColorVariation, tintColor } from '../utils/randomPalette';
import { CLASSIC_PALETTE, getNextClassicColor } from '../utils/classicPalette';
import PlayerListItem from '../components/PlayerListItem';
import Button from '../components/Button';
import { trackQuestionViewed } from '../utils/analytics';
import { showPaywall } from '../utils/superwall.web';

type QuestionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question'>;
type QuestionScreenRouteProp = RouteProp<RootStackParamList, 'Question'>;

/**
 * Question screen - Main gameplay screen
 */
const Question: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<QuestionScreenNavigationProp>();
  const route = useRoute<QuestionScreenRouteProp>();
  const { packId } = route.params;
  const relaunchGame = route.params?.relaunchGame;
  
  // Game state from store
  const currentPack = useGameStore(state => state.currentPack);
  const currentQuestions = useGameStore(state => state.currentQuestions);
  const currentQuestionIndex = useGameStore(state => state.currentQuestionIndex);
  const players = useGameStore(state => state.players);
  const nextQuestion = useGameStore(state => state.nextQuestion);
  const addPlayer = useGameStore(state => state.addPlayer);
  const removePlayer = useGameStore(state => state.removePlayer);
  const resetGame = useGameStore(state => state.resetGame);
  const startPack = useGameStore(state => state.startPack);
  
  // Local state
  const [backgroundColor, setBackgroundColor] = useState(currentPack?.color || '#0B0E1A');
  const [colorIndex, setColorIndex] = useState<number | undefined>(undefined);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [stableFormattedParts, setStableFormattedParts] = useState<QuestionPart[]>([]);
  const modalInputRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  // Current question
  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  // Initial color setup
  useEffect(() => {
    if (currentPack) {
      if (packId === 'classic') {
        // For classic pack, use our custom color palette for question backgrounds
        const { color, index } = getNextClassicColor();
        setBackgroundColor(color);
        setColorIndex(index);
      } else {
        // For other packs, start with the pack's color
        setBackgroundColor(currentPack.color);
      }
    }
  }, [currentPack, packId]);
  
  // Track question view
  useEffect(() => {
    if (currentQuestion) {
      trackQuestionViewed(packId, currentQuestion.id);
    }
  }, [currentQuestion, packId]);
  
  // Update stable formatted parts only when question changes
  useEffect(() => {
    if (currentQuestion && players.length > 0) {
      const newFormattedParts = formatQuestionParts(currentQuestion.text, players);
      setStableFormattedParts(newFormattedParts);
    }
  }, [currentQuestion, currentQuestionIndex]); // Only depend on question, not players
  
  // Handle relaunching the game after Paywall
  useEffect(() => {
    if (relaunchGame && packId) {
      startPack(packId);      // Restart the pack
      setIsFinished(false);   // Ensure the finished overlay is hidden
      // It might be good to reset navigation params to prevent re-triggering on focus
      navigation.setParams({ relaunchGame: undefined }); 
    }
  }, [relaunchGame, packId, startPack, navigation]);
  
  // Handle next question
  const handleNextQuestion = () => {
    // If last question → show finished screen
    if (currentQuestionIndex >= currentQuestions.length - 1) {
      setIsFinished(true);
      return;
    }

    // Update background color based on pack
    if (currentPack) {
      if (packId === 'classic') {
        // For classic pack, cycle through our orange/yellow palette for question backgrounds
        const { color, index } = getNextClassicColor(colorIndex);
        setBackgroundColor(color);
        setColorIndex(index);
      } else {
        // Random variation for other packs
        setBackgroundColor(randomColorVariation(currentPack.color, 15, 10, 10));
      }
    }
    
    nextQuestion();
  };
  
  const handleFinishPress = () => {
    resetGame();
    navigation.navigate('ModeCarousel');
  };
  
  // Handle quitting game
  const handleQuit = () => {
    setShowQuitConfirm(true);
  };
  
  // Handle adding a player
  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
      modalInputRef.current?.focus();
    }
  };
  
  // Shake animation helper
  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };
  
  // Handle removing a player with minimum limit
  const handleRemovePlayer = (name: string) => {
    if (players.length <= 2) {
      triggerShake();
      return;
    }
    removePlayer(name);
  };
  
  return (
    <View style={[tw`flex-1 justify-center items-center`, { backgroundColor }]}>
      {/* Top navigation bar */}
      <View style={tw`absolute top-12 left-0 right-0 flex-row justify-between px-4 z-20`}>
        {/* Players button */}
        <TouchableOpacity
          style={tw`w-10 h-10 bg-white/20 rounded-full items-center justify-center`}
          onPress={() => setShowPlayersModal(true)}
        >
          {/* Person icon drawn with Views */}
          <View style={tw`items-center justify-center`}>
            {/* Head */}
            <View 
              style={[
                tw`w-2 h-2 rounded-full mb-0.5`,
                { backgroundColor: '#FFFFFF' }
              ]} 
            />
            {/* Body */}
            <View 
              style={[
                tw`w-3 h-2 rounded-t-full`,
                { backgroundColor: '#FFFFFF' }
              ]} 
            />
          </View>
        </TouchableOpacity>
        
        {/* Quit button */}
        <TouchableOpacity
          style={tw`w-10 h-10 bg-white/20 rounded-full items-center justify-center`}
          onPress={handleQuit}
        >
          <Text style={tw`text-white text-lg`}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {/* Progress bar */}
      <View style={tw`absolute top-31 left-4 right-4 z-20`}>
        <View 
          style={[
            tw`h-5 rounded-full overflow-hidden`,
            { backgroundColor: '#FFFFFF' }
          ]}
        >
          <View 
            style={[
              tw`h-full rounded-full`,
              { 
                backgroundColor: currentPack?.color ? `${currentPack.color}80` : 'rgba(255, 255, 255, 0.5)',
                width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`
              }
            ]}
          />
        </View>
      </View>
      
      {/* Question text */}
      <Pressable
        style={[tw`flex-1 justify-center items-center px-6 py-8`]}
        onPress={handleNextQuestion}
        pointerEvents="auto"
      >
        <Text
          style={[
            tw`text-white text-center text-2xl`,
            {
              fontFamily: 'Montserrat_800ExtraBold',
              maxWidth: '90%',
              lineHeight: 36,
              textShadowColor: 'rgba(0, 0, 0, 0.25)',
              textShadowOffset: { width: 2, height: 4 },
              textShadowRadius: 5,
            },
          ]}
        >
          {stableFormattedParts.map((part, idx) => {
            if (part.type === 'player') {
              return (
                <Text
                  key={idx}
                  style={{
                    color: tintColor(currentPack?.color ?? '#FFFFFF', 0.5),
                    fontFamily: 'Montserrat_800ExtraBold',
                  }}
                >
                  {part.value}
                </Text>
              );
            }
            return (
              <Text key={idx} style={{ fontFamily: 'Montserrat_800ExtraBold' }}>
                {part.value}
              </Text>
            );
          })}
        </Text>
      </Pressable>
      
      {/* Finished overlay */}
      {isFinished && (
        <View style={[tw`absolute inset-0 flex-1 justify-center items-center p-6`, { backgroundColor: backgroundColor + 'e6' }]}>
          <Text style={[tw`text-white text-center text-4xl mb-8`, { fontFamily: 'Montserrat_800ExtraBold' }]}> 
            {t('question.finishedTitle')}
          </Text>
          
          <View style={tw`w-full`}>
            <Button
              text={t('question.replayButton')}
              onPress={async () => {
                await showPaywall('replay', () => {
                  // Superwall unlocked, start pack again
                  startPack(packId);
                  setIsFinished(false);
                });
              }}
              style={tw`mb-4 bg-white`}
              textClassName={`text-[${backgroundColor}] font-bold`}
              size="large"
              fullWidth
            />
            <Button
              text={t('question.quitButton')}
              onPress={handleFinishPress}
              variant="outline"
              style={tw`border-white`}
              textClassName="text-white font-bold"
              size="large"
              fullWidth
            />
          </View>
        </View>
      )}
      
      {/* Players modal */}
      <Modal
        visible={showPlayersModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPlayersModal(false)}
      >
        <View style={[tw`flex-1 bg-black/70 justify-center items-center`, { overflow: 'hidden' }]}>
          <Pressable
            style={tw`absolute inset-0`}
            onPress={() => setShowPlayersModal(false)}
          />
          <Animated.View 
            style={[
              tw`w-4/5 rounded-xl p-4 border border-white/30`,
              { 
                transform: [{ translateX: shakeAnim }],
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                maxHeight: '70%',
                maxWidth: '90%',
                overflow: 'hidden'
              }
            ]}
          >
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-white text-lg font-bold`}>
                {t('question.managePlayers')}
              </Text>
              <TouchableOpacity onPress={() => setShowPlayersModal(false)}>
                <Text style={tw`text-white text-xl`}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Add player input */}
            <View style={tw`flex-row mb-4`}>
              <TextInput
                ref={modalInputRef}
                style={[
                  tw`flex-1 bg-white/10 text-white rounded-lg px-4 py-3 mr-2 border border-white/30`,
                  { 
                    fontSize: 16, // Prevent auto-zoom on mobile web
                    lineHeight: 20
                  }
                ]}
                placeholder={t('addPlayers.inputPlaceholder')}
                placeholderTextColor="#ffffff80"
                value={newPlayerName}
                onChangeText={setNewPlayerName}
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
                textContentType="none"
              />
              <TouchableOpacity
                style={tw`bg-white/20 w-12 h-12 items-center justify-center rounded-lg border border-white/30`}
                onPress={handleAddPlayer}
              >
                <Text style={tw`text-white text-xl font-bold`}>+</Text>
              </TouchableOpacity>
            </View>
            
            {/* Player list */}
            <View style={[tw`flex-1 mb-4`, { overflow: 'hidden', minHeight: 0 }]}>
              <FlatList
                data={players}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <PlayerListItem 
                    name={item} 
                    onRemove={handleRemovePlayer}
                  />
                )}
                style={[tw`flex-1`, { overflow: 'hidden' }]}
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
                contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={
                  <Text style={tw`text-white/50 text-center mt-4`}>
                    {t('addPlayers.playerCountError')}
                  </Text>
                }
              />
            </View>
            
            <TouchableOpacity
              style={tw`border border-white/40 rounded-lg py-3 px-4 bg-white/15`}
              onPress={() => setShowPlayersModal(false)}
            >
              <Text style={tw`text-white text-center font-bold`}>
                {t('close')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      
      {/* Quit confirmation modal */}
      <Modal
        visible={showQuitConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQuitConfirm(false)}
      >
        <View style={tw`flex-1 bg-black/80 justify-center items-center`}>
          <Pressable
            style={tw`absolute inset-0`}
            onPress={() => setShowQuitConfirm(false)}
          />
          <View 
            style={[
              tw`w-4/5 rounded-xl p-6 border border-white/30`,
              { 
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
              }
            ]}
          >
            <Text style={tw`text-white text-lg font-bold mb-6`}>{t('question.quitConfirm')}</Text>
            <View style={tw`flex-row justify-center`}>
              <TouchableOpacity
                style={tw`border border-white/40 rounded-lg py-3 px-6 bg-white/15 mr-4`}
                onPress={() => setShowQuitConfirm(false)}
              >
                <Text style={tw`text-white font-bold`}>
                  {t('question.quitNo')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-500/20 border border-red-400/50 rounded-lg py-3 px-6`}
                onPress={() => {
                  resetGame();
                  setShowQuitConfirm(false);
                  navigation.reset({ index: 0, routes: [{ name: 'ModeCarousel' }] });
                }}
              >
                <Text style={tw`text-red-300 font-bold`}>
                  {t('question.quitYes')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Question; 