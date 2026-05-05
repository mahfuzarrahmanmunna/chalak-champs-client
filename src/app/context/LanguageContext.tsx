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

// --- NEW IMPORTS ---
import featuresEnglish from "../data/translations/features-english.json";
import featuresBangla from "../data/translations/features-bangla.json";

import coursesEnglish from "../data/translations/courses-english.json";
import coursesBangla from "../data/translations/courses-bangla.json";

import libraryEnglish from "../data/translations/library-english.json";
import libraryBangla from "../data/translations/library-bangla.json";


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

// --- NEW INTERFACE FOR FEATURES SECTION ---
interface FeaturesData {
  titlePrefix: string;
  titleSuffix: string;
  shortDescription: string;
  cta: string;
  cards: {
    id: number;
    title: string;
    subtitle: string;
    image: string;
  }[];
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
  ctaButton: string;
  secondaryLink: string;
  features: HeroFeature[];
  stats: HeroStats;
}

interface CoursesData {
  titlePrefix: string;
  titleSuffix: string;
  shortDescription: string;
  tabs: string[];
  ctaCard: string;
  ctaFooter: string;
  footerNote: string;
  courses: {
    id: number;
    title: string;
    category: string;
    highlights: string[];
    image: string;
  }[];
}

interface LibraryData {
  titlePrefix: string;
  titleSuffix: string;
  shortDescription: string;
  ctaCard: string;
  ctaFooter: string;
  items: {
    id: number;
    image: string;
    badge: string;
    title: string;
  }[];
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
  // Added featuresData to context type
  featuresData: FeaturesData;
  coursesData: CoursesData;
  libraryData: LibraryData;
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

    const library = (isBangla ? libraryBangla : libraryEnglish) as LibraryData;


  // --- GET FEATURES DATA ---
  const features = (
    isBangla ? featuresBangla : featuresEnglish
  ) as FeaturesData;

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

  return { hero, merged, menu, featureCourses, features, library };
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

  const { hero, merged, menu, featureCourses, features, library } = useMemo(() => {
    return getLanguageData(isBangla);
  }, [isBangla]);

  const toggleLanguage = () => {
    const scrollY = window.scrollY;
    const currentLang = isBangla ? "bn" : "en";
    const newLang = isBangla ? "en" : "bn";

    if (pathname.startsWith(`/${currentLang}`)) {
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      router.push(newPath);
    } else {
      router.push(`/${newLang}`);
    }

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
        featuresData: features || ({} as FeaturesData), // Pass features data
        coursesData: (isBangla ? coursesBangla : coursesEnglish) || ({} as CoursesData),
        libraryData: library || ({} as LibraryData),
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
