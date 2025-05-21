import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Pressable,
  TextInput
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
  
  // Local state
  const [backgroundColor, setBackgroundColor] = useState(currentPack?.color || '#0B0E1A');
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  
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
    // Generate a new background color variation
    if (currentPack?.color) {
      setBackgroundColor(randomColorVariation(currentPack.color, 15, 10, 10));
    }
    
    nextQuestion();
  };
  
  // Format the question text with player names
  const formattedText = currentQuestion 
    ? formatQuestionText(currentQuestion.text, players)
    : '';
  
  // Handle quitting game
  const handleQuit = () => {
    navigation.navigate('ModeCarousel');
  };
  
  // Handle adding a player
  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };
  
  return (
    <View style={[tw`flex-1 justify-center items-center`, { backgroundColor }]}>
      {/* Top navigation bar */}
      <View style={tw`absolute top-12 left-0 right-0 flex-row justify-between px-4`}>
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
        style={tw`px-6 py-8`}
        onPress={handleNextQuestion}
      >
        <Text style={tw`text-white text-center text-2xl font-bold`}>
          {formattedText}
        </Text>
      </Pressable>
      
      {/* Players modal */}
      <Modal
        visible={showPlayersModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPlayersModal(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/70`}>
          <View style={tw`bg-darkBg w-4/5 h-2/3 rounded-xl p-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-white text-lg font-bold`}>
                {t('question.managePlayers')}
              </Text>
              <TouchableOpacity onPress={() => setShowPlayersModal(false)}>
                <Text style={tw`text-white text-xl`}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Player list */}
            <FlatList
              data={players}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <PlayerListItem name={item} onRemove={removePlayer} />
              )}
              style={tw`flex-1 mb-4`}
            />
            
            {/* Add player input */}
            <View style={tw`flex-row mb-4`}>
              <TextInput
                style={tw`flex-1 bg-white/10 text-white rounded-lg px-4 py-3 mr-2`}
                placeholder={t('addPlayers.inputPlaceholder')}
                placeholderTextColor="#ffffff80"
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                maxLength={20}
              />
              <Button
                text={t('addPlayers.addButton')}
                onPress={handleAddPlayer}
                size="small"
              />
            </View>
            
            <Button
              text={t('close')}
              variant="outline"
              onPress={() => setShowPlayersModal(false)}
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Question; 