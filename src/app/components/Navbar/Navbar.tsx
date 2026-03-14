"use client";

import Link from "next/link";
import React, { useState } from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import SearchBar from "../SearchBar/SearchBar";
import CategoryModal from "../CategoryModal/CategoryModal";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import useAuth from "@/app/hooks/useAuth";
import ProfileModal from "./ProfileModal";
import ProfileButton from "./ProfileButton";
// import { useCurrentUser } from "@/app/hooks/useCurrentUser"; // Optional if not used in render

const Navbar = () => {
  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Hooks
  const { isBangla, toggleLanguage, t } = useLanguage();
  const { colors } = useTheme();
  const { user } = useAuth();
  // console.log(t);

  // Modal Handlers
  const openCategoryModal = () => {
    setIsCategoryModalOpen(true);
    setSelectedCategory(null);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <>
      <nav
        className="shadow-lg sticky top-0 z-40 transition-colors duration-300"
        style={{
          backgroundColor: "var(--color-background)",
          borderBottom: `1px solid var(--color-border)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {String(t.logo)}
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {String(t.courses)}
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-opacity-5"
                    style={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <div className="py-1">
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: "var(--color-foreground)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--color-accent)";
                          e.currentTarget.style.opacity = "0.1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.opacity = "1";
                        }}
                      >
                        {String(t.liveCourses)}
                      </Link>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: "var(--color-foreground)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--color-accent)";
                          e.currentTarget.style.opacity = "0.1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.opacity = "1";
                        }}
                      >
                        {String(t.recordedCourses)}
                      </Link>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: "var(--color-foreground)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--color-accent)";
                          e.currentTarget.style.opacity = "0.1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.opacity = "1";
                        }}
                      >
                        {String(t.skillDev)}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={openCategoryModal}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--color-foreground)" }}
              >
                {String(t.categories)}
              </button>

              <Link
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--color-foreground)" }}
              >
                {String(t.modelTest)}
              </Link>
              <Link
                href="/blog"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--color-foreground)" }}
              >
                {String(t.blog)}
              </Link>
              <Link
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--color-foreground)" }}
              >
                {String(t.store)}
              </Link>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Right Side Actions (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-md transition-colors duration-200 font-medium"
                style={{ color: "var(--color-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-card)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label="Toggle language"
              >
                {isBangla ? "বাংলা" : "EN"}
              </button>

              <ThemeToggle />

              {user ? (
                <ProfileButton onClick={openProfileModal} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {String(t.login)}
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-background)",
                    }}
                  >
                    {String(t.signUp)}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-md transition-colors duration-200"
                style={{ color: "var(--color-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-card)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label="Toggle search"
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

              <button
                onClick={toggleLanguage}
                className="p-2 rounded-md transition-colors duration-200 font-medium"
                style={{ color: "var(--color-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-card)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label="Toggle language"
              >
                {isBangla ? "বাং" : "EN"}
              </button>

              <ThemeToggle />

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-colors duration-200 focus:outline-none"
                style={{ color: "var(--color-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-card)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
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

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-3">
            <SearchBar />
          </div>
        )}

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div
            className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              style={{ color: "var(--color-foreground)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.opacity = "0.1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }}
            >
              {String(t.courses)}
            </Link>
            <button
              onClick={openCategoryModal}
              className="block text-left w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              style={{ color: "var(--color-foreground)" }}
            >
              {String(t.categories)}
            </button>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              style={{ color: "var(--color-foreground)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.opacity = "0.1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }}
            >
              {String(t.modelTest)}
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              style={{ color: "var(--color-foreground)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.opacity = "0.1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }}
            >
              {String(t.blog)}
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              style={{ color: "var(--color-foreground)" }}
            >
              {String(t.store)}
            </Link>

            {/* Mobile authentication section */}
            <div
              className="pt-4 pb-3"
              style={{ borderTop: `1px solid var(--color-border)` }}
            >
              {user ? (
                <div className="px-4 space-y-3">
                  <div className="flex items-center">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <span
                        className="text-lg font-medium"
                        style={{ color: "var(--color-background)" }}
                      >
                        {user?.displayName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                      </span>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        {user?.displayName || "User"}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={openProfileModal}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {String(t.viewProfile || "View Profile")}
                  </button>
                </div>
              ) : (
                <div className="flex items-center px-4 space-x-3">
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {String(t.login)}
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-background)",
                    }}
                  >
                    {String(t.signUp)}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </>
  );
};

export default Navbar;
