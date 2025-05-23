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
import { formatQuestionText } from '../utils/pickQuestions';
import { randomColorVariation } from '../utils/randomPalette';
import PlayerListItem from '../components/PlayerListItem';
import Button from '../components/Button';
import { trackQuestionViewed } from '../utils/analytics';

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
  
  // Game state from store
  const currentPack = useGameStore(state => state.currentPack);
  const currentQuestions = useGameStore(state => state.currentQuestions);
  const currentQuestionIndex = useGameStore(state => state.currentQuestionIndex);
  const players = useGameStore(state => state.players);
  const nextQuestion = useGameStore(state => state.nextQuestion);
  const addPlayer = useGameStore(state => state.addPlayer);
  const removePlayer = useGameStore(state => state.removePlayer);
  const resetGame = useGameStore(state => state.resetGame);
  
  // Local state
  const [backgroundColor, setBackgroundColor] = useState(currentPack?.color || '#0B0E1A');
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const modalInputRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  // Current question
  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  // Track question view
  useEffect(() => {
    if (currentQuestion) {
      trackQuestionViewed(packId, currentQuestion.id);
    }
  }, [currentQuestion, packId]);
  
  // Handle next question
  const handleNextQuestion = () => {
    // If last question → show finished screen
    if (currentQuestionIndex >= currentQuestions.length - 1) {
      setIsFinished(true);
      return;
    }

    // Otherwise next question with new color
    if (currentPack?.color) {
      setBackgroundColor(randomColorVariation(currentPack.color, 15, 10, 10));
    }
    nextQuestion();
  };
  
  const handleFinishPress = () => {
    resetGame();
    navigation.navigate('ModeCarousel');
  };
  
  // Format the question text with player names
  const formattedText = currentQuestion 
    ? formatQuestionText(currentQuestion.text, players)
    : '';
  
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
          <Text style={tw`text-white text-lg`}>👤</Text>
        </TouchableOpacity>
        
        {/* Quit button */}
        <TouchableOpacity
          style={tw`w-10 h-10 bg-white/20 rounded-full items-center justify-center`}
          onPress={handleQuit}
        >
          <Text style={tw`text-white text-lg`}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {/* Question text */}
      <Pressable
        style={[tw`flex-1 justify-center items-center px-6 py-8`]}
        onPress={handleNextQuestion}
        pointerEvents="auto"
      >
        <Text style={[tw`text-white text-center text-3xl`, { fontFamily: 'Montserrat_800ExtraBold', maxWidth: '90%' }]}>
          {formattedText}
        </Text>
      </Pressable>
      
      {/* Finished overlay */}
      {isFinished && (
        <Pressable
          style={tw`absolute inset-0 bg-black/90 flex-1 justify-center items-center`}
          onPress={handleFinishPress}
        >
          <Text style={[tw`text-white text-center text-3xl mb-4`, { fontFamily: 'Montserrat_800ExtraBold' }]}> 
            {t('question.finishedTitle')}
          </Text>
          <Text style={[tw`text-white text-center`, { fontFamily: 'Montserrat_400Regular' }]}> 
            {t('question.finishedSubtitle')}
          </Text>
        </Pressable>
      )}
      
      {/* Players modal */}
      <Modal
        visible={showPlayersModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPlayersModal(false)}
      >
        <Pressable
          style={tw`flex-1 justify-center items-center bg-black/70`}
          onPress={Keyboard.dismiss}
        >
          <Animated.View style={[tw`bg-darkBg w-4/5 h-2/3 rounded-xl p-4`, { transform: [{ translateX: shakeAnim }] }]}>
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
                style={tw`flex-1 bg-white/10 text-white rounded-lg px-4 py-3 mr-2`}
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
                autoCapitalize="none"
                spellCheck={false}
                autoComplete="off"
                importantForAutofill="no"
              />
              <Button
                text={t('addPlayers.addButton')}
                onPress={handleAddPlayer}
                size="small"
              />
            </View>
            
            {/* Player list */}
            <FlatList
              data={players}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <PlayerListItem 
                  name={item} 
                  onRemove={handleRemovePlayer}
                />
              )}
              style={tw`flex-1 mb-4`}
              ListEmptyComponent={
                <Text style={tw`text-white/50 text-center mt-4`}>
                  {t('addPlayers.playerCountError')}
                </Text>
              }
            />
            
            <Button
              text={t('close')}
              variant="outline"
              onPress={() => setShowPlayersModal(false)}
              fullWidth
            />
          </Animated.View>
        </Pressable>
      </Modal>
      
      {/* Quit confirmation modal */}
      <Modal
        visible={showQuitConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQuitConfirm(false)}
      >
        <View style={tw`flex-1 bg-black/80 justify-center items-center`}>
          <View style={tw`bg-darkBg w-4/5 rounded-xl p-6`}>
            <Text style={tw`text-white text-lg font-bold mb-6`}>{t('question.quitConfirm')}</Text>
            <View style={tw`flex-row justify-end`}>
              <Button
                text={t('question.quitNo')}
                variant="outline"
                onPress={() => setShowQuitConfirm(false)}
                style={tw`mr-2`}
              />
              <Button
                text={t('question.quitYes')}
                onPress={() => {
                  resetGame();
                  setShowQuitConfirm(false);
                  navigation.reset({ index: 0, routes: [{ name: 'ModeCarousel' }] });
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Question; 