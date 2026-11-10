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

import { fetchHeroData } from "../services/heroService";

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

import instructorsEnglish from "../data/translations/instructors-english.json";
import instructorsBangla from "../data/translations/instructors-bangla.json";

// --- NEW IMPORT FOR PRIVACY POLICY ---
import privacyEnglish from "../data/translations/privacy-english.json";
import privacyBangla from "../data/translations/privacy-bangla.json";

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

// Inside your LanguageContext.tsx or types file
export interface HeroData {
  title: string;
  subtitle: string;
  ctaButton: string;
  secondaryLink: string;
  cta2: string;
  cta2Btn: string;
  kingImage?: string;       
  kingImageClass?: string;  
  videoId?: string;         
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
    image: string;
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
  instructions: {
    title: string;
    steps: Array<{
      step: string;
      title: string;
      desc: string;
    }>;
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

export interface InstructorsData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    searchPlaceholder: string;
    allBtn: string;
    teamBtn1: string;
    teamBtn2: string;
  };
  instructors: Array<{
    id: number;
    name: string;
    role: string;
    image: string;
    description: string;
  }>;
}

// --- NEW INTERFACE FOR PRIVACY POLICY ---
export interface PrivacyPolicyData {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    lastUpdated: string;
  };
  trustBar: {
    items: { icon: string; text: string }[];
  };
  toc: {
    title: string;
    items: { id: string; label: string }[];
  };
  dataCollection: {
    title: string;
    description: string;
    cards: { icon: string; title: string; description: string }[];
  };
  sections: {
    id: string;
    number: string;
    title: string;
    content: string;
    items?: string[];
  }[];
  security: {
    title: string;
    description: string;
    items: { icon: string; title: string }[];
  };
  contact: {
    title: string;
    description: string;
    button: string;
  };
}

type LanguageContextType = {
  isBangla: boolean;
  currentLang: "en" | "bn";
  toggleLanguage: () => void;
  getLink: (path: string) => string;
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
  singleCourseData: SingleCourseData;
  aboutUsData: AboutUsData;
  instructorsData: InstructorsData;
  privacyData: PrivacyPolicyData;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const getLanguageData = (isBangla: boolean) => {
  const staticHero = (isBangla ? heroBangla : heroEnglish) as HeroData;
  const navbarFull = isBangla ? navbarBangla : navbarEnglish;

  const { menus, ...navbarStrings } = navbarFull || {};

  const common = isBangla ? commonBangla : commonEnglish;
  const faq = isBangla ? faqBangla : faqEnglish;
  const mailchimp = isBangla ? mailchimpBangla : mailchimpEnglish;
  const cta = (isBangla ? ctaBangla : ctaEnglish) as CTAData;

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

  const instructors = (
    isBangla ? instructorsBangla : instructorsEnglish
  ) as InstructorsData;

  const courses = (isBangla ? coursesBangla : coursesEnglish) as CoursesData;

  const singleCourse = (isBangla
    ? singlecourseBangla
    : singlecourseEnglish) as unknown as SingleCourseData;

  const aboutUs = (isBangla ? aboutUsBangla : aboutUsEnglish) as AboutUsData;

  const privacy = (
    isBangla ? privacyBangla : privacyEnglish
  ) as PrivacyPolicyData;

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
    staticHero, // Return as staticHero to be used as a fallback
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
    instructors,
    privacy,
  };
};

interface LanguageProviderProps {
  children: ReactNode;
  initialLang: string;
  initialHeroData?: Partial<HeroData> | null;
}

export const LanguageProvider = ({
  children,
  initialLang,
  initialHeroData,
}: LanguageProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isBangla = initialLang === "bn";
  const currentLang = isBangla ? "bn" : "en";

  const {
    staticHero,
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
    instructors,
    privacy,
  } = useMemo(() => {
    return getLanguageData(isBangla);
  }, [isBangla]);

  // ==========================================
  // FIX: ACTUALLY FETCH DYNAMIC HERO DATA HERE
  // ==========================================
  // SSG: start with hero data baked in at build time, so it renders instantly.
  const [dynamicHeroData, setDynamicHeroData] = useState<HeroData | null>(() =>
    initialHeroData
      ? ({ ...staticHero, ...initialHeroData } as HeroData)
      : null,
  );
  const [isLoading, setIsLoading] = useState(!initialHeroData);

  useEffect(() => {
    const loadDynamicHero = async () => {
      // Silent background refresh when build-time data already exists.
      if (!initialHeroData) setIsLoading(true);
      try {
        const data = await fetchHeroData(currentLang);
        if (data) {
          // Merge static fallback with dynamic DB data
          setDynamicHeroData({ ...staticHero, ...data });
        } else if (!initialHeroData) {
          setDynamicHeroData(staticHero);
        }
      } catch (error) {
        console.error("Failed to fetch dynamic hero data", error);
        if (!initialHeroData) setDynamicHeroData(staticHero);
      } finally {
        setIsLoading(false);
      }
    };

    loadDynamicHero();
  }, [currentLang, staticHero]);

  const getLink = (path: string) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${currentLang}${cleanPath}`;
  };

  const toggleLanguage = () => {
    const scrollY = window.scrollY;
    const currentLangStr = isBangla ? "bn" : "en";
    const newLang = isBangla ? "en" : "bn";

    let newPath = "";

    if (pathname === "/" || pathname === "") {
      newPath = `/${newLang}`;
    } else if (pathname.startsWith(`/${currentLangStr}`)) {
      newPath = pathname.replace(`/${currentLangStr}`, `/${newLang}`);
    } else {
      newPath = `/${newLang}${pathname}`;
    }

    router.push(newPath);

    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 50);
  };

  return (
    <LanguageContext.Provider
      value={{
        isBangla,
        currentLang: currentLang as "en" | "bn",
        toggleLanguage,
        getLink,
        t: merged,
        heroData: dynamicHeroData, // Use the dynamic state here!
        isLoading: isLoading,      // Use the dynamic loading state here!
        menuData: menu,
        featureCourses: featureCourses || ({} as FeatureCoursesData),
        featuresData: features || ({} as FeaturesData),
        coursesData: courses || ({} as CoursesData),
        libraryData: library || ({} as LibraryData),
        littleChampsData: littleChamps || ({} as LittleChampsData),
        offlineData: offline || ({} as OfflineCoursesData),
        ctaData: cta || ({} as CTAData),
        footerData: footer || ({} as FooterData),
        singleCourseData: singleCourse || ({} as SingleCourseData),
        aboutUsData: aboutUs || ({} as AboutUsData),
        instructorsData: instructors || ({} as InstructorsData),
        privacyData: privacy || ({} as PrivacyPolicyData),
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
