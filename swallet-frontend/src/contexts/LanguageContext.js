import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
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
