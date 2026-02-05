// src/app/context/LanguageContext.tsx

"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define types for translations
type Translations = {
  [key: string]: string | Translations;
};

// Define specific types for hero data
interface HeroFeature {
  title: string;
  description: string;
}

interface HeroStats {
  students: string;
  courses: string;
  instructors: string;
  languages: string;
}

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaButton: string;
  features: HeroFeature[];
  stats: HeroStats;
}

// Define the context type
type LanguageContextType = {
  isBangla: boolean;
  toggleLanguage: () => void;
  t: Translations;
  heroData: HeroData | null;
  isLoading: boolean;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isBangla, setIsBangla] = useState(false);
  const [translations, setTranslations] = useState<Translations>({});
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to toggle language
  const toggleLanguage = () => {
    setIsBangla(!isBangla);
  };

  // Load translations based on current language
  const loadTranslations = async (): Promise<Translations> => {
    const lang = isBangla ? "bangla" : "english";

    try {
      // Import all translation files
      const hero = await import(`../data/translations/hero-${lang}.json`);
      const navbar = await import(`../data/translations/navbar-${lang}.json`);
      const common = await import(`../data/translations/common-${lang}.json`);

      // Set hero data separately
      setHeroData(hero.default as HeroData);

      // Merge all translations
      return {
        ...hero.default,
        ...navbar.default,
        ...common.default,
      };
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      return {};
    }
  };

  // Load translations when language changes
  React.useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      const translationsData = await loadTranslations();
      setTranslations(translationsData);
      setIsLoading(false);
    };

    fetchTranslations();
  }, [isBangla]);

  return (
    <LanguageContext.Provider
      value={{ isBangla, toggleLanguage, t: translations, heroData, isLoading }}
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
