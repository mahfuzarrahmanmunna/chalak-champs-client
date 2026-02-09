// src/app/components/ThemeToggle.tsx
"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext2";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const ThemeToggle2: React.FC<ThemeToggleProps> = ({
  className,
  variant = "default",
  size = "md",
}) => {
  const { theme, toggleTheme } = useTheme();

  const baseClasses =
    "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizeClasses = {
    sm: "h-9 w-9",
    md: "h-10 w-10",
    lg: "h-11 w-11",
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle2;
