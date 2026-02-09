// src/app/components/ThemeSwitch.tsx
"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext2";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-300 ${
        theme === "light"
          ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
          : "bg-gray-700 hover:bg-gray-600 text-gray-100"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeSwitch;
