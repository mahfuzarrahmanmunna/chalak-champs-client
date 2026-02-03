"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define types for translations
type Translations = {
  [key: string]: string | Translations;
};

// Define the context type
type LanguageContextType = {
  isBangla: boolean;
  toggleLanguage: () => void;
  t: Translations;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isBangla, setIsBangla] = useState(false);

  // Function to toggle language
  const toggleLanguage = () => {
    setIsBangla(!isBangla);
  };

  // Load translations based on current language
  const loadTranslations = async (): Promise<Translations> => {
    const lang = isBangla ? "bangla" : "english";

    try {
      // Import all translation files
      const navbar = await import(`../data/translations/navbar-${lang}.json`);
      const common = await import(`../data/translations/common-${lang}.json`);

      // Merge all translations
      return {
        ...navbar.default,
        ...common.default,
      };
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      return {};
    }
  };

  // We'll use a state to store translations
  const [translations, setTranslations] = useState<Translations>({});

  // Load translations when language changes
  React.useEffect(() => {
    loadTranslations().then(setTranslations);
  }, [isBangla]);

  return (
    <LanguageContext.Provider
      value={{ isBangla, toggleLanguage, t: translations }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
