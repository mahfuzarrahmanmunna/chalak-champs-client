"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";

const Navbar1 = () => {
  // --- State for Mobile Menu ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Context Hooks ---
  const { isBangla, toggleLanguage, t } = useLanguage();
  const { colors, toggleTheme, isDarkMode } = useTheme();

  // Helper to close mobile menu
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm transition-colors duration-300"
      // Using CSS variables provided by ThemeContext
      style={{
        backgroundColor: "var(--color-background)",
        borderBottom: `1px solid var(--color-border)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- Logo Section --- */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Logo Image - Placeholder used if src is missing or invalid */}
              <div className="relative w- h-8  overflow-hidden flex items-center justify-center bg-[var(--color-primary)]">
                {/* Simple fallback icon or actual Image */}
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  // Fallback handling could be added here if needed
                />
              </div>
            </Link>
          </div>

          {/* --- Desktop Navigation Links --- */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              href="/courses"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--color-foreground)" }}
            >
              {t.courses}
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--color-foreground)" }}
            >
              {t.category}
            </Link>
            <Link
              href="/model-test"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--color-foreground)" }}
            >
              {t.modelTest}
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--color-foreground)" }}
            >
              {t.blog}
            </Link>
            <Link
              href="/store"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--color-foreground)" }}
            >
              {t.store}
            </Link>
          </div>

          {/* --- Right Side Actions (Desktop) --- */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Bilingual Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-md text-sm font-bold border transition-all duration-200 flex items-center gap-1"
              style={{
                color: "var(--color-primary)",
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-card)",
              }}
            >
              {isBangla ? "বাংলা" : "EN"}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md transition-colors duration-200 hover:bg-[var(--color-accent)]/20"
              style={{ color: "var(--color-foreground)" }}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                // Sun Icon
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                // Moon Icon
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Search Icon (Visual Placeholder) */}
            <button
              className="p-2 rounded-md transition-colors hover:bg-[var(--color-accent)]/20"
              style={{ color: "var(--color-foreground)" }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Auth Buttons */}
            <Link
              href="/signin"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={{ color: "var(--color-foreground)" }}
            >
              {t.login}
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-md text-sm font-medium text-white shadow-md transition-transform active:scale-95"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {t.signUp}
            </Link>
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md focus:outline-none"
              style={{ color: "var(--color-foreground)" }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Panel --- */}
      {isMenuOpen && (
        <div
          className="md:hidden shadow-inner"
          style={{ backgroundColor: "var(--color-card)" }}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {/* Links */}
            <MobileLink href="/courses" text={t.courses} onClick={closeMenu} />
            <MobileLink
              href="/categories"
              text={t.category}
              onClick={closeMenu}
            />
            <MobileLink
              href="/model-test"
              text={t.modelTest}
              onClick={closeMenu}
            />
            <MobileLink href="/blog" text={t.blog} onClick={closeMenu} />
            <MobileLink href="/store" text={t.store} onClick={closeMenu} />

            <div
              className="border-t my-2"
              style={{ borderColor: "var(--color-border)" }}
            ></div>

            {/* Controls in Mobile */}
            <div className="flex items-center justify-between px-3 py-2">
              <button
                onClick={toggleLanguage}
                className="text-sm font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {isBangla ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
              </button>
              <button
                onClick={toggleTheme}
                style={{ color: "var(--color-foreground)" }}
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>

            {/* Mobile Auth */}
            <div className="pt-2 space-y-2">
              <Link
                href="/signin"
                onClick={closeMenu}
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium border"
                style={{
                  color: "var(--color-foreground)",
                  borderColor: "var(--color-border)",
                }}
              >
                {t.login}
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {t.signUp}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper component for cleaner mobile code
const MobileLink = ({
  href,
  text,
  onClick,
}: {
  href: string;
  text: string;
  onClick: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-3 py-3 rounded-md text-base font-medium hover:opacity-80"
    style={{ color: "var(--color-foreground)" }}
  >
    {text}
  </Link>
);

export default Navbar1;
