"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { AuthProvider } from "./FirebaseProvider";
// import DataLoadedWrapper from "./DataLoadedWrapper";
// import { DataProvider } from "../context/DataProvider";
import { LoadingProvider } from "../context/LoadingContext";
import Navbar from "../components/Navbar/Navbar";
import { usePathname } from "next/navigation";
import Footer from "../components/Footer/Footer";
import { useCurrentUser } from "../hooks/useCurrentUser";
// import { ThemeProvider2 } from "../context/ThemeContext2";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/admin-dashboard");
  const isStDashboard = pathname.startsWith("/dashboard");
  const { currentUser } = useCurrentUser();
  console.log(currentUser);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Only register on production builds over HTTPS
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (window.location.protocol === "https:" || isLocalhost) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    }
  }, []);

  return (
    // <DataLoadedWrapper>
    //   <DataProvider>
    <AuthProvider>
      <LoadingProvider>
        <ThemeProvider>
          <LanguageProvider>
            {!isDashboard && !isStDashboard && <Navbar />}
            {children}
            {!isDashboard && !isStDashboard && <Footer />}
          </LanguageProvider>
        </ThemeProvider>
      </LoadingProvider>
    </AuthProvider>
    //   </DataProvider>
    // </DataLoadedWrapper>
  );
};

export default Providers;
