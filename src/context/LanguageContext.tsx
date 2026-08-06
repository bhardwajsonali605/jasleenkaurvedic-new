import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (textPa: string, textEn: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('astro_language');
      if (saved === 'en' || saved === 'pa') {
        return saved;
      }
    } catch (e) {
      console.error('LocalStorage error', e);
    }
    return 'pa'; // DEFAULT Punjabi
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('astro_language', newLang);
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  };

  const toggleLang = () => {
    setLang(lang === 'pa' ? 'en' : 'pa');
  };

  const t = (textPa: string, textEn: string) => {
    return lang === 'pa' ? textPa : textEn;
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'pa' ? 'pa' : 'en';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
