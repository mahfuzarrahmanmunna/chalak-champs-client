"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Loader2, Star, Users, Clock, Globe, CheckCircle, ChevronRight,
  BookOpen, Award, GraduationCap, ArrowLeft, AlertCircle, UserCircle,
} from "lucide-react";
import axios from "@/lib/axios";
import { useLanguage } from "@/app/context/LanguageContext";

interface TeacherProfile {
  _id: string;
  displayName: string;
  profilePhotoUrl: string;
  professionalTitle: string;
  shortIntro: string;
  biography: string;
  slug: string;
  languagesSpoken: string[];
  subjects: string[];
  expertiseAreas: string[];
  teachingMethods: string[];
  skillsStudentsLearn: string[];
  ageGroups: string[];
  gradeLevels: string[];
  levels: string[];
  education: Array<{
    degree: string; institution: string; fieldOfStudy: string;
    completionYear: number; certificateTitle: string; verificationStatus: string;
  }>;
  experience: Array<{
    institution: string; position: string; subject: string;
    startDate: string; endDate: string; isCurrent: boolean; description: string;
  }>;
  totalYearsExperience: number;
  achievements: string[];
  awards: string[];
  childFocusedExperience: string;
  teachingPhilosophy: string;
  teachingApproach: string;
  whyTeachChildren: string;
  classFormat: string;
  preferredLanguages: string[];
  portfolio: Array<{ kind: string; url: string; caption: string; }>;
  verificationStatus: string;
}

interface Course {
  _id: string;
  title: { en: string; bn: string } | string;
  slug?: string;
  thumbnail?: string;
  subject?: string;
  lessonsCount?: number;
  price?: number;
}

