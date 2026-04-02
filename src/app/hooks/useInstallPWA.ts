import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

interface WindowWithInstallPrompt extends Window {
  deferredInstallPrompt?: BeforeInstallPromptEvent;
}

export const useInstallPWA = () => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(() => {
      if (typeof window === "undefined") return null;
      if (window.matchMedia("(display-mode: standalone)").matches) {
        return null;
      }
      return (window as WindowWithInstallPrompt).deferredInstallPrompt || null;
    });

  const [isInstallable, setIsInstallable] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return false;
    }
    return !!(window as WindowWithInstallPrompt).deferredInstallPrompt;
  });

  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Listen for future beforeinstallprompt events
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(beforeInstallPromptEvent);
      setIsInstallable(true);
      (window as WindowWithInstallPrompt).deferredInstallPrompt =
        beforeInstallPromptEvent;
    };

    const handleAppinstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      (window as WindowWithInstallPrompt).deferredInstallPrompt = undefined;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppinstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppinstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) {
      console.warn("Install prompt not available");
      return;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error("Installation failed:", error);
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
  };
};
