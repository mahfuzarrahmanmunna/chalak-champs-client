"use client";

import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  // Ensure aria-label is always a string
  const ariaLabel = String(theme === "light" ? t.darkMode : t.lightMode);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200"
      style={{ backgroundColor: "var(--color-card)" }}
      aria-label={ariaLabel}
    >
      {theme === "light" ? (
        <FaMoon
          className="h-5 w-5"
          style={{ color: "var(--color-foreground)" }}
        />
      ) : (
        <FaSun
          className="h-5 w-5"
          style={{ color: "var(--color-foreground)" }}
        />
      )}
    </button>
  );
};

export default ThemeToggle;
