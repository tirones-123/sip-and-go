import { Question } from '../types';

// Auto-generated map of pack+language to questions.
// Each JSON is statically imported so Metro bundles them.

/* eslint-disable @typescript-eslint/no-var-requires */
const classicEn = require('../../assets/questions/classic.en.json') as Question[];
const classicFr = require('../../assets/questions/classic.fr.json') as Question[];
const girlsEn = require('../../assets/questions/girls.en.json') as Question[];
const girlsFr = require('../../assets/questions/girls.fr.json') as Question[];
const guysEn = require('../../assets/questions/guys.en.json') as Question[];
const guysFr = require('../../assets/questions/guys.fr.json') as Question[];
const spicyEn = require('../../assets/questions/spicy.en.json') as Question[];
const spicyFr = require('../../assets/questions/spicy.fr.json') as Question[];
const couplesEn = require('../../assets/questions/couples.en.json') as Question[];
const couplesFr = require('../../assets/questions/couples.fr.json') as Question[];

export const questionsMap: Record<string, Record<'en' | 'fr', Question[]>> = {
  classic: { en: classicEn, fr: classicFr },
  girls: { en: girlsEn, fr: girlsFr },
  guys: { en: guysEn, fr: guysFr },
  spicy: { en: spicyEn, fr: spicyFr },
  couples: { en: couplesEn, fr: couplesFr },
}; 