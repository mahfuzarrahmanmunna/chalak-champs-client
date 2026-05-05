import { Award, BookOpen, Heart, Star, Target, Users } from 'lucide-react';
import React from 'react';

const AboutUsContent = () => {
    return (
      <main className="min-h-screen bg-white">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          {/* Background Decorations */}
          <div
            className="absolute top-10 right-0 w-64 h-64 rounded-full blur-[80px] opacity-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, #F3066E 0%, transparent 70%)",
            }}
          ></div>

          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-secondary mb-6 leading-tight">
              We Believe <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3066E] to-[#C6005F]">
                Every Child Is A Champ
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Chalak Champs is dedicated to making English learning accessible,
              fun, and effective for children everywhere. We turn lessons into
              adventures.
            </p>
          </div>
        </section>

        {/* --- OUR STORY --- */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-[#F3066E] pl-4">
                  Our Story
                </h2>
                <p className="text-gray-600 leading-7">
                  It all started with a simple observation: children learn best
                  when they are having fun. Traditional rote memorization was
                  scaring kids away from English. We decided to change that.
                </p>
                <p className="text-gray-600 leading-7">
                  Founded by educators and parents, Chalak Champs combines
                  curriculum excellence with gamified elements. We don&lsquo;t
                  just teach English; we inspire confidence. Whether it&lsquo;s
                  a shy child or an eager speaker, our platform adapts to their
                  pace.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-[#F3066E]">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-gray-700">
                    Created with love for children.
                  </span>
                </div>
              </div>

              <div className="order-1 md:order-2 relative">
                {/* Image Placeholder - Replace with actual image */}
                <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[40px] overflow-hidden shadow-xl bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-80 transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: "url('/videoimg.jpg')" }}
                  ></div>
                  {/* Optional: Add play icon or 'Our Story' text overlay here */}
                  <div className="relative z-10 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-[#F3066E] shadow-lg">
                    Our Journey
                  </div>
                </div>

                {/* Decorative Circle */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 border-4 border-[#1B386B] rounded-xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* --- MISSION & VISION --- */}
        <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Mission & Vision
              </h2>
              <div className="w-24 h-1 bg-[#F3066E] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission Card */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-pink-100">
                <div className="w-14 h-14 bg-[#F3066E]/10 rounded-2xl flex items-center justify-center text-[#F3066E] mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Our Mission
                </h3>
                <p className="text-gray-600">
                  To democratize English education by providing high-quality,
                  engaging content that removes the fear of speaking.
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  To become the world&lsquo;s most loved English learning
                  platform for children, fostering creativity and communication.
                </p>
              </div>

              {/* Values Card */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Our Values
                </h3>
                <p className="text-gray-600">
                  Fun, Safety, Inclusivity, and Excellence. We believe every
                  child deserves a champion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- WHY CHOOSE US --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/3">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Why Choose Us?
                </h2>
                <p className="text-gray-600 mb-6">
                  We are not just another app. We are a community of learners,
                  parents, and educators focused on results with a smile.
                </p>
                <button className="px-8 py-3 bg-[#F3066E] text-white rounded-full font-semibold shadow-lg hover:bg-[#C6005F] transition-colors">
                  Meet Our Team
                </button>
              </div>

              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Users className="text-[#F3066E]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      Expert Instructors
                    </h4>
                    <p className="text-sm text-gray-500">
                      Native and bilingual teachers trained in child psychology.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <BookOpen className="text-[#F3066E]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      Gamified Learning
                    </h4>
                    <p className="text-sm text-gray-500">
                      Stories, quizzes, and interactive videos that kids
                      actually love.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Award className="text-[#F3066E]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      Certified Curriculum
                    </h4>
                    <p className="text-sm text-gray-500">
                      Aligned with global standards for K-12 English learning.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Target className="text-[#F3066E]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Speaking Focus</h4>
                    <p className="text-sm text-gray-500">
                      We prioritize conversation and pronunciation over boring
                      grammar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-20 bg-[#1B386B] text-white relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#F3066E] blur-[100px] opacity-20 rounded-full"></div>

          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of parents and kids who are already loving Chalak
              Champs. Book your first class for free!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-[#1B386B] rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl">
                Book A Free Class
              </button>
              <button className="px-8 py-4 border border-white rounded-full font-bold hover:bg-white/10 transition-colors">
                View Courses
              </button>
            </div>
          </div>
        </section>
      </main>
    );
};

export default AboutUsContent;