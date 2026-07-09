import { useLanguage } from '@/app/context/LanguageContext';
import { Briefcase, Clock, Star, TrendingUp, Users } from 'lucide-react';
import React from 'react';

const InstructorSection = ({ instructor }: { instructor: InstructorData }) => {
      const { isBangla } = useLanguage();
      const hasDetailedInfo = !!(instructor.name || instructor.designation);
    
    return (
              <div className="scroll-mt-36 md:scroll-mt-40 mb-12">
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/50 relative overflow-hidden group">
                  {/*  Enhanced Background Decorations */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-50 to-rose-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-50 to-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 transition-transform duration-700 group-hover:scale-110" />

                  {/*  Unique Corner Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-bl-[80px]">
                    <div className="absolute top-4 right-4 w-24 h-24 border-[16px] border-[#F3056D]/[0.04] rounded-full"></div>
                  </div>

                  <div className="relative z-10">
                    {/*  Upgraded Badge */}
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#F3056D]/10 to-rose-50 text-[#F3056D] border border-[#F3056D]/15 mb-7 shadow-sm shadow-[#F3056D]/5">
                      <Star className="h-3.5 w-3.5 fill-[#F3056D] text-[#F3056D]" />
                      {instructor.title}
                    </span>

                    <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start">
                      {/*  Premium Avatar with Glow & Status */}
                      <div className="relative flex-shrink-0">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1.5 bg-gradient-to-br from-[#214187] to-[#F3056D] rounded-2xl opacity-20 blur-md group-hover:opacity-30 transition-opacity duration-500"></div>

                        {/* Avatar Container */}
                        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[#214187] via-[#1e3a8a] to-[#0f172a] flex items-center justify-center shadow-xl shadow-[#214187]/20 border border-white/20">
                          <Users
                            className="h-10 w-10 text-white/80"
                            strokeWidth={1.5}
                          />
                        </div>

                        {/* Online/Active Status Dot */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>
                      </div>

                      {/*  Refined Text Content */}
                      <div className="flex-1 pt-1">
                        <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight">
                          {instructor.name}
                        </h3>

                        {/* Designation with Icon */}
                        <p className="text-[15px] text-gray-500 font-medium mb-5 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          {instructor.designation}
                        </p>

                        {/*  Upgraded Stats into "Metric Pills" */}
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gray-50/80 rounded-xl border border-gray-100 group-hover:border-gray-200 transition-colors">
                            <div className="p-1 bg-[#214187]/10 rounded-md">
                              <Clock className="w-3.5 h-3.5 text-[#214187]" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {instructor.experience}
                            </span>
                          </div>

                          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-amber-50/50 rounded-xl border border-amber-100/60 group-hover:border-amber-200/60 transition-colors">
                            <div className="p-1 bg-amber-100/80 rounded-md">
                              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {instructor.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    );
};

export default InstructorSection;