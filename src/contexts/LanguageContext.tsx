
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, LanguageContextType } from './types/language';
import { translations } from './translations';
import { createFormatPrice } from './utils/formatters';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const formatPrice = createFormatPrice(language, t);

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    formatPrice
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Re-export types for convenience
export type { Language } from './types/language';
