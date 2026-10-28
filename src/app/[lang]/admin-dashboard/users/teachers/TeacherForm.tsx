"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  ArrowLeftIcon, PlusIcon, TrashIcon, XMarkIcon, CheckIcon,
  ArrowPathIcon, UserCircleIcon, PhotoIcon,
} from "@heroicons/react/24/outline";

// ── constants ────────────────────────────────────────────────
const SUBJECT_OPTIONS = [
  "English", "Mathematics", "Drawing & Art", "Science", "Handwriting",
  "Phonics", "Creative Learning", "Kids' Coding", "Music", "Other",
];
const AGE_GROUPS = ["3-5", "6-8", "9-11", "12-14", "15-17"];
const GRADE_LEVELS = ["Preschool", "KG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];
const LEVELS = ["beginner", "intermediate", "advanced"];
const CLASS_FORMATS = ["live", "recorded", "both"];
const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const SECTION_NAMES: Record<number, string> = {
  1: "Basic Info", 2: "Subjects", 3: "Education", 4: "Experience",
  5: "Style", 6: "Portfolio", 7: "Availability", 8: "Publish",
};

interface FormState {
  _id?: string;
  user?: { _id?: string; firstName?: string; lastName?: string; email?: string; role?: string };
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
  education: any[];
  experience: any[];
  totalYearsExperience: number;
  achievements: string[];
  awards: string[];
  childFocusedExperience: string;
  teachingPhilosophy: string;
  teachingApproach: string;
  whyTeachChildren: string;
  classFormat: string;
  preferredLanguages: string[];
  portfolio: any[];
  availability: { slots: any[]; timezone: string; classDurations: number[]; formats: string[] };
  verificationStatus: string;
  approvalStatus: string;
  approvalNote: string;
  isPublished: boolean;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  displayName: "", profilePhotoUrl: "", professionalTitle: "", shortIntro: "",
  biography: "", slug: "", languagesSpoken: [],
  subjects: [], expertiseAreas: [], teachingMethods: [], skillsStudentsLearn: [],
  ageGroups: [], gradeLevels: [], levels: [],
  education: [], experience: [], totalYearsExperience: 0,
  achievements: [], awards: [], childFocusedExperience: "",
  teachingPhilosophy: "", teachingApproach: "", whyTeachChildren: "",
  classFormat: "live", preferredLanguages: [],
  portfolio: [],
  availability: { slots: [], timezone: "Asia/Dhaka", classDurations: [], formats: [] },
  verificationStatus: "pending", approvalStatus: "pending",
  approvalNote: "", isPublished: false, isActive: true,
};

// ====================================================================
// ✅ Profile Photo Uploader — uploads to R2 via /api/admin/teachers/upload-photo
// ====================================================================
function ProfilePhotoUploader({
  photoUrl,
  onUrlChange,
  colors,
}: {
  photoUrl: string;
  onUrlChange: (url: string) => void;
  colors: any;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const { data } = await api.post("/api/admin/teachers/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });

      if (data.success && data.url) {
        onUrlChange(data.url);
        setProgress(100);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset so the same file can be re-picked
      setTimeout(() => setProgress(0), 1500);
    }
  };

  const handleRemove = () => {
    onUrlChange("");
    setError("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm mb-1 font-medium" style={{ color: colors.muted }}>
        Profile Photo
      </label>
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div
          className="w-24 h-24 rounded-xl border-2 border-dashed overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ borderColor: colors.border, backgroundColor: colors.background }}
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <UserCircleIcon className="h-10 w-10" style={{ color: colors.muted }} />
          )}
        </div>

        <div className="flex-1 space-y-2">
          {/* File input — styled as a button */}
          <label
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed cursor-pointer text-sm font-medium transition-colors"
            style={{
              borderColor: uploading ? colors.border : colors.primary,
              color: uploading ? colors.muted : colors.primary,
              backgroundColor: colors.primary + "10",
            }}
          >
            {uploading ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <PhotoIcon className="h-4 w-4" />
            )}
            {uploading
              ? `Uploading... ${progress}%`
              : photoUrl
                ? "Change Photo"
                : "Choose Photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {/* Progress bar */}
          {uploading && (
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.border }}
            >
              <div
                className="h-full transition-all"
                style={{ width: `${progress}%`, backgroundColor: colors.primary }}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs" style={{ color: colors.destructive }}>
              {error}
            </p>
          )}

          {/* Success + remove */}
          {photoUrl && !uploading && (
            <div className="flex items-center gap-3">
              <p
                className="text-xs flex items-center gap-1"
                style={{ color: colors.success }}
              >
                <CheckIcon className="h-3 w-3" /> Photo uploaded
              </p>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs underline"
                style={{ color: colors.destructive }}
              >
                Remove
              </button>
            </div>
          )}

          <p className="text-xs" style={{ color: colors.muted }}>
            JPG, PNG, WEBP, or GIF. Max 5MB. Square images work best.
          </p>

          {/* Optional: also allow pasting a URL manually */}
          <details className="text-xs">
            <summary className="cursor-pointer" style={{ color: colors.muted }}>
              Or paste a URL manually
            </summary>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              className="w-full px-3 py-2 mt-2 rounded-lg border text-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              placeholder="https://..."
            />
          </details>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
export default function TeacherForm({ mode }: { mode: "new" | "edit" }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeParams = useParams();
  const { colors } = useTheme();
  const { t } = useLanguage();

  // Get lang from URL — needed for internal redirects (admin routes live under [lang])
  const lang = (routeParams?.lang as string) || "bn";

  // Read query params — userName is for display, userId/profileId are for API
  const userId = searchParams.get("userId") || "";
  const profileId = searchParams.get("profileId") || "";
  const userName = searchParams.get("userName") || "";

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState(1);

  // ── Load existing profile in edit mode ──────────────────────
  const load = useCallback(async () => {
    if (mode === "new") {
      // Pre-fill display name from the userName query param
      if (userName) setForm((p) => ({ ...p, displayName: userName }));
      setLoading(false);
      return;
    }
    // edit mode — need profileId
    if (!profileId) {
      setMsg({ type: "err", text: "Missing ?profileId= in URL" });
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get(`/api/admin/teachers/${profileId}`);
      if (data.teacher) setForm({ ...EMPTY_FORM, ...data.teacher });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.response?.data?.message || "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  }, [mode, profileId, userName]);

  useEffect(() => { load(); }, [load]);

  // ── helpers ──────────────────────────────────────────────────
  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const toggleArray = (key: keyof FormState, value: string) =>
    setForm((p) => {
      const arr = (p[key] as string[]) || [];
      return { ...p, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });

  const addEducation = () => setField("education", [
    ...form.education,
    { degree: "", institution: "", fieldOfStudy: "", completionYear: "",
      certificateTitle: "", certificateUrl: "", verificationStatus: "pending" },
  ]);

  const addExperience = () => setField("experience", [
    ...form.experience,
    { institution: "", position: "", subject: "", startDate: "", endDate: "", isCurrent: false, description: "" },
  ]);

  const addPortfolioItem = () => setField("portfolio", [
    ...form.portfolio, { kind: "image", url: "", caption: "" },
  ]);

  const addAvailabilitySlot = () => setField("availability", {
    ...form.availability,
    slots: [...form.availability.slots, { weekday: "mon", start: "09:00", end: "17:00" }],
  });

  // ── save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      if (mode === "new") {
        if (!userId) {
          setMsg({ type: "err", text: "Missing ?userId= in URL for new profile" });
          setSaving(false);
          return;
        }
        const { data } = await api.post(`/api/admin/teachers`, { ...form, userId });
        setMsg({ type: "ok", text: "Profile created" });
        const encodedName = encodeURIComponent(userName || form.displayName);
        setTimeout(() => {
          router.push(`/${lang}/admin-dashboard/users/teachers/edit?profileId=${data.teacher._id}&userName=${encodedName}`);
        }, 600);
      } else {
        if (!profileId) {
          setMsg({ type: "err", text: "Missing ?profileId= in URL" });
          setSaving(false);
          return;
        }
        await api.put(`/api/admin/teachers/${profileId}`, form);
        setMsg({ type: "ok", text: "Profile saved" });
      }
    } catch (e: any) {
      setMsg({ type: "err", text: e?.response?.data?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const patchStatus = async (patch: Record<string, unknown>, label: string) => {
    if (!profileId) return;
    setSaving(true); setMsg(null);
    try {
      const { data } = await api.patch(`/api/admin/teachers/${profileId}/status`, patch);
      setForm((p) => ({ ...p, ...data.teacher }));
      setMsg({ type: "ok", text: `${label} applied` });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.response?.data?.message || `${label} failed` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64" style={{ backgroundColor: colors.background }}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }} />
    </div>
  );

  // ── styles ──────────────────────────────────────────────────
  const inputCls = "w-full px-3 py-2 rounded-lg border text-sm";
  const inputStyle = { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground };
  const labelCls = "block text-sm mb-1 font-medium";
  const labelStyle = { color: colors.muted };
  const sectionCls = "rounded-xl border p-5 space-y-4";
  const sectionStyle = { backgroundColor: colors.card, borderColor: colors.border };

  const title = mode === "new"
    ? `New Teacher Profile${userName ? ` — ${userName}` : ""}`
    : `Edit: ${form.displayName || userName || "Teacher"}`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/${lang}/admin-dashboard/users`} className="p-2 rounded-lg" style={{ backgroundColor: colors.card }}>
            <ArrowLeftIcon className="h-5 w-5" style={{ color: colors.foreground }} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.foreground }}>{title}</h1>
            {form.user && (
              <p className="text-sm mt-1" style={{ color: colors.muted }}>
                Linked user: {form.user.firstName} {form.user.lastName} ({form.user.email}) · role: {form.user.role}
              </p>
            )}
            {mode === "new" && userName && !form.user && (
              <p className="text-sm mt-1" style={{ color: colors.muted }}>
                Creating profile for: <strong>{userName}</strong>
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {mode === "edit" && form.approvalStatus !== "approved" && (
            <button onClick={() => patchStatus({ approvalStatus: "approved" }, "Approved")} disabled={saving}
              className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: colors.success }}>
              Approve
            </button>
          )}
          {mode === "edit" && form.approvalStatus === "approved" && !form.isPublished && (
            <button onClick={() => patchStatus({ isPublished: true }, "Published")} disabled={saving}
              className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: colors.primary }}>
              Publish
            </button>
          )}
          {mode === "edit" && form.isPublished && (
            <button onClick={() => patchStatus({ isPublished: false }, "Unpublished")} disabled={saving}
              className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.border, color: colors.foreground }}>
              Unpublish
            </button>
          )}
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: colors.primary }}>
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>

      {msg && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mb-4 p-3 rounded-lg border"
          style={{ backgroundColor: msg.type === "ok" ? colors.success + "20" : colors.destructive + "20",
                    borderColor: msg.type === "ok" ? colors.success : colors.destructive,
                    color: msg.type === "ok" ? colors.success : colors.destructive }}>
          {msg.text}
        </div>
      )}

      {/* Section nav */}
      <div className="px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button key={n} onClick={() => setActiveSection(n)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={activeSection === n
                ? { backgroundColor: colors.primary, color: "#fff" }
                : { backgroundColor: colors.card, color: colors.muted }}>
              {n}. {SECTION_NAMES[n]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        {/* ── Section 1: Basic Info ─────────────────────────── */}
        {activeSection === 1 && (
          <div className={sectionCls} style={sectionStyle}>
            <h2 className="text-lg font-bold" style={{ color: colors.foreground }}>1. Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Display Name *</label>
                <input className={inputCls} style={inputStyle} value={form.displayName}
                  onChange={(e) => setField("displayName", e.target.value)} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Professional Title *</label>
                <input className={inputCls} style={inputStyle} placeholder="e.g. Senior English Teacher"
                  value={form.professionalTitle}
                  onChange={(e) => setField("professionalTitle", e.target.value)} />
              </div>

              {/* ✅ NEW: Profile Photo Uploader (replaces the URL text input) */}
              <div className="md:col-span-2">
                <ProfilePhotoUploader
                  photoUrl={form.profilePhotoUrl}
                  onUrlChange={(url) => setField("profilePhotoUrl", url)}
                  colors={colors}
                />
              </div>

              <div>
                <label className={labelCls} style={labelStyle}>Slug (URL)</label>
                <input className={inputCls} style={inputStyle} value={form.slug} placeholder="auto-generated if blank"
                  onChange={(e) => setField("slug", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} style={labelStyle}>Short Intro (max 280 chars)</label>
                <textarea className={inputCls} style={inputStyle} rows={2} maxLength={280}
                  value={form.shortIntro} onChange={(e) => setField("shortIntro", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} style={labelStyle}>Full Biography</label>
                <textarea className={inputCls} style={inputStyle} rows={6} maxLength={4000}
                  value={form.biography} onChange={(e) => setField("biography", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} style={labelStyle}>Languages Spoken</label>
                <TagInput values={form.languagesSpoken} colors={colors}
                  onChange={(v) => setField("languagesSpoken", v)} placeholder="English, Bengali…" />
              </div>
            </div>
          </div>
        )}

        {/* ── Section 2: Subjects & Expertise ───────────────── */}
        {activeSection === 2 && (
          <div className={sectionCls} style={sectionStyle}>
            <h2 className="text-lg font-bold" style={{ color: colors.foreground }}>2. Subjects &amp; Expertise</h2>
            <div>
              <label className={labelCls} style={labelStyle}>Subjects Taught</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_OPTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleArray("subjects", s)}
                    className="px-3 py-1 rounded-full text-sm border"
                    style={form.subjects.includes(s)
                      ? { backgroundColor: colors.primary, color: "#fff", borderColor: colors.primary }
                      : { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }}>
                    {form.subjects.includes(s) ? <CheckIcon className="inline h-3 w-3 mr-1" /> : null}
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Areas of Expertise</label>
                <TagInput values={form.expertiseAreas} colors={colors}
                  onChange={(v) => setField("expertiseAreas", v)} placeholder="Conversation, Phonics, Creative Writing" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Teaching Methods</label>
                <TagInput values={form.teachingMethods} colors={colors}
                  onChange={(v) => setField("teachingMethods", v)} placeholder="Interactive, Project-based" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Skills Students Will Learn</label>
                <TagInput values={form.skillsStudentsLearn} colors={colors}
                  onChange={(v) => setField("skillsStudentsLearn", v)} placeholder="Reading, Vocabulary, Pronunciation" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Total Years Experience</label>
                <input type="number" min={0} max={80} className={inputCls} style={inputStyle}
                  value={form.totalYearsExperience}
                  onChange={(e) => setField("totalYearsExperience", parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MultiCheck label="Age Groups" options={AGE_GROUPS} values={form.ageGroups}
                onToggle={(v) => toggleArray("ageGroups", v)} colors={colors} />
              <MultiCheck label="Grade Levels" options={GRADE_LEVELS} values={form.gradeLevels}
                onToggle={(v) => toggleArray("gradeLevels", v)} colors={colors} />
              <MultiCheck label="Levels" options={LEVELS} values={form.levels}
                onToggle={(v) => toggleArray("levels", v)} colors={colors} />
            </div>
          </div>
        )}

        {/* ── Section 3: Education ──────────────────────────── */}
        {activeSection === 3 && (
          <div className={sectionCls} style={sectionStyle}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: colors.foreground }}>3. Education &amp; Qualifications</h2>
              <button onClick={addEducation} type="button"
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-white"
                style={{ backgroundColor: colors.primary }}>
                <PlusIcon className="h-4 w-4 mr-1" /> Add Education
              </button>
            </div>
            {form.education.map((edu, idx) => (
              <div key={idx} className="rounded-lg border p-4 space-y-3"
                style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium" style={{ color: colors.foreground }}>Record #{idx + 1}</h3>
                  <button type="button" onClick={() => setField("education", form.education.filter((_, i) => i !== idx))}
                    className="p-1 rounded" style={{ color: colors.destructive }}>
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className={inputCls} style={inputStyle} placeholder="Degree" value={edu.degree}
                    onChange={(e) => { const arr = [...form.education]; arr[idx].degree = e.target.value; setField("education", arr); }} />
                  <input className={inputCls} style={inputStyle} placeholder="Institution" value={edu.institution}
                    onChange={(e) => { const arr = [...form.education]; arr[idx].institution = e.target.value; setField("education", arr); }} />
                  <input className={inputCls} style={inputStyle} placeholder="Field of study" value={edu.fieldOfStudy}
                    onChange={(e) => { const arr = [...form.education]; arr[idx].fieldOfStudy = e.target.value; setField("education", arr); }} />
                  <input type="number" className={inputCls} style={inputStyle} placeholder="Completion year"
                    value={edu.completionYear}
                    onChange={(e) => { const arr = [...form.education]; arr[idx].completionYear = parseInt(e.target.value) || undefined; setField("education", arr); }} />
                  <input className={inputCls} style={inputStyle} placeholder="Certificate title" value={edu.certificateTitle}
                    onChange={(e) => { const arr = [...form.education]; arr[idx].certificateTitle = e.target.value; setField("education", arr); }} />
                  <input className={inputCls} style={inputStyle} placeholder="Certificate URL" value={edu.certificateUrl}
                    onChange={(e) => { const arr = [...form.education]; arr[idx].certificateUrl = e.target.value; setField("education", arr); }} />
                </div>
              </div>
            ))}
            {form.education.length === 0 && <EmptyState colors={colors} text="No education records yet" />}
          </div>
        )}

        {/* ── Section 4: Experience ─────────────────────────── */}
        {activeSection === 4 && (
          <div className={sectionCls} style={sectionStyle}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: colors.foreground }}>4. Teaching Experience</h2>
              <button onClick={addExperience} type="button"
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-white"
                style={{ backgroundColor: colors.primary }}>
                <PlusIcon className="h-4 w-4 mr-1" /> Add Experience
              </button>
            </div>
            {form.experience.map((exp, idx) => (
              <div key={idx} className="rounded-lg border p-4 space-y-3"
                style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium" style={{ color: colors.foreground }}>Record #{idx + 1}</h3>
                  <button type="button" onClick={() => setField("experience", form.experience.filter((_, i) => i !== idx))}
                    className="p-1 rounded" style={{ color: colors.destructive }}>
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className={inputCls} style={inputStyle} placeholder="Institution" value={exp.institution}
                    onChange={(e) => { const arr = [...form.experience]; arr[idx].institution = e.target.value; setField("experience", arr); }} />
                  <input className={inputCls} style={inputStyle} placeholder="Position" value={exp.position}
                    onChange={(e) => { const arr = [...form.experience]; arr[idx].position = e.target.value; setField("experience", arr); }} />
                  <input className={inputCls} style={inputStyle} placeholder="Subject taught" value={exp.subject}
                    onChange={(e) => { const arr = [...form.experience]; arr[idx].subject = e.target.value; setField("experience", arr); }} />
                  <input type="date" className={inputCls} style={inputStyle} value={(exp.startDate || "").slice(0, 10)}
                    onChange={(e) => { const arr = [...form.experience]; arr[idx].startDate = e.target.value; setField("experience", arr); }} />
                  <input type="date" className={inputCls} style={inputStyle} value={(exp.endDate || "").slice(0, 10)}
                    disabled={exp.isCurrent}
                    onChange={(e) => { const arr = [...form.experience]; arr[idx].endDate = e.target.value; setField("experience", arr); }} />
                  <label className="flex items-center gap-2 text-sm" style={{ color: colors.foreground }}>
                    <input type="checkbox" checked={!!exp.isCurrent}
                      onChange={(e) => { const arr = [...form.experience]; arr[idx].isCurrent = e.target.checked; setField("experience", arr); }} />
                    Currently teaching here
                  </label>
                </div>
                <textarea className={inputCls} style={inputStyle} rows={2} placeholder="Responsibilities & description"
                  value={exp.description}
                  onChange={(e) => { const arr = [...form.experience]; arr[idx].description = e.target.value; setField("experience", arr); }} />
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelCls} style={labelStyle}>Achievements</label>
                <TagInput values={form.achievements} colors={colors}
                  onChange={(v) => setField("achievements", v)} placeholder="Top regional teacher 2023" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Awards & Recognition</label>
                <TagInput values={form.awards} colors={colors}
                  onChange={(v) => setField("awards", v)} placeholder="Best Phonics Educator" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} style={labelStyle}>Child-focused Experience</label>
                <textarea className={inputCls} style={inputStyle} rows={3} maxLength={1500}
                  value={form.childFocusedExperience}
                  onChange={(e) => setField("childFocusedExperience", e.target.value)} />
              </div>
            </div>
            {form.experience.length === 0 && <EmptyState colors={colors} text="No experience records yet" />}
          </div>
        )}

        {/* ── Section 5: Teaching Style ─────────────────────── */}
        {activeSection === 5 && (
          <div className={sectionCls} style={sectionStyle}>
            <h2 className="text-lg font-bold" style={{ color: colors.foreground }}>5. Teaching Style</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls} style={labelStyle}>Teaching Philosophy</label>
                <textarea className={inputCls} style={inputStyle} rows={4} maxLength={2000}
                  value={form.teachingPhilosophy}
                  onChange={(e) => setField("teachingPhilosophy", e.target.value)} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Teaching Approach</label>
                <textarea className={inputCls} style={inputStyle} rows={4} maxLength={2000}
                  value={form.teachingApproach}
                  onChange={(e) => setField("teachingApproach", e.target.value)} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Why I enjoy teaching children</label>
                <textarea className={inputCls} style={inputStyle} rows={3} maxLength={1000}
                  value={form.whyTeachChildren}
                  onChange={(e) => setField("whyTeachChildren", e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} style={labelStyle}>Class Format</label>
                  <select className={inputCls} style={inputStyle} value={form.classFormat}
                    onChange={(e) => setField("classFormat", e.target.value)}>
                    {CLASS_FORMATS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Preferred Teaching Languages</label>
                  <TagInput values={form.preferredLanguages} colors={colors}
                    onChange={(v) => setField("preferredLanguages", v)} placeholder="English, Bengali" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Section 6: Portfolio & Media ──────────────────── */}
        {activeSection === 6 && (
          <div className={sectionCls} style={sectionStyle}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: colors.foreground }}>6. Portfolio &amp; Media</h2>
              <button onClick={addPortfolioItem} type="button"
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-white"
                style={{ backgroundColor: colors.primary }}>
                <PlusIcon className="h-4 w-4 mr-1" /> Add Media
              </button>
            </div>
            {form.portfolio.map((item, idx) => (
              <div key={idx} className="rounded-lg border p-4 space-y-3"
                style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium" style={{ color: colors.foreground }}>Item #{idx + 1}</h3>
                  <button type="button" onClick={() => setField("portfolio", form.portfolio.filter((_, i) => i !== idx))}
                    className="p-1 rounded" style={{ color: colors.destructive }}>
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select className={inputCls} style={inputStyle} value={item.kind}
                    onChange={(e) => { const arr = [...form.portfolio]; arr[idx].kind = e.target.value; setField("portfolio", arr); }}>
                    <option value="introVideo">Intro Video</option>
                    <option value="demoVideo">Teaching Demo Video</option>
                    <option value="image">Portfolio Image</option>
                    <option value="studentWork">Student Work</option>
                    <option value="awardImage">Award Image</option>
                  </select>
                  <input className={inputCls} style={inputStyle} placeholder="URL" value={item.url}
                    onChange={(e) => { const arr = [...form.portfolio]; arr[idx].url = e.target.value; setField("portfolio", arr); }} />
                  <input className={inputCls} style={inputStyle} placeholder="Caption" value={item.caption}
                    onChange={(e) => { const arr = [...form.portfolio]; arr[idx].caption = e.target.value; setField("portfolio", arr); }} />
                </div>
              </div>
            ))}
            {form.portfolio.length === 0 && <EmptyState colors={colors} text="No portfolio items yet" />}
            <p className="text-xs mt-2" style={{ color: colors.muted }}>
              ⚠️ Avoid uploading children's faces or names without consent.
            </p>
          </div>
        )}

        {/* ── Section 7: Availability ───────────────────────── */}
        {activeSection === 7 && (
          <div className={sectionCls} style={sectionStyle}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: colors.foreground }}>7. Teaching Availability</h2>
              <button onClick={addAvailabilitySlot} type="button"
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-white"
                style={{ backgroundColor: colors.primary }}>
                <PlusIcon className="h-4 w-4 mr-1" /> Add Slot
              </button>
            </div>
            {form.availability.slots.map((slot, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className={labelCls} style={labelStyle}>Weekday</label>
                  <select className={inputCls} style={inputStyle} value={slot.weekday}
                    onChange={(e) => { const arr = [...form.availability.slots]; arr[idx].weekday = e.target.value;
                      setField("availability", { ...form.availability, slots: arr }); }}>
                    {WEEKDAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Start (HH:mm)</label>
                  <input type="time" className={inputCls} style={inputStyle} value={slot.start}
                    onChange={(e) => { const arr = [...form.availability.slots]; arr[idx].start = e.target.value;
                      setField("availability", { ...form.availability, slots: arr }); }} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>End (HH:mm)</label>
                  <input type="time" className={inputCls} style={inputStyle} value={slot.end}
                    onChange={(e) => { const arr = [...form.availability.slots]; arr[idx].end = e.target.value;
                      setField("availability", { ...form.availability, slots: arr }); }} />
                </div>
                <button type="button"
                  onClick={() => setField("availability", {
                    ...form.availability,
                    slots: form.availability.slots.filter((_, i) => i !== idx),
                  })}
                  className="px-3 py-2 rounded-lg" style={{ color: colors.destructive }}>
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className={labelCls} style={labelStyle}>Time zone</label>
                <input className={inputCls} style={inputStyle} value={form.availability.timezone}
                  onChange={(e) => setField("availability", { ...form.availability, timezone: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Class Durations (minutes)</label>
                <TagInput values={form.availability.classDurations.map(String)} colors={colors}
                  onChange={(v) => setField("availability", {
                    ...form.availability,
                    classDurations: v.map((x) => parseInt(x) || 0).filter(Boolean),
                  })} placeholder="30, 45, 60" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Supported Formats</label>
                <TagInput values={form.availability.formats} colors={colors}
                  onChange={(v) => setField("availability", { ...form.availability, formats: v })}
                  placeholder="1-on-1, Group, Workshop" />
              </div>
            </div>
          </div>
        )}

        {/* ── Section 8: Review & Publication ───────────────── */}
        {activeSection === 8 && (
          <div className={sectionCls} style={sectionStyle}>
            <h2 className="text-lg font-bold" style={{ color: colors.foreground }}>8. Review &amp; Publication</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Verification Status</label>
                <select className={inputCls} style={inputStyle} value={form.verificationStatus}
                  onChange={(e) => setField("verificationStatus", e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Approval Status</label>
                <select className={inputCls} style={inputStyle} value={form.approvalStatus}
                  onChange={(e) => setField("approvalStatus", e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} style={labelStyle}>Approval Note (internal)</label>
                <textarea className={inputCls} style={inputStyle} rows={3} maxLength={500}
                  value={form.approvalNote}
                  onChange={(e) => setField("approvalNote", e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm" style={{ color: colors.foreground }}>
                <input type="checkbox" checked={form.isPublished}
                  onChange={(e) => setField("isPublished", e.target.checked)} />
                Published (visible on public site)
              </label>
              <label className="flex items-center gap-2 text-sm" style={{ color: colors.foreground }}>
                <input type="checkbox" checked={form.isActive}
                  onChange={(e) => setField("isActive", e.target.checked)} />
                Active
              </label>
            </div>
            <p className="text-xs mt-4" style={{ color: colors.muted }}>
              Only <strong>Approved + Published + Active</strong> profiles appear publicly. Saving here updates content;
              use the header buttons to apply status changes server-side.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── reusable bits ────────────────────────────────────────────
function TagInput({ values, onChange, colors, placeholder }: {
  values: string[]; onChange: (v: string[]) => void; colors: any; placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...values, ...parts]);
    setInput("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2">
        {values.map((v, i) => (
          <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs"
            style={{ backgroundColor: colors.accent + "30", color: colors.foreground }}>
            {v}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="ml-1"><XMarkIcon className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 px-3 py-2 rounded-lg border text-sm"
          style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          onBlur={add} />
        <button type="button" onClick={add}
          className="px-3 py-2 rounded-lg text-sm text-white"
          style={{ backgroundColor: colors.primary }}>
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function MultiCheck({ label, options, values, onToggle, colors }: {
  label: string; options: string[]; values: string[]; onToggle: (v: string) => void; colors: any;
}) {
  return (
    <div>
      <label className="block text-sm mb-1 font-medium" style={{ color: colors.muted }}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" onClick={() => onToggle(o)}
            className="px-2 py-1 rounded-full text-xs border"
            style={values.includes(o)
              ? { backgroundColor: colors.primary, color: "#fff", borderColor: colors.primary }
              : { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }}>
            {values.includes(o) ? <CheckIcon className="inline h-3 w-3 mr-1" /> : null}{o}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ colors, text }: { colors: any; text: string }) {
  return <p className="text-sm italic py-4 text-center" style={{ color: colors.muted }}>{text}</p>;
}