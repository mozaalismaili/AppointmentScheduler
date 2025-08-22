import React, { createContext, useContext, useState, useEffect } from 'react';

const LocaleContext = createContext();

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    const saved = localStorage.getItem('locale');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
  };

  const value = {
    locale,
    changeLocale
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};
