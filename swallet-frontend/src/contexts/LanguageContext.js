import React, { createContext, useState, useEffect } from 'react';

// Create LanguageContext
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default language is English (en)
  const [language, setLanguage] = useState(localStorage.getItem('app_language') || 'en');

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
