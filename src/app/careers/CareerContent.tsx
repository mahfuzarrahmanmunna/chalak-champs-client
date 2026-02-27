"use client";
import React from "react";
import { useTheme } from "@/app/context/ThemeContext";

const CareerContent = () => {
  const { colors } = useTheme();
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <h1>Career Page</h1>
    </div>
  );
};

export default CareerContent;
