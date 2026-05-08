"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Gift, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const pathname = usePathname();
  // 1. Check if it's the user's first visit
  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenDownloadModal");

    // Check if user is already in PWA mode (installed)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    // Only show if not seen before AND not already installed
    if (!hasSeenModal && !isStandalone) {
      // Add a small delay so it doesn't flash immediately
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  // 2. Listen for PWA Installation Prompt
  useEffect(() => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    if (!isStandalone && pathname === "/") {
      // delay দিলে UX smooth হয়
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const shouldShowModal = isOpen && pathname === "/";

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenDownloadModal", "true");
  };

  const handleDownload = async () => {
    if (deferredPrompt) {
      // Show the native browser install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
      handleClose();
    } else {
      // Fallback for desktop browsers that don't support the prompt easily
      // or if the prompt was already dismissed by the user in the past
      alert(
        "To install our app on iOS: Tap Share > Add to Home Screen.\n\nOn Android: Tap menu > Install App.",
      );
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#490023]/15 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300"
        style={{
          background: "linear-gradient(135deg, #00477C 0%, #F3066E 100%)", // Secondary to Primary Gradient
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full bg-black/20 p-1 text-white transition-colors hover:bg-black/40"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center p-8 text-center text-white">
          {/* Badge */}
          <div className="mb-4 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={12} className="text-yellow-300" />
            <span>Join the App Community</span>
          </div>

          {/* Icon */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 shadow-inner backdrop-blur-sm">
            <Gift size={40} className="text-white drop-shadow-md" />
          </div>

          {/* Typography */}
          <h2 className="mb-2 text-3xl font-bold leading-tight">
            Get Flat <span className="text-yellow-300">40% Off</span>
          </h2>
          <p className="mb-8 text-lg font-light opacity-90">
            Download our App & Register now to unlock your exclusive discount.
          </p>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-[#F3066E] transition-all hover:scale-105 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:scale-95"
          >
            <Download
              size={20}
              className="transition-transform group-hover:-translate-y-0.5"
            />
            Download Now
          </button>

          {/* Helper Text */}
          <p className="mt-4 text-xs font-medium text-white/60">
            Limited time offer for new users
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
