"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { MagnifyingGlassIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

const SUBJECT_OPTIONS = ["English", "Mathematics", "Drawing & Art", "Science", "Handwriting", "Phonics", "Creative Learning", "Kids' Coding", "Music"];
const AGE_GROUPS = ["3-5", "6-8", "9-11", "12-14", "15-17"];

interface Teacher {
  _id: string; slug: string; displayName: string; professionalTitle: string;
  profilePhotoUrl: string; shortIntro: string; subjects: string[];
  ageGroups: string[]; totalYearsExperience: number; verificationStatus: string;
  languagesSpoken: string[];
}

export default function PublicTeachersPage({ params }: { params: { lang: string } }) {
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [language, setLanguage] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "9" });
      if (search) params.append("search", search);
      if (subject) params.append("subject", subject);
      if (ageGroup) params.append("ageGroup", ageGroup);
      if (language) params.append("language", language);
      const { data } = await api.get(`/api/teachers?${params}`);
      setTeachers(data.teachers || []);
      setTotalPages(data.pagination?.totalPages || 0);
    } catch (e) { setTeachers([]); }
    finally { setLoading(false); }
  }, [page, search, subject, ageGroup, language]);

  useEffect(() => { fetch(); }, [fetch]);

  const inputCls = "w-full px-3 py-2 rounded-lg border text-sm";
  const inputStyle = { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Hero */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-4xl font-extrabold" style={{ color: colors.foreground }}>
          {String(t.meetOurTeachers || "Meet Our Teachers")}
        </h1>
        <p className="mt-3 text-base max-w-2xl mx-auto" style={{ color: colors.muted }}>
          Certified, child-focused educators for English, Math, Science, Art, Handwriting and more.
        </p>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5" style={{ color: colors.muted }} />
            <input className={inputCls + " pl-10"} style={inputStyle} placeholder="Search…"
              value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
          </div>
          <select className={inputCls} style={inputStyle} value={subject}
            onChange={(e) => { setPage(1); setSubject(e.target.value); }}>
            <option value="">All Subjects</option>
            {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className={inputCls} style={inputStyle} value={ageGroup}
            onChange={(e) => { setPage(1); setAgeGroup(e.target.value); }}>
            <option value="">All Ages</option>
            {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <input className={inputCls} style={inputStyle} placeholder="Language (e.g. English)"
            value={language} onChange={(e) => { setPage(1); setLanguage(e.target.value); }} />
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} colors={colors} />)}
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-16" style={{ color: colors.muted }}>
              No teachers match your filters yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((tr) => (
                <Link key={tr._id} href={`/${params.lang}/teachers/${tr.slug}`}
                  className="rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: colors.card }}>
                  <div className="aspect-[4/3] relative" style={{ backgroundColor: colors.accent + "30" }}>
                    {tr.profilePhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tr.profilePhotoUrl} alt={tr.displayName}
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold" style={{ color: colors.primary }}>
                          {tr.displayName?.charAt(0) || "T"}
                        </span>
                      </div>
                    )}
                    {tr.verificationStatus === "verified" && (
                      <span className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1"
                        style={{ backgroundColor: colors.success }}>
                        <CheckBadgeIcon className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold" style={{ color: colors.foreground }}>{tr.displayName}</h3>
                    <p className="text-sm" style={{ color: colors.muted }}>{tr.professionalTitle}</p>
                    {tr.shortIntro && (
                      <p className="text-sm mt-2 line-clamp-2" style={{ color: colors.foreground }}>
                        {tr.shortIntro}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {tr.subjects.slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-xs"
                          style={{ backgroundColor: colors.accent + "30", color: colors.foreground }}>{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: colors.border }}>
                      <span className="text-xs" style={{ color: colors.muted }}>
                        {tr.totalYearsExperience} yrs exp
                      </span>
                      <span className="text-xs font-medium" style={{ color: colors.primary }}>
                        View Profile →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
                style={{ backgroundColor: colors.card, color: colors.foreground }}>Previous</button>
              <span className="text-sm" style={{ color: colors.muted }}>Page {page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
                style={{ backgroundColor: colors.card, color: colors.foreground }}>Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard({ colors }: { colors: any }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: colors.card }}>
      <div className="aspect-[4/3] animate-pulse" style={{ backgroundColor: colors.border + "40" }} />
      <div className="p-5 space-y-2">
        <div className="h-5 w-2/3 animate-pulse rounded" style={{ backgroundColor: colors.border + "60" }} />
        <div className="h-3 w-1/2 animate-pulse rounded" style={{ backgroundColor: colors.border + "40" }} />
        <div className="h-3 w-full animate-pulse rounded mt-3" style={{ backgroundColor: colors.border + "40" }} />
      </div>
    </div>
  );
}