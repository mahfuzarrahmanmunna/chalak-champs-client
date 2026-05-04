"use client";

import {
  createContext,
  useState,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";

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

// --- Feature Courses Interface ---
interface FeatureCoursesData {
  title: string;
  suffix?: string;
  discount: string;
  discountNote: string;
  subtitle: string;
  points: string[];
  cta: string;
  contact: string;
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

// --- Fix: Removed 'description' from HeroData ---
interface HeroData {
  title: string;
  subtitle: string;
  ctaButton: string;
  secondaryLink: string;
  features: HeroFeature[];
  stats: HeroStats;
}

type LanguageContextType = {
  isBangla: boolean;
  currentLang: "en" | "bn";
  toggleLanguage: () => void;
  t: Record<string, string>;
  heroData: HeroData | null;
  isLoading: boolean;
  menuData: MenuData;
  featureCourses: FeatureCoursesData;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const getLanguageData = (isBangla: boolean) => {
  const hero = (isBangla ? heroBangla : heroEnglish) as HeroData;
  const navbarFull = isBangla ? navbarBangla : navbarEnglish;

  const { menus, ...navbarStrings } = navbarFull || {};

  const common = isBangla ? commonBangla : commonEnglish;
  const faq = isBangla ? faqBangla : faqEnglish;
  const mailchimp = isBangla ? mailchimpBangla : mailchimpEnglish;

  // Extract featureCourses from common
  const { featureCourses, ...commonStrings } = common || {};

  const merged = {
    ...(navbarStrings as unknown as Translations),
    ...(commonStrings as unknown as Translations),
    ...(faq as unknown as Translations),
    ...(mailchimp as unknown as Translations),
  } as Record<string, string>;

  const defaultMenu: MenuData = {
    courses: [],
    skills: [],
    kids: [],
    more: [],
  };

  const menu = { ...defaultMenu, ...(menus as MenuData) };

  return { hero, merged, menu, featureCourses };
};

interface LanguageProviderProps {
  children: ReactNode;
  initialLang: string;
}

export const LanguageProvider = ({
  children,
  initialLang,
}: LanguageProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine state based on the URL 'initialLang' passed from layout
  const [isBangla, setIsBangla] = useState<boolean>(initialLang === "bn");

  // Sync state if URL changes (e.g. via back button)
  useEffect(() => {
    setIsBangla(initialLang === "bn");
  }, [initialLang]);

  const { hero, merged, menu, featureCourses } = useMemo(() => {
    return getLanguageData(isBangla);
  }, [isBangla]);

  const toggleLanguage = () => {
    // --- FIX FOR SCROLL JUMP ---
    // 1. Current scroll position save koro
    const scrollY = window.scrollY;

    // Logic to switch /en/ to /bn/ or vice versa
    const currentLang = isBangla ? "bn" : "en";
    const newLang = isBangla ? "en" : "bn";

    // Replace the language segment in the current path
    // pathname will be something like "/en/courses"
    if (pathname.startsWith(`/${currentLang}`)) {
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      router.push(newPath);
    } else {
      // Fallback
      router.push(`/${newLang}`);
    }

    // 2. Scroll position restore koro
    // Next.js router push hote some time lag thake, tai setTimeout use kora safe.
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 50);
  };

  return (
    <LanguageContext.Provider
      value={{
        isBangla,
        currentLang: isBangla ? "bn" : "en",
        toggleLanguage,
        t: merged,
        heroData: hero,
        isLoading: false,
        menuData: menu,
        featureCourses: featureCourses || ({} as FeatureCoursesData),
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
