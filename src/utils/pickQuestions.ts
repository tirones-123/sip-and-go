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
  count: number = 40,
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

/**
 * Single part of a formatted question – either plain text or a player name.
 */
export interface QuestionPart {
  type: 'text' | 'player';
  value: string;
}

/**
 * Splits a question text into parts so that player placeholders can be styled
 * differently when rendered.
 *
 * @example
 * // Given text "${player} drinks with ${player}!" and players ["Ana", "Bob"]
 * // returns something like:
 * // [ { type: 'player', value: 'Ana' },
 * //   { type: 'text', value: ' drinks with ' },
 * //   { type: 'player', value: 'Bob' },
 * //   { type: 'text', value: '!' } ]
 *
 * @param text Question containing "${player}" placeholders.
 * @param players Active player names.
 */
export const formatQuestionParts = (text: string, players: string[]): QuestionPart[] => {
  if (!players.length) {
    return [{ type: 'text', value: text }];
  }

  // Create a mutable pool so that each name is used once before repetitions
  let available = [...players];

  const parts: QuestionPart[] = [];
  let lastIndex = 0;

  // Regex to find all "${player}" placeholders
  const regex = /\${player}/g;
  let match: RegExpExecArray | null;

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(text)) !== null) {
    const matchStart = match.index;

    // Push preceding static text if any
    if (matchStart > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, matchStart) });
    }

    // Refill pool if empty
    if (available.length === 0) {
      available = [...players];
    }

    // Pick a random player from the remaining pool
    const idx = Math.floor(Math.random() * available.length);
    const playerName = available[idx];
    available.splice(idx, 1);

    parts.push({ type: 'player', value: playerName });

    lastIndex = matchStart + match[0].length;
  }

  // Push remaining text after the last placeholder
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
}; 