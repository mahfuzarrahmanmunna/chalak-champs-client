// src/app/context/DataProvider.tsx

"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useLoading } from "./LoadingContext";
import { useLanguage } from "./LanguageContext";

// Define types for all data
interface AllData {
  heroData: any;
  navbarData: any;
  commonData: any;
  blogData: any;
  coursesData: any;
  // Add other data types as needed
}

type DataContextType = {
  data: AllData;
  isDataLoaded: boolean;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<AllData>({
    heroData: null,
    navbarData: null,
    commonData: null,
    blogData: null,
    coursesData: null,
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { incrementLoading, decrementLoading } = useLoading();
  const { isBangla } = useLanguage();

  // Load all data when language changes
  useEffect(() => {
    const loadAllData = async () => {
      incrementLoading();
      try {
        const lang = isBangla ? "bn" : "en";

        // Load all data in parallel
        const [heroData, navbarData, commonData, blogData, coursesData] =
          await Promise.all([
            import(`../data/translations/hero-${lang}.json`).catch(() => ({
              default: null,
            })),
            import(`../data/translations/navbar-${lang}.json`).catch(() => ({
              default: null,
            })),
            import(`../data/translations/common-${lang}.json`).catch(() => ({
              default: null,
            })),
            import(`../data/blog-${lang}.json`).catch(() => ({ default: [] })),
            import(`../data/courses-${lang}.json`).catch(() => ({
              default: [],
            })),
          ]);

        setData({
          heroData: heroData?.default || null,
          navbarData: navbarData?.default || null,
          commonData: commonData?.default || null,
          blogData: blogData?.default || [],
          coursesData: coursesData?.default || [],
        });
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        decrementLoading();
      }
    };

    loadAllData();
  }, [isBangla, incrementLoading, decrementLoading]);

  return (
    <DataContext.Provider value={{ data, isDataLoaded }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
