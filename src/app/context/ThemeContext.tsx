// src/app/context/ThemeContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define the theme type
type Theme = "light" | "dark";

// Define the theme colors
const lightTheme = {
  primary: "#f3066e", // Pink
  secondary: "#204186", // Dark blue
  accent: "#ffc500", // Yellow
  background: "#ffffff",
  foreground: "#000000",
  card: "#f8f9fa",
  border: "#e9ecef",
  muted: "#6b7280", // Gray for secondary text
  success: "#10b981", // Green
  destructive: "#ef4444", // Red
};

const darkTheme = {
  primary: "#f3066e", // Pink
  secondary: "#4a6fa5", // Lighter version of dark blue
  accent: "#ffc500", // Yellow
  background: "#121212",
  foreground: "#ffffff",
  card: "#1e1e1e",
  border: "#333333",
  muted: "#9ca3af", // Lighter gray for dark mode
  success: "#10b981", // Green
  destructive: "#ef4444", // Red
};

// Define the context type
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightTheme;
  isDarkMode: boolean;
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to get initial theme
const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
  }
  return "light";
};

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Get theme colors based on current theme
  const colors = theme === "light" ? lightTheme : darkTheme;

  // Derive isDarkMode from the current theme
  const isDarkMode = theme === "dark";

  // Apply CSS variables + dark class for Tailwind/daisyUI
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

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
