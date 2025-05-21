import * as Localization from 'expo-localization';
import { useState, useEffect } from 'react';
import en from '../strings/en';
import fr from '../strings/fr';

// Available languages
const strings: Record<string, typeof en> = {
  en,
  fr,
};

// Default to system language, fallback to English
export const getSystemLanguage = (): 'en' | 'fr' => {
  const locale = Localization.locale.split('-')[0];
  return locale === 'fr' ? 'fr' : 'en';
};

// Current language (initially from system)
let currentLang = getSystemLanguage();

/**
 * Set the app language
 * @param lang Language code ('en' or 'fr')
 */
export const setLanguage = (lang: 'en' | 'fr'): void => {
  currentLang = lang;
};

/**
 * Get the current language
 * @returns Current language code
 */
export const getLanguage = (): 'en' | 'fr' => currentLang;

/**
 * Translation hook for components
 * @returns Translation function and current language
 */
export const useTranslation = () => {
  const [lang, setLang] = useState(currentLang);
  
  // Update component if language changes
  useEffect(() => {
    const checkLanguage = () => {
      if (currentLang !== lang) {
        setLang(currentLang);
      }
    };
    
    // Check for changes every 1 second
    const interval = setInterval(checkLanguage, 1000);
    return () => clearInterval(interval);
  }, [lang]);
  
  /**
   * Get a translated string by key
   * @param key Dot-notation path to the string (e.g. 'addPlayers.title')
   * @param params Optional parameters to replace placeholders in the string
   */
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = strings[lang];
    
    // Traverse the object to find the string
    for (const k of keys) {
      if (value && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    // Replace placeholders with parameters
    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce(
        (str, [key, val]) => str.replace(new RegExp(`{{${key}}}`, 'g'), String(val)),
        value
      );
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  return { t, lang };
}; 