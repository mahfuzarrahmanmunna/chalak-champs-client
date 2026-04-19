"use client";

import { createContext, useState, useContext, useMemo, ReactNode } from "react";

// Imports
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

// Types
// We keep Translations for the raw JSON types, but restrict the Context output
type Translations = {
  [key: string]: string | Translations;
};

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

type LanguageContextType = {
  isBangla: boolean;
  toggleLanguage: () => void;
  // FIX: Explicitly type 't' as a flat Record of strings.
  // This fixes the error in Navbar1.tsx because 't.courses' will now be known as a string.
  t: Record<string, string>;
  heroData: HeroData | null;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const getLanguageData = (isBangla: boolean) => {
  const hero = (isBangla ? heroBangla : heroEnglish) as HeroData;
  const navbar = isBangla ? navbarBangla : navbarEnglish;
  const common = isBangla ? commonBangla : commonEnglish;
  const faq = isBangla ? faqBangla : faqEnglish;
  const mailchimp = isBangla ? mailchimpBangla : mailchimpEnglish;

  // FIX: Only merge the FLAT translation files (navbar, common, faq, mailchimp) into 't'.
  // We remove 'hero' from 'merged' because 'hero' contains nested objects (arrays, stats)
  // which are not strings. 'hero' is already handled by the 'hero' return variable.
  const merged = {
    ...(navbar as unknown as Translations),
    ...(common as unknown as Translations),
    ...(faq as unknown as Translations),
    ...(mailchimp as unknown as Translations),
  } as Record<string, string>;

  return { hero, merged };
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isBangla, setIsBangla] = useState(false);

  const { hero, merged } = useMemo(() => {
    return getLanguageData(isBangla);
  }, [isBangla]);

  const toggleLanguage = () => {
    setIsBangla((prev) => !prev);
  };

  return (
    <LanguageContext.Provider
      value={{
        isBangla,
        toggleLanguage,
        t: merged,
        heroData: hero,
        isLoading: false,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
