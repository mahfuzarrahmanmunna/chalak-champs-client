// src/app/components/Loading/Loading.tsx

"use client";

import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export const metadata = {
  title: "Loading Component",
  description:
    "A reusable loading spinner component with optional full-screen mode and customizable text.",
};

const Loading: React.FC<LoadingProps> = ({ fullScreen = false, text }) => {
  const { colors } = useTheme();
  const { isBangla } = useLanguage();

  const loadingText = text || (isBangla ? "লোড হচ্ছিছ..." : "Loading...");

  return (
    <div
      className={`flex flex-col items-center justify-center ${fullScreen ? "min-h-screen" : "py-12"}`}
      style={{ backgroundColor: colors.background }}
    >
      <div className="relative">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
        <div
          className="absolute top-0 left-0 animate-ping rounded-full h-12 w-12 opacity-20"
          style={{ backgroundColor: colors.primary }}
        ></div>
      </div>
      <p
        className="mt-4 text-sm font-medium"
        style={{ color: colors.foreground, opacity: 0.7 }}
      >
        {loadingText}
      </p>
    </div>
  );
};

export default Loading;
