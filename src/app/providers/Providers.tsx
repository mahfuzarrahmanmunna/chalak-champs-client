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
import Navbar1 from "../components/Navbar/Navbar1";
import NavHeader from "../components/NavHeader/NavHeader";
import FooterMassenger from "../components/Footer/FooterMassenger";
import PromoModal from "../components/PromoModal/PromoModal";
// import { ThemeProvider2 } from "../context/ThemeContext2";

// Type definition for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/admin-dashboard");
  const isStDashboard = pathname.startsWith("/dashboard");
  // const { currentUser } = useCurrentUser();
  // console.log(currentUser);

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

    // Capture beforeinstallprompt event
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    window.addEventListener("beforeinstallprompt", (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      console.log("Install prompt captured");
      // Store in sessionStorage to make it available globally
      (window as any).deferredInstallPrompt = deferredPrompt;
    });

    window.addEventListener("appinstalled", () => {
      console.log("PWA installed successfully");
      deferredPrompt = null;
      (window as any).deferredInstallPrompt = null;
    });
  }, []);

  return (
    // <DataLoadedWrapper>
    //   <DataProvider>
    <AuthProvider>
      <LoadingProvider>
        <ThemeProvider>
          <LanguageProvider>
            {!isDashboard && !isStDashboard && <NavHeader />}
            {children}
            {!isDashboard && !isStDashboard && <Footer />}
            <FooterMassenger />
            {/* <PromoModal/> */}
          </LanguageProvider>
        </ThemeProvider>
      </LoadingProvider>
    </AuthProvider>
    //   </DataProvider>
    // </DataLoadedWrapper>
  );
};

export default Providers;
