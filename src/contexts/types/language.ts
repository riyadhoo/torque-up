
export type Language = 'en' | 'fr' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
}

export interface LanguageConfig {
  code: Language;
  name: string;
  flag: string;
}
