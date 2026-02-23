"use client";

import React from "react";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { AuthProvider } from "./FirebaseProvider";
// import DataLoadedWrapper from "./DataLoadedWrapper";
// import { DataProvider } from "../context/DataProvider";
import { LoadingProvider } from "../context/LoadingContext";
import Navbar from "../components/Navbar/Navbar";
import { usePathname } from "next/navigation";
import Footer from "../components/Footer/Footer";
// import { ThemeProvider2 } from "../context/ThemeContext2";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/admin-dashboard");
  // const
  return (
    // <DataLoadedWrapper>
    //   <DataProvider>
    <AuthProvider>
      <LoadingProvider>
        <ThemeProvider>
          <LanguageProvider>
            {!isDashboard && <Navbar />}
            {children}
            {!isDashboard && <Footer />}
          </LanguageProvider>
        </ThemeProvider>
      </LoadingProvider>
    </AuthProvider>
    //   </DataProvider>
    // </DataLoadedWrapper>
  );
};

export default Providers;
