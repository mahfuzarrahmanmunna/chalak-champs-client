"use client";

import React from "react";
import {
  ArrowRight,
  Target,
  Heart,
  Star,
  BookOpen,
  Award,
  Users,
  Phone,
  CheckCircle,
} from "lucide-react";
import { useLanguage, AboutUsData } from "@/app/context/LanguageContext";
import Button from "@/app/ui/button/Button"; // Assuming you have this component

export default function AboutUs() {
  const { aboutUsData, isBangla, toggleLanguage } = useLanguage();

  if (!aboutUsData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-secondary leading-tight">
            {aboutUsData.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {aboutUsData.hero.subtitle}
          </p>
        </div>
      </div>

      {/* --- WHO WE ARE SECTION --- */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 border-l-4 pl-4 border-[#F3056D] inline-block">
            {aboutUsData.whoWeAre.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Side */}
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {isBangla
                  ? aboutUsData.whoWeAre.bangla
                  : aboutUsData.whoWeAre.english}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-[#F3056D]">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-800 text-lg">
                  {isBangla
                    ? "ভালোবা দিয়ে তৈরি করা হয়েছে"
                    : "Created with love"}
                </span>
              </div>
            </div>

            {/* Image/Card Side */}
            <div className="relative">
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[30px] overflow-hidden shadow-xl bg-gradient-to-br from-[#C7EAFF] to-[#E9F6FF] flex items-center justify-center group">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: "url('/about-hero.jpg')" }}
                ></div>
                {/* Overlay Text */}
                <div className="relative z-10 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full font-bold text-[#214187] shadow-lg border border-white">
                  {isBangla ? "আমাদের গল্প" : "Our Journey"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MISSION & VISION SECTION --- */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 border-l-4 pl-4 border-[#F3056D] inline-block">
            {aboutUsData.missionVision.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-[#F3056D]/10 rounded-2xl flex items-center justify-center text-[#F3056D] mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {aboutUsData.missionVision.mission.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isBangla
                  ? aboutUsData.missionVision.mission.bangla
                  : aboutUsData.missionVision.mission.english}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-[#214187]/10 rounded-2xl flex items-center justify-center text-[#214187] mb-6">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {aboutUsData.missionVision.vision.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isBangla
                  ? aboutUsData.missionVision.vision.bangla
                  : aboutUsData.missionVision.vision.english}
              </p>
            </div>

            {/* Values Card (Derived from content) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-[#F3056D]/10 rounded-2xl flex items-center justify-center text-[#F3056D] mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {aboutUsData.missionVision.values.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isBangla
                  ? aboutUsData.missionVision.values.bangla
                  : aboutUsData.missionVision.values.english}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- WHAT WE OFFER SECTION --- */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 border-l-4 pl-4 border-[#F3056D] inline-block">
            {aboutUsData.whatWeOffer.title}
          </h2>

          <div className="max-w-4xl mx-auto mb-10">
            <p className="text-center text-lg text-gray-600 mb-8">
              {isBangla
                ? aboutUsData.whatWeOffer.introBangla
                : aboutUsData.whatWeOffer.introEnglish}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="bg-[#214187]/5 px-4 py-2 rounded-full text-[#214187] text-sm font-medium border border-[#214187]/10">
                <Users className="inline-block w-4 h-4 mr-2" />
                {isBangla ? "দক্ষ কোর্স" : "Expert Courses"}
              </div>
              <div className="bg-[#F3056D]/5 px-4 py-2 rounded-full text-[#F3056D] text-sm font-medium border border-[#F3056D]/10">
                <BookOpen className="inline-block w-4 h-4 mr-2" />
                {isBangla ? "ইন্টারঅ্যাক্টিভ" : "Interactive"}
              </div>
              <div className="bg-[#214187]/5 px-4 py-2 rounded-full text-[#214187] text-sm font-medium border border-[#214187]/10">
                <Award className="inline-block w-4 h-4 mr-2" />
                {isBangla ? "বাস্তবুখী" : "Live Classes"}
              </div>
              <div className="bg-[#F3056D]/5 px-4 py-2 rounded-full text-[#F3056D] text-sm font-medium border border-[#F3056D]/10">
                <CheckCircle className="inline-block w-4 h-4 mr-2" />
                {isBangla ? "ফ্রি ডেমো" : "Free Demo"}
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
            <p className="text-sm text-[#214187] italic">
              {isBangla
                ? aboutUsData.whatWeOffer.tagsBangla
                : aboutUsData.whatWeOffer.tagsEnglish}
            </p>
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="py-20 bg-[#214187] text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3056D] blur-[100px] opacity-20 rounded-full"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {aboutUsData.cta.title}
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            {aboutUsData.cta.body}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Button
              bgColor="#F3056D"
              highlightColor="#FF8FCA"
              darkShadowColor="#C6005F"
              textColor="white"
              hoverTextColor="#F3056D"
              textSize="lg"
              px="px-10"
              py="py-4"
            >
              <div className="flex items-center">
                <span>{aboutUsData.cta.cta1}</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </Button>

            <a href={`tel:+8801740176774`}>
              <div className="flex items-center gap-3 text-lg font-medium bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/20">
                <Phone className="w-5 h-5" />
                {aboutUsData.cta.cta2}
              </div>
            </a>
          </div>

          <p className="mt-6 text-blue-200 font-semibold text-sm">
            {aboutUsData.cta.below}
          </p>
        </div>
      </div>
    </div>
  );
}
