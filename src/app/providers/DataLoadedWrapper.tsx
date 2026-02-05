// src/app/components/DataLoadedWrapper/DataLoadedWrapper.tsx

"use client";

import React, { useState, useEffect } from "react";
import Loading from "../components/Loading/Loading";
// import Loading from "../Loading/Loading";
// import { DataProvider } from "../context/DataProvider";

interface DataLoadedWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DataLoadedWrapper: React.FC<DataLoadedWrapperProps> = ({
  children,
  fallback,
}) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Check if the data context is available
    const checkDataLoaded = () => {
      try {
        // Try to access the data context
        const dataContext = require("../context/DataProvider");
        if (dataContext.useData) {
          const { isDataLoaded } = dataContext.useData();
          setIsDataLoaded(isDataLoaded);
        } else {
          setIsDataLoaded(false);
        }
      } catch (error) {
        console.error("Error checking data loaded state:", error);
        setIsDataLoaded(false);
      }
    };
    {
      /* <DataProvider/> */
    }
    // Check immediately and then every 100ms for 5 seconds
    checkDataLoaded();
    const intervalId = setInterval(checkDataLoaded, 100);
    const timeoutId = setTimeout(() => clearInterval(intervalId), 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isDataLoaded) {
    return fallback || <Loading fullScreen />;
  }

  return <>{children}</>;
};

export default DataLoadedWrapper;
