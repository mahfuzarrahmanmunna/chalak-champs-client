"use client";
import React, { useState } from "react";

export default function HoverGlow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: show ? 1 : 0,
          transition: "opacity 0.3s ease",
          background: `radial-gradient(500px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.25), transparent 60%)`,
        }}
      />

      {/* Glass overlay */}
      <div className="pointer-events-none absolute inset-0 backdrop-blur-xl bg-white/5 z-0" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
