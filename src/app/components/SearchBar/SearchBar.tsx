"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();
  const { colors } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={String(t.searchPlaceholder ?? "Search...")}
        className="px-4 py-2 rounded-full text-sm focus:outline-none transition-colors duration-200"
        style={{
          backgroundColor: "var(--color-card)",
          color: "var(--color-foreground)",
          border: `1px solid var(--color-border)`,
        }}
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-3 rounded-r-full transition-colors duration-200"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-background)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
