import { Question } from '../types';

/**
 * Randomly selects questions from a pack
 * @param questions Full list of questions from a pack
 * @param count Number of questions to select
 * @param playerCount Number of players in the game
 * @returns Array of randomly selected questions
 */
export const pickQuestions = (
  questions: Question[],
  count: number = 30,
  playerCount: number = 2
): Question[] => {
  // Filter questions that have minimum player requirements
  const eligibleQuestions = questions.filter(q => 
    !q.minPlayers || q.minPlayers <= playerCount
  );
  
  // If we don't have enough eligible questions, return all of them
  if (eligibleQuestions.length <= count) {
    return [...eligibleQuestions];
  }
  
  // Shuffle the eligible questions (Fisher-Yates algorithm)
  const shuffled = [...eligibleQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' questions
  return shuffled.slice(0, count);
};

/**
 * Replaces player placeholders in question text
 * @param text Question text with placeholders (e.g. "${player}")
 * @param players Array of player names
 * @returns Formatted text with player names inserted
 */
export const formatQuestionText = (text: string, players: string[]): string => {
  if (!players.length) return text;
  
  // Replace ${player} with a random player name
  return text.replace(/\${player}/g, () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
  });
}; 