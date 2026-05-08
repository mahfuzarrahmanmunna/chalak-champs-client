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

import featuresEnglish from "../data/translations/features-english.json";
import featuresBangla from "../data/translations/features-bangla.json";

import coursesEnglish from "../data/translations/courses-english.json";
import coursesBangla from "../data/translations/courses-bangla.json";

import libraryEnglish from "../data/translations/library-english.json";
import libraryBangla from "../data/translations/library-bangla.json";

import littleChampsEnglish from "../data/translations/littlechamps-english.json";
import littleChampsBangla from "../data/translations/littlechamps-bangla.json";

import offlineEnglish from "../data/translations/offline-english.json";
import offlineBangla from "../data/translations/offline-bangla.json";

import ctaEnglish from "../data/translations/cta-english.json";
import ctaBangla from "../data/translations/cta-bangla.json";

import footerEnglish from "../data/translations/footer-english.json";
import footerBangla from "../data/translations/footer-bangla.json";

// --- NEW IMPORTS FOR SINGLE COURSE ---
import singlecourseEnglish from "../data/translations/singlecourse-english.json";
import singlecourseBangla from "../data/translations/singlecourse-bangla.json";


import aboutUsEnglish from "../data/translations/aboutus-english.json";
import aboutUsBangla from "../data/translations/aboutus-bangla.json";


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
  cta2: string;
  cta2Btn: string;
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

interface LittleChampsData {
  title: {
    prefix: string;
    highlight: string;
    suffix: string;
  };
  cards: {
    id: number;
    title: string; // Can contain HTML like <br />
    alt: string;
  }[];
}

interface OfflineCoursesData {
  header: {
    prefix: string;
    highlight: string;
  };
  cta: string;
  cards: {
    id: number;
    title: string;
    desc: string;
  }[];
  whyUs: {
    title: string;
    highlight: string;
    points: Array<{
      id: number;
      text?: string;
      quote?: string;
      desc?: string;
    }>;
    imageAlt: string;
  };
}

interface CTAData {
  form: {
    title: string;
    studentName: string;
    fatherName: string;
    phone: string;
    class: string;
    course: string;
    cta: string;
  };
  needHelp: {
    title: string;
    desc: string;
    cta: string;
    subCta: string;
  };
  videoLibrary: {
    title: string;
    cta: string;
  };
  facebook: {
    title: string;
    cta: string;
  };
}

interface FooterData {
  about: {
    title: string;
    tagline: string;
  };
  links: Array<{
    title: string;
    items: string[];
  }>;
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  socials: {
    facebook: string;
    youtube: string;
    linkedin: string;
    instagram: string;
  };
  copyright: string;
}

export interface AboutUsData {
  hero: {
    title: string;
    subtitle: string;
  };
  whoWeAre: {
    title: string;
    bangla: string;
    english: string;
  };
  missionVision: {
    title: string;
    mission: {
      title: string;
      bangla: string;
      english: string;
    };
    vision: {
      title: string;
      bangla: string;
      english: string;
    };
    // Adding a 3rd card for balance based on content
    values: {
      title: string;
      bangla: string;
      english: string;
    };
  };
  whatWeOffer: {
    title: string;
    introBangla: string;
    introEnglish: string;
    tagsBangla: string;
    tagsEnglish: string;
  };
  cta: {
    title: string;
    body: string;
    cta1: string;
    cta2: string;
    below: string;
  };
}

// --- NEW INTERFACE FOR SINGLE COURSE PAGE ---
// Defining it exactly based on your provided JSON structure
export interface SingleCourseData {
  breadcrumb: string;
  hero: {
    title: string;
    subtitle: string;
  };
  quickInfo: {
    title: string;
    items: string[];
    offerPrice: string;
    offerText: string;
    cta1: string;
    cta2: string;
    ctaBelow: string;
  };
  overview: {
    title: string;
    content: string;
  };
  levels: {
    title: string;
    intro: string;
    level1: {
      title: string;
      for: string;
      intro: string;
      items: string[];
    };
    level2: {
      title: string;
      for: string;
      intro: string;
      items: string[];
    };
  };
  whoIsThisFor: {
    title: string;
    intro: string;
    items: string[];
    boldStatement: string;
  };
  features: {
    title: string;
    cards: Array<{
      title: string;
      body: string;
    }>;
  };
  syllabus: {
    title: string;
    content: string;
  };
  finalCta: {
    title: string;
    body: string;
    cta1: string;
    cta2: string;
    cta3: string;
    ctaBelow: string;
  };
  payment: {
    title: string;
    description: string;
  };
  instructor: {
    title: string;
    info: string;
  };
  review: {
    title: string;
  };
  faq: {
    title: string;
    items: Array<{
      q: string;
      a: string;
    }>;
  };
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
  featuresData: FeaturesData;
  coursesData: CoursesData;
  libraryData: LibraryData;
  littleChampsData: LittleChampsData;
  offlineData: OfflineCoursesData;
  ctaData: CTAData;
  footerData: FooterData;
  // Added singleCourseData to context type
  singleCourseData: SingleCourseData;
  aboutUsData: AboutUsData;
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
  const cta = (isBangla ? ctaBangla : ctaEnglish) as CTAData;
  // Extract featureCourses from common
  const { featureCourses, ...commonStrings } = common || {};
  const footer = (isBangla ? footerBangla : footerEnglish) as FooterData;

  const features = (
    isBangla ? featuresBangla : featuresEnglish
  ) as FeaturesData;

  const library = (isBangla ? libraryBangla : libraryEnglish) as LibraryData;
  const littleChamps = (
    isBangla ? littleChampsBangla : littleChampsEnglish
  ) as LittleChampsData;

  const offline = (
    isBangla ? offlineBangla : offlineEnglish
  ) as OfflineCoursesData;

  const courses = (isBangla ? coursesBangla : coursesEnglish) as CoursesData;

  // --- GET SINGLE COURSE DATA ---
  const singleCourse = (
    isBangla ? singlecourseBangla : singlecourseEnglish
  ) as SingleCourseData;

  const aboutUs = (isBangla ? aboutUsBangla : aboutUsEnglish) as AboutUsData;

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

  return {
    hero,
    merged,
    menu,
    featureCourses,
    features,
    courses,
    library,
    littleChamps,
    offline,
    cta,
    footer,
    singleCourse, // Return the single course data
    aboutUs,
  };
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

  const [isBangla, setIsBangla] = useState<boolean>(initialLang === "bn");

  useEffect(() => {
    setIsBangla(initialLang === "bn");
  }, [initialLang]);

  const {
    hero,
    merged,
    menu,
    featureCourses,
    features,
    courses,
    library,
    littleChamps,
    offline,
    cta,
    footer,
    singleCourse,
    aboutUs,
  } = useMemo(() => {
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
        featuresData: features || ({} as FeaturesData),
        coursesData: courses || ({} as CoursesData),
        libraryData: library || ({} as LibraryData),
        littleChampsData: littleChamps || ({} as LittleChampsData),
        offlineData: offline || ({} as OfflineCoursesData),
        ctaData: cta || ({} as CTAData),
        footerData: footer || ({} as FooterData),
        singleCourseData: singleCourse || ({} as SingleCourseData), // Provide to context
        aboutUsData: aboutUs || ({} as AboutUsData),
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
