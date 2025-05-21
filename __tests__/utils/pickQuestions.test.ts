import { pickQuestions, formatQuestionText } from '../../src/utils/pickQuestions';
import { Question } from '../../src/types';

// Sample questions for testing
const mockQuestions: Question[] = [
  { id: '1', text: 'Question 1', pack: 'classic' },
  { id: '2', text: 'Question 2', pack: 'classic' },
  { id: '3', text: 'Question 3', pack: 'classic' },
  { id: '4', text: 'Question 4', pack: 'classic' },
  { id: '5', text: 'Question 5', pack: 'classic' },
  { id: '6', text: 'Question for 3+ players', minPlayers: 3, pack: 'classic' },
  { id: '7', text: 'Question for 4+ players', minPlayers: 4, pack: 'classic' },
];

describe('pickQuestions', () => {
  it('returns the requested number of questions', () => {
    const result = pickQuestions(mockQuestions, 3, 2);
    expect(result).toHaveLength(3);
  });
  
  it('returns questions that respect minPlayers requirement', () => {
    const result = pickQuestions(mockQuestions, 5, 2);
    // All questions should have minPlayers <= 2 or undefined
    expect(result.every(q => !q.minPlayers || q.minPlayers <= 2)).toBe(true);
  });
  
  it('returns all eligible questions when count exceeds available questions', () => {
    const result = pickQuestions(mockQuestions, 10, 2);
    // Should return 5 questions (the ones without minPlayers or minPlayers <= 2)
    expect(result).toHaveLength(5);
  });
  
  it('includes questions with higher player counts when enough players', () => {
    const result = pickQuestions(mockQuestions, 10, 4);
    // Should include all questions
    expect(result).toHaveLength(7);
  });
  
  it('returns unique questions (no duplicates)', () => {
    const result = pickQuestions(mockQuestions, 5, 2);
    const uniqueIds = new Set(result.map(q => q.id));
    expect(uniqueIds.size).toBe(result.length);
  });
});

describe('formatQuestionText', () => {
  it('replaces ${player} placeholder with a player name', () => {
    const players = ['Alice', 'Bob'];
    const result = formatQuestionText('${player} drinks 2 sips!', players);
    
    // Result should be either "Alice drinks 2 sips!" or "Bob drinks 2 sips!"
    expect(['Alice drinks 2 sips!', 'Bob drinks 2 sips!']).toContain(result);
  });
  
  it('handles multiple ${player} placeholders', () => {
    const players = ['Alice', 'Bob'];
    const result = formatQuestionText('${player} gives ${player} a drink!', players);
    
    // Check if result contains at least one player name
    const containsAlice = result.includes('Alice');
    const containsBob = result.includes('Bob');
    expect(containsAlice || containsBob).toBe(true);
    
    // Check if result starts with a player name
    expect(result.startsWith('Alice') || result.startsWith('Bob')).toBe(true);
  });
  
  it('returns original text when no players provided', () => {
    const result = formatQuestionText('${player} drinks!', []);
    expect(result).toBe('${player} drinks!');
  });
}); 