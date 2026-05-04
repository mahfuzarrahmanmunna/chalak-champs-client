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
type Translations = {
  [key: string]: string | Translations;
};

interface MenuItem {
  title: string;
  description: string;
}

interface MenuData {
  courses: MenuItem[];
  skills: MenuItem[];
  kids: MenuItem[];
  more: MenuItem[];
}

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
  t: Record<string, string>;
  heroData: HeroData | null;
  isLoading: boolean;
  menuData: MenuData;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const getLanguageData = (isBangla: boolean) => {
  const hero = (isBangla ? heroBangla : heroEnglish) as HeroData;
  const navbarFull = isBangla ? navbarBangla : navbarEnglish;

  // FIX: Destructure safely. If navbarFull is null/undefined, default to empty object.
  const { menus, ...navbarStrings } = navbarFull || {};

  const common = isBangla ? commonBangla : commonEnglish;
  const faq = isBangla ? faqBangla : faqEnglish;
  const mailchimp = isBangla ? mailchimpBangla : mailchimpEnglish;

  const merged = {
    ...(navbarStrings as unknown as Translations),
    ...(common as unknown as Translations),
    ...(faq as unknown as Translations),
    ...(mailchimp as unknown as Translations),
  } as Record<string, string>;

  // FIX: Provide a default fallback for menuData to prevent "undefined" errors
  const defaultMenu: MenuData = {
    courses: [],
    skills: [],
    kids: [],
    more: [], // Ensures .more exists even if JSON is missing it
  };

  const menu = { ...defaultMenu, ...(menus as MenuData) };

  return { hero, merged, menu };
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isBangla, setIsBangla] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language");
      return storedLang === "bangla";
    }
    return false;
  });

  const { hero, merged, menu } = useMemo(() => {
    return getLanguageData(isBangla);
  }, [isBangla]);

  const toggleLanguage = () => {
    setIsBangla((prev) => {
      const newValue = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("language", newValue ? "bangla" : "english");
      }
      return newValue;
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        isBangla,
        toggleLanguage,
        t: merged,
        heroData: hero,
        isLoading: false,
        menuData: menu,
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
