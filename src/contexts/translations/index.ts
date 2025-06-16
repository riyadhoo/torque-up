
import { enTranslations } from './en';
import { frTranslations } from './fr';
import { arTranslations } from './ar';
import { Language } from '../types/language';

export const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations
};
