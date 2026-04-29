"use client";
import React from "react";
import Image from "next/image";
import { BookOpen, Users, Heart, Award, Target } from "lucide-react";

export default function AboutUsPage() {
  return (
    <main className="w-full bg-[#FFF5F8] min-h-screen overflow-hidden">
      {/* --- BACKGROUND DECORATION --- */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 pointer-events-none"
        style={{ background: "#F3066E" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10">
        {/* --- SECTION 1: HERO SPLIT --- */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* Left: Text */}
          <div className="space-y-6">
            <div className="inline-block bg-[#F3066E]/10 text-[#F3066E] px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
              Who We Are
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              We Are <span className="text-[#F3066E]">Chalak</span> <br />
              Champs
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We are an interactive English learning platform designed to make
              education
              <span className="font-semibold text-gray-800">
                fun, easy, and accessible
              </span>
              for every child. Through engaging games, vibrant activities, and a
              supportive community, we transform learning into an adventure.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-[#F3066E] text-white px-8 py-3.5 rounded-full font-bold shadow-[0_10px_20px_rgba(243,5,109,0.3)] hover:scale-105 transition-transform">
                Join Our Journey
              </button>
              <button className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-3.5 rounded-full font-bold hover:border-[#F3066E] hover:text-[#F3066E] transition-colors">
                Meet The Team
              </button>
            </div>
          </div>

          {/* Right: Visual Card (Asymmetric) */}
          <div className="relative h-[400px] md:h-[500px] w-full">
            {/* Card Background */}
            <div className="absolute top-0 right-0 w-[85%] h-full bg-white rounded-[60px] shadow-2xl p-8 flex flex-col justify-between z-10 border-8 border-white overflow-hidden">
              {/* Placeholder for About Us Image */}
              <div className="relative w-full h-[60%] bg-gray-100 rounded-[40px] overflow-hidden">
                {/* Use your image here */}
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-gray-400 font-bold text-2xl">
                  Your Image Here
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#F3066E]/10 rounded-full text-[#F3066E]">
                    <Target size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Our Mission</p>
                    <p className="text-sm text-gray-500">
                      Empowering kids globally
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Shape Behind Card */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 md:w-48 md:h-48 bg-[#D9D9D9] rounded-3xl -z-0 rotate-[-10deg] opacity-80"></div>
          </div>
        </div>

        {/* --- SECTION 2: STATS (Horizontal Floating Cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {/* Stat 1 */}
          <div className="bg-white p-8 rounded-[40px] shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">10k+</h3>
            <p className="text-gray-500 font-medium">Happy Students</p>
          </div>

          {/* Stat 2 */}
          <div className="bg-[#F3066E] p-8 rounded-[40px] shadow-[0_10px_30px_rgba(243,5,109,0.3)] text-white hover:-translate-y-2 transition-transform duration-300 md:translate-y-8">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-4xl font-bold mb-1">50+</h3>
            <p className="text-white/80 font-medium">Expert Teachers</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-8 rounded-[40px] shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">100%</h3>
            <p className="text-gray-500 font-medium">Success Rate</p>
          </div>
        </div>

        {/* --- SECTION 3: OUR VALUES (Wavy Divider) --- */}
        <div className="relative mb-32">
          <div className="absolute top-[-80px] left-[-10%] w-[120%] h-32 bg-white rounded-[100%] -z-10"></div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Parents Love Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We blend traditional teaching methods with modern interactive
              technology to ensure your child gets the best of both worlds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Heart size={32} className="text-[#F3066E]" />}
              title="Child-Centric"
              desc="Our curriculum is designed with children at the center, making learning natural and enjoyable."
            />
            <ValueCard
              icon={<Target size={32} className="text-blue-600" />}
              title="Focused Growth"
              desc="We track progress carefully to ensure every child improves at their own pace."
            />
            <ValueCard
              icon={<Award size={32} className="text-yellow-500" />}
              title="Safe Environment"
              desc="A completely safe, moderated, and encouraging digital space for young learners."
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// Helper Component for Values
const ValueCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);
