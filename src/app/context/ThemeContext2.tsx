// src/app/context/ThemeContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// Renamed from ThemeProvider2 to ThemeProvider for consistency
export function ThemeProvider2({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    const initialTheme = savedTheme || systemPref;
    setThemeState(initialTheme);

    // Apply theme to document
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Prevent flash of incorrect theme
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={`${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
