"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  X,
  Home,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10); // Trigger enter animation
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300); // Wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  // Helper to safely get translation strings
  const getText = (key: any, fallback: string) => {
    return key ? String(key) : fallback;
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with fade animation */}
      <div
        onClick={onClose}
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>

      {/* Dropdown Container - Positioned Top Right */}
      <div
        className={`absolute right-4 top-20 z-50 w-full max-w-sm transform transition-all duration-300 ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95"
        }`}
      >
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full transition-colors z-10"
            style={{ color: colors.foreground }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = colors.background)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header Section */}
          <div
            className="relative px-6 pt-8 pb-6 text-center"
            style={{
              backgroundColor: colors.primary,
              color: "white",
            }}
          >
            {/* Avatar Circle */}
            <div
              className="mx-auto w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 shadow-lg"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.card,
              }}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10" style={{ color: colors.primary }} />
              )}
            </div>

            <h3 className="text-xl font-bold truncate px-4">
              {user?.displayName || "User"}
            </h3>
            <p className="text-sm opacity-90 mt-1 truncate px-4">
              {user?.email || "user@example.com"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="px-4 py-4 space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors group"
              style={{ color: colors.foreground }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.background)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div
                className="p-2 rounded-md transition-colors"
                style={{
                  backgroundColor: colors.background,
                  color: colors.primary,
                }}
              >
                <Home className="h-5 w-5" />
              </div>
              <span className="font-medium">
                {getText(t?.dashboard, "Dashboard")}
              </span>
            </button>

            {/* My Courses */}
            <button
              onClick={() => handleNavigation("/my-courses")}
              className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors group"
              style={{ color: colors.foreground }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.background)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div
                className="p-2 rounded-md transition-colors"
                style={{
                  backgroundColor: colors.background,
                  color: colors.primary,
                }}
              >
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-medium">
                {getText(t?.myCourses, "My Courses")}
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => handleNavigation("/settings")}
              className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors group"
              style={{ color: colors.foreground }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.background)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div
                className="p-2 rounded-md transition-colors"
                style={{
                  backgroundColor: colors.background,
                  color: colors.primary,
                }}
              >
                <Settings className="h-5 w-5" />
              </div>
              <span className="font-medium">
                {getText(t?.settings, "Settings")}
              </span>
            </button>

            {/* Help */}
            <button
              onClick={() => handleNavigation("/help")}
              className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors group"
              style={{ color: colors.foreground }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.background)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div
                className="p-2 rounded-md transition-colors"
                style={{
                  backgroundColor: colors.background,
                  color: colors.primary,
                }}
              >
                <HelpCircle className="h-5 w-5" />
              </div>
              <span className="font-medium">
                {getText(t?.help, "Help & Support")}
              </span>
            </button>

            <div
              className="my-2 border-t"
              style={{ borderColor: colors.border }}
            ></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors group"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(239, 68, 68, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div
                className="p-2 rounded-md"
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                }}
              >
                <LogOut className="h-5 w-5" />
              </div>
              <span className="font-medium text-red-500">
                {getText(t?.logout, "Logout")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
