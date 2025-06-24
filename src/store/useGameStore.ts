import { create } from 'zustand';
import { GameStore, Pack, Question } from '../types';
import { pickQuestions } from '../utils/pickQuestions';
import { trackGameStart, trackPackSelect } from '../utils/analytics';
import { getLanguage } from '../utils/i18n';
import { questionsMap } from '../utils/questions';
import { isWeb } from '../utils/platform';

// Default packs
const DEFAULT_PACKS: Pack[] = [
  {
    id: 'classic',
    title: 'Classic',
    description: 'The original drinking game with simple challenges',
    color: '#e0b151',
    access: 'FREE'
  },
  {
    id: 'girls',
    title: 'Entre filles',
    description: 'Perfect for girls night out',
    color: '#e4325f',
    access: isWeb ? 'FREE' : 'LOCKED'
  },
  {
    id: 'guys',
    title: 'Entre gars',
    description: 'For the boys only',
    color: '#A54429',
    access: isWeb ? 'FREE' : 'LOCKED'
  },
  {
    id: 'spicy',
    title: 'Spicy',
    description: 'Hot questions to spice up your night',
    color: '#660000',
    access: isWeb ? 'FREE' : 'LOCKED'
  },
  {
    id: 'couples',
    title: 'En couple',
    description: 'Perfect for dates and couples',
    color: '#1c27ef',
    access: isWeb ? 'FREE' : 'LOCKED'
  }
];

// Initial state
const initialState = {
  players: [],
  packs: DEFAULT_PACKS,
  premium: false,
  currentQuestions: [],
  currentQuestionIndex: 0,
  isGameStarted: false
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  
  /**
   * Add a player to the game
   */
  addPlayer: (name) => {
    if (!name.trim()) return;
    
    // Check if player already exists
    const { players } = get();
    if (players.includes(name)) return;
    
    set(state => ({ 
      players: [...state.players, name] 
    }));
  },
  
  /**
   * Remove a player from the game
   */
  removePlayer: (name) => {
    set(state => ({ 
      players: state.players.filter(player => player !== name) 
    }));
  },
  
  /**
   * Start a game with the selected pack
   */
  startPack: async (packId) => {
    const { packs, players, premium } = get();
    const selectedPack = packs.find(p => p.id === packId);
    
    if (!selectedPack) return;
    
    // Check if locked pack and no premium
    if (selectedPack.access === 'LOCKED' && !premium) {
      return;
    }
    
    // Track analytics
    trackPackSelect(packId, premium);
    trackGameStart(players.length);
    
    const lang = getLanguage();

    const allPackQuestions: Question[] = questionsMap[packId]?.[lang] ?? [];

    // Select random questions for the game session (25 per game)
    const selectedQuestions = pickQuestions(allPackQuestions, 25, players.length);

    set({
      currentPack: selectedPack,
      currentQuestions: selectedQuestions,
      currentQuestionIndex: 0,
      isGameStarted: true
    });
  },
  
  /**
   * Move to the next question
   */
  nextQuestion: () => {
    const { currentQuestionIndex, currentQuestions } = get();
    const nextIndex = currentQuestionIndex + 1;
    
    // Check if we've reached the end of the questions
    if (nextIndex >= currentQuestions.length) {
      // Loop back to start when reaching the end
      set({ currentQuestionIndex: 0 });
    } else {
      set({ currentQuestionIndex: nextIndex });
    }
  },
  
  /**
   * Reset the game state
   */
  resetGame: () => {
    set({
      currentPack: undefined,
      currentQuestions: [],
      currentQuestionIndex: 0,
      isGameStarted: false
    });
  },
  
  /**
   * Set premium status
   */
  setPremium: (isPremium) => {
    set({ premium: isPremium });
  }
})); 