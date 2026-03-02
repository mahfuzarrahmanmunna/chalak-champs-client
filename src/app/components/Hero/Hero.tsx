// src/app/components/HeroBanner/HeroBanner.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  Play,
  ArrowRight,
  Users,
  BookOpen,
  Globe,
  Star,
  CheckCircle,
  X,
} from "lucide-react";

const HeroBanner: React.FC = () => {
  const { theme, colors } = useTheme();
  const { heroData, isLoading } = useLanguage();
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Check if data is loading or if heroData is not available
  if (isLoading || !heroData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: "var(--color-primary)" }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-background)",
      }}
    >
      {/* Background Image/Video with gradient overlay matching blog design */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Language Learning"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay matching blog design */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {heroData.title}
              </h1>
              <p
                className="text-xl md:text-2xl font-medium"
                style={{
                  color: "white",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                {heroData.subtitle}
              </p>
              <p
                className="text-lg leading-relaxed max-w-lg"
                style={{
                  color: "white",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                {heroData.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/courses"
                className="px-8 py-4 font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                }}
              >
                {heroData.ctaButton}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={() => setVideoPlaying(true)}
                className="px-8 py-4 font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  border: "2px solid white",
                }}
              >
                <Play className="mr-2 h-5 w-5" fill="currentColor" />
                Watch Demo
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {heroData.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div
                    className="rounded-full p-2 flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <CheckCircle
                      className="h-5 w-5"
                      style={{ color: "white" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-semibold mb-1"
                      style={{ color: "white" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div
              className="rounded-lg p-6 text-center backdrop-blur-sm shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                className="rounded-full p-3 mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Users className="h-8 w-8" style={{ color: "white" }} />
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "white" }}
              >
                {heroData.stats.students}
              </div>
              <div
                className="text-sm font-medium"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Students
              </div>
            </div>
            <div
              className="rounded-lg p-6 text-center backdrop-blur-sm shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                className="rounded-full p-3 mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <BookOpen className="h-8 w-8" style={{ color: "white" }} />
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "white" }}
              >
                {heroData.stats.courses}
              </div>
              <div
                className="text-sm font-medium"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Courses
              </div>
            </div>
            <div
              className="rounded-lg p-6 text-center backdrop-blur-sm shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                className="rounded-full p-3 mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Globe className="h-8 w-8" style={{ color: "white" }} />
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "white" }}
              >
                {heroData.stats.languages}
              </div>
              <div
                className="text-sm font-medium"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Languages
              </div>
            </div>
            <div
              className="rounded-lg p-6 text-center backdrop-blur-sm shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                className="rounded-full p-3 mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Star className="h-8 w-8" style={{ color: "white" }} />
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "white" }}
              >
                {heroData.stats.instructors}
              </div>
              <div
                className="text-sm font-medium"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Instructors
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoPlaying && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => setVideoPlaying(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 rounded-full p-2 transition-all duration-300 hover:bg-gray-100"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <X
                className="h-6 w-6"
                style={{ color: "var(--color-foreground)" }}
              />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Demo Video"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
