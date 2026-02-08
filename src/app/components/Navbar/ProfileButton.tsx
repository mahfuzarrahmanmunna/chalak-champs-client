// src/components/ProfileButton/ProfileButton.tsx
"use client";
import React from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/context/ThemeContext";

interface ProfileButtonProps {
  onClick: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick }) => {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 p-1 rounded-full transition-colors duration-200"
      style={{
        color: "var(--color-foreground)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-card)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
      aria-label="Profile"
    >
      <div
        className="h-9 w-9 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-primary)",
        }}
      >
        <span
          className="text-base font-medium"
          style={{
            color: "var(--color-background)",
          }}
        >
          {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
        </span>
      </div>
    </button>
  );
};

export default ProfileButton;
