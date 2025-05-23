import { create } from 'zustand';
import { GameStore, Pack, Question } from '../types';
import { pickQuestions } from '../utils/pickQuestions';
import { trackGameStart, trackPackSelect } from '../utils/analytics';

// Default packs
const DEFAULT_PACKS: Pack[] = [
  {
    id: 'classic',
    title: 'Classic',
    description: 'The original drinking game with simple challenges',
    color: '#F3C53F',
    access: 'FREE'
  },
  {
    id: 'girls',
    title: 'Entre filles',
    description: 'Perfect for girls night out',
    color: '#E84D8A', // Reusing the Party blue color
    access: 'LOCKED'
  },
  {
    id: 'guys',
    title: 'Entre gars',
    description: 'For the boys only',
    color: '#4A8FE7', // Reusing the Extreme color
    access: 'LOCKED'
  },
  {
    id: 'spicy',
    title: 'Spicy',
    description: 'Hot questions to spice up your night',
    color: '#E35152',
    access: 'LOCKED'
  },
  {
    id: 'couples',
    title: 'En couple',
    description: 'Perfect for dates and couples',
    color: '#9C5BD1',
    access: 'LOCKED'
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
    
    // We'll simulate loading questions
    // In a real implementation, we would use the useQuestions hook
    const mockQuestions: Question[] = Array(30).fill(0).map((_, i) => ({
      id: `${packId}-${i}`,
      text: `${packId} question ${i + 1}`,
      pack: packId
    }));
    
    // Select random questions for the game session
    const selectedQuestions = pickQuestions(mockQuestions, 30, players.length);
    
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