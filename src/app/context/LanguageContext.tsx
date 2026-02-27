// src/app/context/LanguageContext.tsx

"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

import heroEnglish from "../data/translations/hero-english.json";
import heroBangla from "../data/translations/hero-bangla.json";
import navbarEnglish from "../data/translations/navbar-english.json";
import navbarBangla from "../data/translations/navbar-bangla.json";
import commonEnglish from "../data/translations/common-english.json";
import commonBangla from "../data/translations/common-bangla.json";
import faqEnglish from "../data/translations/faq-english.json";
import faqBangla from "../data/translations/faq-bangla.json";
import mailchimpEnglish from "../data/translations/mailchimp-english.json";
import mailchimpBangla from "../data/translations/mailchimp-bangla.json";

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

// Helper to get all translations for a language
const getLanguageData = (isBangla: boolean) => {
  const hero = (isBangla ? heroBangla : heroEnglish) as HeroData;
  const navbar = isBangla ? navbarBangla : navbarEnglish;
  const common = isBangla ? commonBangla : commonEnglish;
  const faq = isBangla ? faqBangla : faqEnglish;
  const mailchimp = isBangla ? mailchimpBangla : mailchimpEnglish;

  const merged: Translations = {
    ...(hero as unknown as Translations),
    ...(navbar as unknown as Translations),
    ...(common as unknown as Translations),
    ...(faq as unknown as Translations),
    ...(mailchimp as unknown as Translations),
  };

  return { hero, merged };
};

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isBangla, setIsBangla] = useState(false);
  const [{ hero, merged }] = useState(() => getLanguageData(false));
  const [translations, setTranslations] = useState<Translations>(merged);
  const [heroData, setHeroData] = useState<HeroData | null>(hero);
  const [isLoading, setIsLoading] = useState(false);

  // Function to toggle language
  const toggleLanguage = () => {
    setIsBangla((prev) => !prev);
  };

  // Update translations when language changes
  React.useEffect(() => {
    setIsLoading(true);
    const { hero: newHero, merged: newMerged } = getLanguageData(isBangla);
    setHeroData(newHero);
    setTranslations(newMerged);
    setIsLoading(false);
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