function QuillContent({ html, className = "" }: { html: string; className?: string }) {
  if (!html || html === "<p><br></p>") return null;
  return (
    <>
      <style jsx global>{`
        .quill-content { color: #374151; line-height: 1.7; font-size: 1.05rem; }
        .quill-content h1 { font-size: 1.75rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #1f2937; }
        .quill-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #1f2937; }
        .quill-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.25em; margin-bottom: 0.5em; color: #1f2937; }
        .quill-content p { margin-bottom: 1em; }
        .quill-content ul { list-style: disc; margin-left: 1.5em; margin-bottom: 1em; }
        .quill-content ol { list-style: decimal; margin-left: 1.5em; margin-bottom: 1em; }
        .quill-content li { margin-bottom: 0.5em; }
        .quill-content img { max-width: 100%; border-radius: 0.5rem; margin: 1em 0; }
        .quill-content a { color: #F3056D; text-decoration: underline; font-weight: 500; }
        .quill-content table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .quill-content td, .quill-content th { border: 1px solid #e5e7eb; padding: 10px 12px; text-align: left; }
        .quill-content th { background: #f9fafb; font-weight: 600; }
        .quill-content blockquote { border-left: 4px solid #F3056D; padding: 0.75rem 1rem; margin: 1em 0; font-style: italic; color: #6b7280; background: #fdf2f8; border-radius: 0 0.5rem 0.5rem 0; }
        .quill-content pre { background: #f3f4f6; padding: 1em; border-radius: 0.5rem; overflow-x: auto; }
        .quill-content code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; color: #F3056D; }
        .quill-content strong { font-weight: 700; color: #1f2937; }
      `}</style>
      <div className={`quill-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] animate-pulse">
      <div className="bg-gray-200 h-64 md:h-80" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
          </div>
          <div className="space-y-4"><div className="h-48 bg-gray-100 rounded-2xl" /></div>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDetailClient({ lang, slug }: { lang: string; slug: string }) {
  const isBangla = lang === "bn";
  const { getLink } = useLanguage();

  const { data: teacherData, isLoading, isError } = useQuery({
    queryKey: ["public-teacher", slug],
    queryFn: async () => {
      const res = await axios.get(`/api/teachers/${slug}`);
      return res.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { data: coursesData } = useQuery({
    queryKey: ["teacher-courses", slug],
    queryFn: async () => {
      const res = await axios.get(`/api/teachers/${slug}/courses`);
      return res.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  const teacher: TeacherProfile | null = teacherData?.teacher || null;
  const courses: Course[] = coursesData?.courses || [];

  if (isLoading) return <DetailSkeleton />;

  if (isError || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center px-6 max-w-lg">
          <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? "শিক্ষক পাওয়া যায়নি" : "Teacher Not Found"}</h1>
          <p className="text-gray-500 mb-8">{isBangla ? `"${slug}" স্লাগের কোন শিক্ষক পাওয়া যায়নি।` : `No teacher found with slug "${slug}".`}</p>
          <Link href={`/${lang}/teachers`} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 bg-[#214187] text-white font-bold text-sm hover:bg-[#1a3570] transition-colors shadow-lg">
            <ArrowLeft className="h-4 w-4" />
            {isBangla ? "শিক্ষকদের তালিকায় ফিরে যান" : "Back to Teachers"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-[#214187] via-[#1a3570] to-[#0d1f4a] overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-96 h-96 bg-[#F3056D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-40px] w-72 h-72 bg-pink-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-white/20 shadow-2xl bg-gradient-to-br from-[#F3056D]/30 to-[#214187]/30 flex items-center justify-center">
              {teacher.profilePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={teacher.profilePhotoUrl} alt={teacher.displayName} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-16 h-16 md:w-20 md:h-20 text-white/40" />
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">{teacher.displayName}</h1>
                {teacher.verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-emerald-500 shadow-md">
                    <CheckCircle className="w-4 h-4" />
                    {isBangla ? "যাচাইকৃত" : "Verified"}
                  </span>
                )}
              </div>
              <p className="text-lg md:text-xl text-[#F3056D] font-semibold mb-4">{teacher.professionalTitle}</p>
              {teacher.subjects?.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {teacher.subjects.slice(0, 5).map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full text-sm font-medium text-white bg-white/10 border border-white/20">{s}</span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start text-sm text-blue-100/80">
                {teacher.totalYearsExperience > 0 && (
                  <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> {teacher.totalYearsExperience} {isBangla ? "বছর অভিজ্ঞতা" : "yrs experience"}</span>
                )}
                {teacher.ageGroups?.length > 0 && (
                  <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4" /> {isBangla ? "বয়স" : "Ages"}: {teacher.ageGroups.join(", ")}</span>
                )}
                {teacher.languagesSpoken?.length > 0 && (
                  <span className="inline-flex items-center gap-1.5"><Globe className="w-4 h-4" /> {teacher.languagesSpoken.join(", ")}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* ABOUT */}
            {(teacher.biography || teacher.shortIntro) && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 pl-4 border-[#F3056D]">{isBangla ? "শিক্ষকের সম্পর্কে" : "About the Teacher"}</h2>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                  {teacher.shortIntro && <p className="text-lg text-gray-700 font-medium mb-4 leading-relaxed">{teacher.shortIntro}</p>}
                  {teacher.biography && <QuillContent html={teacher.biography} className="text-gray-600" />}
                </div>
              </section>
            )}

            {/* SUBJECTS & EXPERTISE */}
            {teacher.subjects?.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 pl-4 border-[#F3056D]">{isBangla ? "বিষয় ও দক্ষতা" : "Subjects & Expertise"}</h2>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{isBangla ? "বিষয়সমূহ" : "Subjects"}</h3>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map((s) => <span key={s} className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#F3056D]/8 text-[#F3056D] border border-[#F3056D]/10">{s}</span>)}
                    </div>
                  </div>
                  {teacher.expertiseAreas?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{isBangla ? "দক্ষতার ক্ষেত্র" : "Areas of Expertise"}</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {teacher.expertiseAreas.map((a, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-[#F3056D] mt-0.5 flex-shrink-0" /><span>{a}</span></li>)}
                      </ul>
                    </div>
                  )}
                  {teacher.skillsStudentsLearn?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{isBangla ? "শেখার দক্ষতা" : "Skills Students Will Learn"}</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {teacher.skillsStudentsLearn.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-[#214187] mt-0.5 flex-shrink-0" /><span>{s}</span></li>)}
                      </ul>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    {teacher.ageGroups?.length > 0 && (<div><p className="text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? "বয়স" : "Age Groups"}</p><p className="text-sm text-gray-700 font-medium">{teacher.ageGroups.join(", ")}</p></div>)}
                    {teacher.gradeLevels?.length > 0 && (<div><p className="text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? "শ্রেণী" : "Grade Levels"}</p><p className="text-sm text-gray-700 font-medium">{teacher.gradeLevels.join(", ")}</p></div>)}
                    {teacher.levels?.length > 0 && (<div><p className="text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? "স্তর" : "Levels"}</p><p className="text-sm text-gray-700 font-medium capitalize">{teacher.levels.join(", ")}</p></div>)}
                  </div>
                </div>
              </section>
            )}

            {/* EDUCATION */}
            {teacher.education?.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 pl-4 border-[#F3056D]">{isBangla ? "শিক্ষাগত যোগ্যতা" : "Education & Qualifications"}</h2>
                <div className="space-y-4">
                  {teacher.education.map((edu, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#214187]/10 flex items-center justify-center flex-shrink-0"><GraduationCap className="w-5 h-5 text-[#214187]" /></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}</h4>
                        <p className="text-sm text-gray-500">{edu.institution}</p>
                        {edu.completionYear && <p className="text-xs text-gray-400 mt-1">{isBangla ? "সম্পন্ন" : "Graduated"}: {edu.completionYear}</p>}
                        {edu.verificationStatus === "verified" && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-xs text-white bg-emerald-500"><CheckCircle className="w-3 h-3" /> {isBangla ? "যাচাইকৃত" : "Verified"}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EXPERIENCE */}
            {teacher.experience?.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 pl-4 border-[#F3056D]">{isBangla ? "শিক্ষকতার অভিজ্ঞতা" : "Teaching Experience"}</h2>
                <div className="space-y-4">
                  {teacher.experience.map((exp, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-gray-900">{exp.position} · {exp.institution}</h4>
                      {exp.subject && <p className="text-sm text-[#F3056D] font-medium">{exp.subject}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ""} — {exp.isCurrent ? (isBangla ? "বর্তমান" : "Present") : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "")}
                      </p>
                      {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
                {(teacher.achievements?.length > 0 || teacher.awards?.length > 0) && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teacher.achievements?.length > 0 && (
                      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-[#F3056D]" /> {isBangla ? "অর্জনসমূহ" : "Achievements"}</h4>
                        <ul className="space-y-2">
                          {teacher.achievements.map((a, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#F3056D] mt-0.5 flex-shrink-0" /><span>{a}</span></li>)}
                        </ul>
                      </div>
                    )}
                    {teacher.awards?.length > 0 && (
                      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> {isBangla ? "পুরস্কার" : "Awards"}</h4>
                        <ul className="space-y-2">
                          {teacher.awards.map((a, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><Star className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" /><span>{a}</span></li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* PORTFOLIO */}
            {teacher.portfolio?.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 pl-4 border-[#F3056D]">{isBangla ? "পোর্টফোলিও" : "Teaching Portfolio"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teacher.portfolio.map((item, i) => {
                    const isVideo = item.kind === "introVideo" || item.kind === "demoVideo";
                    return (
                      <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                        {isVideo ? (
                          <video src={item.url} controls className="w-full aspect-video object-cover bg-black" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt={item.caption || ""} className="w-full aspect-video object-cover" />
                        )}
                        {item.caption && <p className="p-3 text-sm text-gray-500">{item.caption}</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* COURSES */}
            {courses.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 pl-4 border-[#F3056D]">{isBangla ? "এই শিক্ষকের কোর্সসমূহ" : "Courses by This Teacher"}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {courses.map((c) => {
                    const title = typeof c.title === "object" ? (isBangla ? c.title.bn : c.title.en) : c.title;
                    return (
                      <Link key={c._id} href={`/${lang}/courses/${c.slug || c._id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                        {c.thumbnail && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.thumbnail} alt={title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 group-hover:text-[#F3056D] transition-colors line-clamp-2">{title}</h4>
                          {c.subject && <p className="text-xs text-gray-400 mt-1">{c.subject}</p>}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-400">{c.lessonsCount || 0} {isBangla ? "লেসন" : "lessons"}</span>
                            {c.price != null && <span className="text-sm font-bold text-[#F3056D]">৳{c.price}</span>}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {teacher.teachingPhilosophy && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#F3056D]" />{isBangla ? "শিক্ষার দর্শন" : "Teaching Philosophy"}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{teacher.teachingPhilosophy}</p>
              </div>
            )}
            <div className="bg-gradient-to-br from-[#214187] to-[#1a3570] rounded-2xl p-6 text-center shadow-lg">
              <h3 className="text-lg font-bold text-white mb-2">{isBangla ? `${teacher.displayName}-এর সাথে শিখুন` : `Learn with ${teacher.displayName}`}</h3>
              <p className="text-sm text-blue-100/80 mb-4">{isBangla ? "এই শিক্ষকের কোর্সসমূহ দেখুন এবং ভর্তি হন।" : "Browse courses and enroll your child today."}</p>
              <Link href={getLink("/courses")} className="inline-flex items-center gap-2 px-6 py-3 bg-[#F3056D] hover:bg-[#d9045c] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#F3056D]/30 transition-all hover:scale-[1.02] active:scale-95">
                {isBangla ? "কোর্সসমূহ দেখুন" : "Browse Courses"}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}