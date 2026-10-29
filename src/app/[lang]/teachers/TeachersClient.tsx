"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Star,
  Clock,
  Globe,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import axios from "@/lib/axios";
import { useLanguage } from "@/app/context/LanguageContext";

interface Teacher {
  _id: string;
  displayName: string;
  professionalTitle: string;
  profilePhotoUrl: string;
  slug: string;
  shortIntro: string;
  subjects: string[];
  ageGroups: string[];
  totalYearsExperience: number;
  languagesSpoken: string[];
  verificationStatus: string;
}

const SUBJECT_OPTIONS = [
  "English", "Mathematics", "Drawing & Art", "Science", "Handwriting",
  "Phonics", "Creative Learning", "Kids' Coding", "Music", "Other",
];
const AGE_GROUPS = ["3-5", "6-8", "9-11", "12-14", "15-17"];

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200/80 animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 bg-gray-100 rounded-full w-16" />
          <div className="h-6 bg-gray-100 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

function TeacherCard({ teacher, lang }: { teacher: Teacher; lang: string }) {
  const isBangla = lang === "bn";
  const initials = teacher.displayName?.charAt(0) || "T";

  return (
    <Link
      href={`/${lang}/teachers/${teacher.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200/80 hover:shadow-xl hover:border-[#F3056D]/30 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#214187]/10 to-[#F3056D]/10">
        {teacher.profilePhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={teacher.profilePhotoUrl} alt={teacher.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-[#214187]/20">{initials}</span>
          </div>
        )}
        {teacher.verificationStatus === "verified" && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-emerald-500 shadow-md">
            <CheckCircle className="w-3 h-3" />
            {isBangla ? "যাচাইকৃত" : "Verified"}
          </span>
        )}
      </div>

      <div className="p-5 space-y-2.5">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#F3056D] transition-colors truncate">
            {teacher.displayName}
          </h3>
          <p className="text-sm text-[#F3056D] font-semibold truncate">
            {teacher.professionalTitle || (isBangla ? "শিক্ষক" : "Teacher")}
          </p>
        </div>

        {teacher.shortIntro && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {teacher.shortIntro}
          </p>
        )}

        {teacher.subjects?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {teacher.subjects.slice(0, 3).map((s) => (
              <span key={s} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F3056D]/8 text-[#F3056D] border border-[#F3056D]/10">
                {s}
              </span>
            ))}
            {teacher.subjects.length > 3 && (
              <span className="text-[11px] font-medium text-gray-400 px-1 py-1">
                +{teacher.subjects.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
          {teacher.totalYearsExperience > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#214187]" />
              {teacher.totalYearsExperience} {isBangla ? "বছর" : "yrs"}
            </span>
          )}
          {teacher.ageGroups?.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#214187]" />
              {isBangla ? "বয়স" : "Ages"}: {teacher.ageGroups.slice(0, 2).join(", ")}
            </span>
          )}
          {teacher.languagesSpoken?.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#214187]" />
              {teacher.languagesSpoken.slice(0, 2).join(", ")}
            </span>
          )}
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#F3056D] group-hover:gap-2 transition-all">
            {isBangla ? "প্রোফাইল দেখুন" : "View Profile"}
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function TeachersClient({ lang }: { lang: string }) {
  const isBangla = lang === "bn";
  const { getLink } = useLanguage();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [language, setLanguage] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["public-teachers", page, search, subject, ageGroup, language],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "9" });
      if (search) params.append("search", search);
      if (subject) params.append("subject", subject);
      if (ageGroup) params.append("ageGroup", ageGroup);
      if (language) params.append("language", language);
      const res = await axios.get(`/api/teachers?${params}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    placeholderData: (prev: any) => prev,
  });

  const teachers: Teacher[] = data?.teachers || [];
  const totalPages = data?.pagination?.totalPages || 0;
  const total = data?.pagination?.total || 0;
  const hasNext = data?.pagination?.hasNext || false;
  const hasPrev = data?.pagination?.hasPrev || false;

  const resetPage = useCallback(() => setPage(1), []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#214187] via-[#1a3570] to-[#0d1f4a] overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-96 h-96 bg-[#F3056D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-40px] w-72 h-72 bg-pink-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-6">
            <Users className="w-4 h-4 text-[#F3056D]" />
            {total} {isBangla ? "জন শিক্ষক" : "Expert Teachers"}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {isBangla ? "আমাদের শিক্ষকগণ" : "Meet Our Teachers"}
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            {isBangla
              ? "বাংলাদেশের সেরা শিক্ষকদের সাথে পরিচিত হোন। ইংরেজি, গণিত, বিজ্ঞান, আর্ট এবং আরও অনেক বিষয়ে অভিজ্ঞ শিক্ষকদের প্রোফাইল দেখুন এবং আপনার সন্তানের জন্য সেরা শিক্ষক বেছে নিন।"
              : "Meet Bangladesh's best educators. Browse profiles of expert teachers in English, Math, Science, Art, and more. Find the perfect teacher for your child."}
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                placeholder={isBangla ? "নাম, বিষয় বা পেশা দিয়ে খুঁজুন..." : "Search by name, subject, or title..."}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F5F6FA] border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F3056D]/30 focus:bg-white transition-all"
              />
            </div>
            <select value={subject} onChange={(e) => { setSubject(e.target.value); resetPage(); }} className="px-4 py-2.5 bg-[#F5F6FA] border-0 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#F3056D]/30 cursor-pointer">
              <option value="">{isBangla ? "সব বিষয়" : "All Subjects"}</option>
              {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={ageGroup} onChange={(e) => { setAgeGroup(e.target.value); resetPage(); }} className="px-4 py-2.5 bg-[#F5F6FA] border-0 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#F3056D]/30 cursor-pointer">
              <option value="">{isBangla ? "সব বয়স" : "All Ages"}</option>
              {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={language} onChange={(e) => { setLanguage(e.target.value); resetPage(); }} className="px-4 py-2.5 bg-[#F5F6FA] border-0 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#F3056D]/30 cursor-pointer">
              <option value="">{isBangla ? "সব ভাষা" : "All Languages"}</option>
              <option value="English">English</option>
              <option value="Bengali">Bengali</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-9 h-9 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {isBangla ? "শিক্ষকদের তালিকা লোড করতে সমস্যা" : "Failed to load teachers"}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {isBangla ? "দুঃখিত, কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Something went wrong. Please try again."}
            </p>
            <button onClick={() => refetch()} className="inline-flex items-center gap-2 bg-[#214187] hover:bg-[#1a3570] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-95">
              {isBangla ? "আবার চেষ্টা করুন" : "Try Again"}
            </button>
          </div>
        )}

        {!isLoading && !isError && teachers.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Filter className="w-9 h-9 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-600 mb-2">
              {isBangla ? "কোন শিক্ষক পাওয়া যায়নি" : "No teachers found"}
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              {search || subject || ageGroup || language
                ? isBangla ? "আপনার ফিল্টার বা সার্চ পরিবর্তন করে দেখুন।" : "Try adjusting your filters or search terms."
                : isBangla ? "এখনো কোন শিক্ষকের প্রোফাইল যোগ করা হয়নি।" : "No teacher profiles have been added yet."}
            </p>
            {(search || subject || ageGroup || language) && (
              <button onClick={() => { setSearch(""); setSubject(""); setAgeGroup(""); setLanguage(""); resetPage(); }} className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm transition-all">
                {isBangla ? "ফিল্টার মুছুন" : "Clear Filters"}
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && teachers.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {isBangla ? `${total} জন শিক্ষক পাওয়া গেছে` : `${total} teachers found`}
              </p>
              {isFetching && !isLoading && (
                <div className="p-1.5 rounded-lg bg-blue-50 animate-spin">
                  <Loader2 className="w-4 h-4 text-blue-500" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <TeacherCard key={teacher._id} teacher={teacher} lang={lang} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={!hasPrev} className="p-2.5 rounded-xl border border-gray-200 bg-white hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) pageNum = i + 1;
                    else if (page <= 4) pageNum = i + 1;
                    else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                    else pageNum = page - 3 + i;
                    return (
                      <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === pageNum ? "bg-[#214187] text-white shadow-lg shadow-[#214187]/30" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={!hasNext} className="p-2.5 rounded-xl border border-gray-200 bg-white hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-[#214187] to-[#1a3570] rounded-3xl p-8 md:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-[#F3056D]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {isBangla ? "আপনার সন্তানের জন্য সেরা শিক্ষক খুঁজছেন?" : "Looking for the Best Teacher for Your Child?"}
            </h2>
            <p className="text-lg text-blue-100/80 mb-8 max-w-2xl mx-auto">
              {isBangla ? "আমাদের কোর্সসমূহ দেখুন এবং আপনার সন্তানের জন্য সঠিক কোর্স বেছে নিন।" : "Browse our courses and find the perfect match for your child's learning journey."}
            </p>
            <Link href={getLink("/courses")} className="inline-flex items-center gap-2 px-10 py-4 bg-[#F3056D] hover:bg-[#d9045c] text-white font-bold text-base md:text-lg rounded-xl shadow-lg shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200">
              {isBangla ? "কোর্সসমূহ দেখুন" : "Browse Courses"}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}