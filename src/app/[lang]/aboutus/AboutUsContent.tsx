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

export default function AboutUsContent() {
  const { aboutUsData, isBangla, toggleLanguage } = useLanguage();

  if (!aboutUsData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-sans">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-16 md:pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-white border-b border-gray-200 relative overflow-hidden">
        {/* Playful background blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF8FCA]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 text-secondary leading-tight">
            {aboutUsData.hero.title}
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            {aboutUsData.hero.subtitle}
          </p>
        </div>
      </section>

      {/* --- WHO WE ARE SECTION --- */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 relative pb-3">
              {aboutUsData.whoWeAre.title}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-20 h-1.5 bg-[#F3056D] rounded-full"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text Side */}
            <div className="bg-white rounded-[30px] border-2 border-gray-100 shadow-xl p-6 md:p-10 flex flex-col justify-center min-h-[300px]">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                {isBangla
                  ? aboutUsData.whoWeAre.bangla
                  : aboutUsData.whoWeAre.english}
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-[#F3056D] border-2 border-pink-100">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-800 text-base md:text-lg">
                  {isBangla
                    ? "ভালোবাসা দিয়ে তৈরি করা হয়েছে"
                    : "Created with love"}
                </span>
              </div>
            </div>

            {/* Image/Card Side */}
            <div className="relative group">
              {/* Playful decorative background shape behind the image */}
              <div className="absolute -inset-4 bg-[#FF8FCA]/20 rounded-[40px] rotate-3 transition-transform duration-500 group-hover:rotate-6"></div>

              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[30px] overflow-hidden shadow-xl border-4 border-white">
                {/* Fixed image syntax and applied object-cover */}
                <img
                  src="/about/chalakchampsabout.jpg"
                  alt="Chalak Champs Journey"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-[#214187] shadow-lg border border-white">
                  {isBangla ? "আমাদের গল্প" : "Our Journey"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MISSION & VISION SECTION --- */}
      <section className="py-12 md:py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 relative pb-3">
              {aboutUsData.missionVision.title}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-20 h-1.5 bg-[#F3056D] rounded-full"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Mission Card */}
            <div className="bg-gray-50 p-8 rounded-[30px] border-2 border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <div className="w-16 h-16 bg-[#F3056D] rounded-2xl flex items-center justify-center text-white mb-6 shadow-md shadow-[#F3056D]/30">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {aboutUsData.missionVision.mission.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isBangla
                  ? aboutUsData.missionVision.mission.bangla
                  : aboutUsData.missionVision.mission.english}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gray-50 p-8 rounded-[30px] border-2 border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <div className="w-16 h-16 bg-[#214187] rounded-2xl flex items-center justify-center text-white mb-6 shadow-md shadow-[#214187]/30">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {aboutUsData.missionVision.vision.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isBangla
                  ? aboutUsData.missionVision.vision.bangla
                  : aboutUsData.missionVision.vision.english}
              </p>
            </div>

            {/* Values Card */}
            <div className="bg-gray-50 p-8 rounded-[30px] border-2 border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <div className="w-16 h-16 bg-[#F3056D] rounded-2xl flex items-center justify-center text-white mb-6 shadow-md shadow-[#F3056D]/30">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
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
      </section>

      {/* --- WHAT WE OFFER SECTION --- */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 relative pb-3">
              {aboutUsData.whatWeOffer.title}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-20 h-1.5 bg-[#F3056D] rounded-full"></span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto mb-8 text-center">
            <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
              {isBangla
                ? aboutUsData.whatWeOffer.introBangla
                : aboutUsData.whatWeOffer.introEnglish}
            </p>

            {/* Playful Tags */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <div className="bg-white px-5 py-3 rounded-full text-[#214187] text-sm font-bold border-2 border-gray-100 shadow-sm flex items-center hover:border-[#214187]/30 transition-colors">
                <Users className="inline-block w-4 h-4 mr-2" />
                {isBangla ? "দক্ষ কোর্স" : "Expert Courses"}
              </div>
              <div className="bg-white px-5 py-3 rounded-full text-[#F3056D] text-sm font-bold border-2 border-gray-100 shadow-sm flex items-center hover:border-[#F3056D]/30 transition-colors">
                <BookOpen className="inline-block w-4 h-4 mr-2" />
                {isBangla ? "ইন্টারঅ্যাকটিভ" : "Interactive"}
              </div>
              <div className="bg-white px-5 py-3 rounded-full text-[#214187] text-sm font-bold border-2 border-gray-100 shadow-sm flex items-center hover:border-[#214187]/30 transition-colors">
                <Award className="inline-block w-4 h-4 mr-2" />
                {isBangla ? "লাইভ ক্লাস" : "Live Classes"}
              </div>
              <div className="bg-white px-5 py-3 rounded-full text-[#F3056D] text-sm font-bold border-2 border-gray-100 shadow-sm flex items-center hover:border-[#F3056D]/30 transition-colors">
                <CheckCircle className="inline-block w-4 h-4 mr-2" />
                {isBangla ? "ফ্রি ডেমো" : "Free Demo"}
              </div>
            </div>
          </div>

          <div className="mt-8 p-8 md:p-10 bg-white rounded-[30px] border-2 border-blue-100 shadow-sm text-center max-w-4xl mx-auto">
            <p className="text-sm md:text-base text-[#214187] italic font-medium">
              {isBangla
                ? aboutUsData.whatWeOffer.tagsBangla
                : aboutUsData.whatWeOffer.tagsEnglish}
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[#214187] rounded-[30px] md:rounded-[40px] py-16 md:py-24 px-6 md:px-12 text-white overflow-hidden shadow-2xl">
            {/* Playful decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3056D] blur-[120px] opacity-30 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 blur-[100px] opacity-20 rounded-full"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                {aboutUsData.cta.title}
              </h2>
              <p className="text-sm md:text-lg text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                {aboutUsData.cta.body}
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
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
                  <div className="flex items-center justify-center">
                    <span>{aboutUsData.cta.cta1}</span>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </Button>

                <a href={`tel:+8801740176774`} className="w-full sm:w-auto">
                  <div className="flex items-center justify-center gap-3 text-base md:text-lg font-medium bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                    <Phone className="w-5 h-5" />
                    {aboutUsData.cta.cta2}
                  </div>
                </a>
              </div>

              <p className="mt-6 md:mt-8 text-blue-200 font-semibold text-xs md:text-sm">
                {aboutUsData.cta.below}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
