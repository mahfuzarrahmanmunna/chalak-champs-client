"use client";

import React from "react";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { AuthProvider } from "./FirebaseProvider";
import DataLoadedWrapper from "./DataLoadedWrapper";
import { DataProvider } from "../context/DataProvider";
import { LoadingProvider } from "../context/LoadingContext";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    // <DataLoadedWrapper>
    //   <DataProvider>
    <AuthProvider>
      <ThemeProvider>
        <LoadingProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </LoadingProvider>
      </ThemeProvider>
    </AuthProvider>
    //   </DataProvider>
    // </DataLoadedWrapper>
  );
};

export default Providers;
