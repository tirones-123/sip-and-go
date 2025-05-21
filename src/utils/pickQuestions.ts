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
  
  // Prepare a mutable pool so that each name is used once before any repeats
  let available = [...players];

  return text.replace(/\${player}/g, () => {
    // Refill the pool if we have run out (needed when there are
    // more placeholders than distinct players)
    if (available.length === 0) {
      available = [...players];
    }

    // Pick a random index from the remaining available players
    const index = Math.floor(Math.random() * available.length);
    const name = available[index];

    // Remove the selected name to avoid duplicates until pool resets
    available.splice(index, 1);

    return name;
  });
}; 