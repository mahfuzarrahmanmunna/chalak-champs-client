// src/app/context/ThemeContext.tsx
"use client";

import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

const lightTheme = {
  primary: "#F3056D",
  secondary: "#214187",
  accent: "#ffc500",
  background: "#ffffff",
  foreground: "#000000",
  card: "#f8f9fa",
  border: "#e9ecef",
  muted: "#6b7280",
  success: "#10b981",
  destructive: "#ef4444",
};

const darkTheme = {
  primary: "#F3056D",
  secondary: "#214187",
  accent: "#ffc500",
  background: "#121212",
  foreground: "#ffffff",
  card: "#1e1e1e",
  border: "#333333",
  muted: "#9ca3af",
  success: "#10b981",
  destructive: "#ef4444",
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightTheme;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
  }
  return "light";
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const colors = theme === "light" ? lightTheme : darkTheme;
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme, colors]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};