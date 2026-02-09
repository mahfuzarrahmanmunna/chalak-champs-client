"use client";

import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: any;
  setSelectedCategory: (category: any) => void;
}

const CategoryModal = ({ isOpen, onClose }: CategoryModalProps) => {
  const { t } = useLanguage();
  const { colors } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--color-background)",
        borderBottom: `1px solid var(--color-border)`,
      }}
      className="fixed inset-0 z-50 overflow-auto flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className="relative max-w-md mx-auto p-6 rounded-lg shadow-xl z-10 w-full"
        style={{
          backgroundColor: "var(--color-card)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full"
          style={{
            color: "var(--color-foreground)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2
          className="text-xl font-bold mb-4"
          style={{
            color: "var(--color-primary)",
          }}
        >
          {String(t.categories)}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-3 rounded-md cursor-pointer transition-colors duration-200"
            style={{
              border: `1px solid var(--color-border)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-accent)";
              e.currentTarget.style.opacity = "0.1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.opacity = "1";
            }}
          >
            <h3
              className="font-medium"
              style={{
                color: "var(--color-foreground)",
              }}
            >
              Programming
            </h3>
          </div>

          <div
            className="p-3 rounded-md cursor-pointer transition-colors duration-200"
            style={{
              border: `1px solid var(--color-border)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-accent)";
              e.currentTarget.style.opacity = "0.1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.opacity = "1";
            }}
          >
            <h3
              className="font-medium"
              style={{
                color: "var(--color-foreground)",
              }}
            >
              Design
            </h3>
          </div>

          <div
            className="p-3 rounded-md cursor-pointer transition-colors duration-200"
            style={{
              border: `1px solid var(--color-border)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-accent)";
              e.currentTarget.style.opacity = "0.1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.opacity = "1";
            }}
          >
            <h3
              className="font-medium"
              style={{
                color: "var(--color-foreground)",
              }}
            >
              Business
            </h3>
          </div>

          <div
            className="p-3 rounded-md cursor-pointer transition-colors duration-200"
            style={{
              border: `1px solid var(--color-border)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-accent)";
              e.currentTarget.style.opacity = "0.1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.opacity = "1";
            }}
          >
            <h3
              className="font-medium"
              style={{
                color: "var(--color-foreground)",
              }}
            >
              Marketing
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
