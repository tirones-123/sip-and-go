/**
 * Game pack definition
 */
export interface Pack {
  id: string;
  title: string;
  description: string;
  color: string;
  access: 'FREE' | 'LOCKED';
}

/**
 * Question definition
 */
export interface Question {
  id: string;
  text: string;
  minPlayers?: number;
  pack: string;
}

/**
 * Game store state
 */
export interface GameState {
  players: string[];
  packs: Pack[];
  premium: boolean;
  currentPack?: Pack;
  currentQuestions: Question[];
  currentQuestionIndex: number;
  isGameStarted: boolean;
}

/**
 * Game store actions
 */
export interface GameActions {
  addPlayer: (name: string) => void;
  removePlayer: (name: string) => void;
  startPack: (packId: string) => void;
  nextQuestion: () => void;
  resetGame: () => void;
  setPremium: (isPremium: boolean) => void;
}

/**
 * Combined game store
 */
export type GameStore = GameState & GameActions; 