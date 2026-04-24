"use client";
import React, { useState, ReactNode } from "react";

interface SpotlightWrapperProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string; // Optional: Default is white transparent
  spotlightSize?: number; // Optional: Default size of the glow
}

const SpotlightWrapper: React.FC<SpotlightWrapperProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.15)",
  spotlightSize = 600,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 
          The Spotlight Overlay 
          Note: pointer-events-none ensures the light doesn't block clicks on your content.
      */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* 
          The Content Wrapper 
          z-10 ensures the text sits on top of the light effect.
      */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default SpotlightWrapper;
