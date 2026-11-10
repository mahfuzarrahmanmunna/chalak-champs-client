"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { LoadingProvider } from "../context/LoadingContext";
import NavHeader from "../components/NavHeader/NavHeader";
import Footer from "../components/Footer/Footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import { BookingProvider } from "./BookingProvider";
import MobileBottomNav from "../components/MobileBottomNav/MobileBottomNav";
import IntroPreloader from "../components/IntroPreloader/IntroPreloader";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

const Providers: React.FC<{
  children: React.ReactNode;
  initialLang: string;
  initialHeroData?: any;
}> = ({ children, initialLang, initialHeroData }) => {
  const pathname = usePathname();

  // Query Client
  const [queryClient] = useState(() => new QueryClient());

  // Dashboard Check
  const isDashboard = pathname.includes("/admin-dashboard");
  const isStDashboard = pathname.includes("/dashboard");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Dev: never use the service worker. Its cache serves stale dev chunks
    // ("module factory is not available"). Remove any old registration + caches.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()));
      if ("caches" in window) {
        caches
          .keys()
          .then((keys) =>
            keys
              .filter((k) => k.startsWith("chalakchamps-cache-"))
              .forEach((k) => caches.delete(k)),
          );
      }
    } else if (window.location.protocol === "https:") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service worker registered:",
            registration.scope
          );
          // If there's a waiting worker, ask it to skip waiting
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }

          // Listen for updates found (new SW installing)
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && registration.waiting) {
                // Tell the waiting worker to activate immediately
                registration.waiting.postMessage({ type: "SKIP_WAITING" });
              }
            });
          });

          // When the active service worker changes, reload the page to load new assets
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            // Avoid double reload
            if ((window as any)._swReloading) return;
            (window as any)._swReloading = true;
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error(
            "Service worker registration failed:",
            error
          );
        });
    }

    // PWA Install Prompt Logic
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;

      console.log("Install prompt captured");

      (window as any).deferredInstallPrompt =
        deferredPrompt;
    };

    const handleAppInstalled = () => {
      console.log("PWA installed successfully");

      deferredPrompt = null;

      (window as any).deferredInstallPrompt = null;
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  return (
    <section className="min-h-screen bg-white">
      <IntroPreloader />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LoadingProvider>
            <ThemeProvider>
              <LanguageProvider initialLang={initialLang} initialHeroData={initialHeroData}>
                <BookingProvider>
                  {!isDashboard &&
                    !isStDashboard && <NavHeader />}

                  {children}

                  {!isDashboard &&
                    !isStDashboard && <Footer />}

                  {/* <div className="flex md:hidden">
                    <MobileBottomNav />
                  </div> */}
                </BookingProvider>
              </LanguageProvider>
            </ThemeProvider>
          </LoadingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </section>
  );
};

export default Providers;