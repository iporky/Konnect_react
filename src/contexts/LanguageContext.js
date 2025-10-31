import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBestSpeechLanguage } from '../utils/speechLanguages';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Default to English, but load from localStorage if available
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const saved = localStorage.getItem('selectedLanguage');
    return saved || 'English (English)';
  });

  // Get speech recognition language code
  const speechLanguageCode = getBestSpeechLanguage(selectedLanguage);

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  const value = {
    selectedLanguage,
    setSelectedLanguage,
    speechLanguageCode,
    displayName: selectedLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;