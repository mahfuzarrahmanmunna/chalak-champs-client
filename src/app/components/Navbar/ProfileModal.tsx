// src/components/ProfileModal/ProfileModal.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
          style={{
            backgroundColor: "var(--color-card)",
          }}
        >
          {/* Header with user info */}
          <div
            className="px-6 py-4 border-b"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-primary)",
            }}
          >
            <div className="flex items-center">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center mr-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <span
                  className="text-xl font-bold"
                  style={{
                    color: "white",
                  }}
                >
                  {user?.displayName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    "U"}
                </span>
              </div>
              <div className="flex-1">
                <p
                  className="text-base font-semibold"
                  style={{
                    color: "white",
                  }}
                >
                  {user?.displayName || "User"}
                </p>
                <p
                  className="text-sm opacity-90"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  {user?.email}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full transition-colors duration-200"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="w-full px-6 py-3 flex items-center hover:bg-gray-50 transition-colors duration-200"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.opacity = "0.05";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }}
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                style={{
                  backgroundColor: "var(--color-primary)",
                }}
              >
                <svg
                  className="w-4 h-4"
                  style={{
                    color: "var(--color-background)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: "var(--color-foreground)",
                }}
              >
                {String(t.dashboard) || "Dashboard"}
              </span>
            </button>

            <button
              onClick={() => handleNavigation("/my-courses")}
              className="w-full px-6 py-3 flex items-center hover:bg-gray-50 transition-colors duration-200"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.opacity = "0.05";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }}
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                style={{
                  backgroundColor: "var(--color-primary)",
                }}
              >
                <svg
                  className="w-4 h-4"
                  style={{
                    color: "var(--color-background)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: "var(--color-foreground)",
                }}
              >
                {String(t.myCourses) || "My Courses"}
              </span>
            </button>

            <button
              onClick={() => handleNavigation("/settings")}
              className="w-full px-6 py-3 flex items-center hover:bg-gray-50 transition-colors duration-200"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.opacity = "0.05";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }}
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                style={{
                  backgroundColor: "var(--color-primary)",
                }}
              >
                <svg
                  className="w-4 h-4"
                  style={{
                    color: "var(--color-background)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: "var(--color-foreground)",
                }}
              >
                {String(t.settings) || "Settings"}
              </span>
            </button>

            <button
              onClick={() => handleNavigation("/help")}
              className="w-full px-6 py-3 flex items-center hover:bg-gray-50 transition-colors duration-200"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.opacity = "0.05";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }}
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                style={{
                  backgroundColor: "var(--color-primary)",
                }}
              >
                <svg
                  className="w-4 h-4"
                  style={{
                    color: "var(--color-background)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: "var(--color-foreground)",
                }}
              >
                {String(t.help) || "Help & Support"}
              </span>
            </button>

            <div
              className="my-2"
              style={{
                borderTop: `1px solid var(--color-border)`,
              }}
            ></div>

            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 flex items-center hover:bg-gray-50 transition-colors duration-200"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(239, 68, 68, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                style={{
                  backgroundColor: "#ef4444",
                }}
              >
                <svg
                  className="w-4 h-4"
                  style={{
                    color: "white",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: "#ef4444",
                }}
              >
                {String(t.logout) || "Logout"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
