import { useState, useEffect } from 'react';
import { Question } from '../types';
import { getLanguage } from '../utils/i18n';

/**
 * Hook to load questions from a specific pack
 * @param packId The ID of the pack to load
 * @returns Array of questions and loading state
 */
export const useQuestions = (packId: string): { 
  questions: Question[]; 
  isLoading: boolean; 
  error: string | null 
} => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get current language
        const lang = getLanguage();
        
        // Dynamic import of the JSON file based on pack and language
        const questionsData = await import(`../../assets/questions/${packId}.${lang}.json`);
        
        // Ensure the loaded data is properly typed
        const typedQuestions: Question[] = Array.isArray(questionsData.default) 
          ? questionsData.default 
          : [];
        
        setQuestions(typedQuestions);
      } catch (err) {
        console.error(`Failed to load questions for pack ${packId}:`, err);
        setError(`Failed to load questions. Please try again.`);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (packId) {
      loadQuestions();
    }
  }, [packId]);
  
  return { questions, isLoading, error };
}; 