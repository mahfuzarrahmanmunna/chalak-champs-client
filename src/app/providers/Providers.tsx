"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { LoadingProvider } from "../context/LoadingContext";
import NavHeader from "../components/NavHeader/NavHeader";
import Footer from "../components/Footer/Footer";
import { usePathname } from "next/navigation";
import FooterMassenger from "../components/Footer/FooterMassenger";
import { AuthProvider } from "../context/AuthContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

const Providers: React.FC<{
  children: React.ReactNode;
  initialLang: string;
}> = ({ children, initialLang }) => {
  const pathname = usePathname();

  // FIX: Check logic for /en/dashboard vs /admin-dashboard
  const isDashboard = pathname.includes("/admin-dashboard");
  const isStDashboard = pathname.includes("/dashboard");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Check environment
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (window.location.protocol === "https:" || isLocalhost) {
      navigator.serviceWorker
        .register("/sw.js") // This must match the file in public/
        .then((registration) => {
          console.log("Service worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    }

    // PWA Install Prompt Logic
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    window.addEventListener("beforeinstallprompt", (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      console.log("Install prompt captured");
      (window as any).deferredInstallPrompt = deferredPrompt;
    });

    window.addEventListener("appinstalled", () => {
      console.log("PWA installed successfully");
      deferredPrompt = null;
      (window as any).deferredInstallPrompt = null;
    });
  }, []);

  return (
    <AuthProvider>
      <LoadingProvider>
        <ThemeProvider>
          <LanguageProvider initialLang={initialLang}>
            {!isDashboard && !isStDashboard && <NavHeader />}
            {children}
            {!isDashboard && !isStDashboard && <Footer />}
            <FooterMassenger />
          </LanguageProvider>
        </ThemeProvider>
      </LoadingProvider>
    </AuthProvider>
  );
};

export default Providers;
