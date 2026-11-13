"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/hooks/useAuth";
import gsap from "gsap";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Camera,
  Edit3,
  Save,
  X,
  Award,
  Trophy,
  Flame,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Shield,
  Bell,
  Palette,
  Globe,
  ChevronRight,
  CheckCircle2,
  Lock,
  Sparkles,
  GraduationCap,
  Zap,
  Crown,
  Music,
  Code2,
  Microscope,
  Pencil,
  Rocket,
  Users,
  CircleCheck,
  Loader2,
  Send,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// ===================== TYPES =====================

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  earnedAt: string;
  isUnlocked: boolean;
}

interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  photoURL: string;
  uid: string;
  createdAt?: string;
}

// ===================== MOCK DATA =====================

const PROFILE_BADGES: Badge[] = [
  { id: "b1", title: "Science Explorer", description: "Completed 15 science lessons", icon: Microscope, color: "#214187", earnedAt: "2025-01-10", isUnlocked: true },
  { id: "b2", title: "Math Wizard", description: "Scored 100% on 3 math quizzes", icon: Target, color: "#F3056D", earnedAt: "2025-02-05", isUnlocked: true },
  { id: "b3", title: "7-Day Streak", description: "Learned 7 days in a row", icon: Flame, color: "#ffd700", earnedAt: "2025-03-12", isUnlocked: true },
  { id: "b4", title: "Art Lover", description: "Completed all art lessons", icon: Pencil, color: "#F3056D", earnedAt: "2025-02-20", isUnlocked: true },
  { id: "b5", title: "Code Ninja", description: "Complete 10 coding challenges", icon: Code2, color: "#214187", earnedAt: "", isUnlocked: false },
  { id: "b6", title: "Music Maestro", description: "Finish the music course", icon: Music, color: "#ffd700", earnedAt: "", isUnlocked: false },
  { id: "b7", title: "Space Cadet", description: "Complete all space lessons", icon: Rocket, color: "#F3056D", earnedAt: "", isUnlocked: false },
  { id: "b8", title: "Social Butterfly", description: "Help 5 classmates in forums", icon: Users, color: "#214187", earnedAt: "", isUnlocked: false },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "a1", action: "Completed Lesson", detail: "Solar System Tour — Science Explorers", time: "2 hours ago", icon: CheckCircle2, color: "#4ade80" },
  { id: "a2", action: "Earned Badge", detail: "7-Day Streak Champion", time: "5 hours ago", icon: Award, color: "#ffd700" },
  { id: "a3", action: "Quiz Score", detail: "Addition Adventures — 95% (A+)", time: "Yesterday", icon: Target, color: "#F3056D" },
  { id: "a4", action: "Started Course", detail: "Coding with Blocks", time: "2 days ago", icon: BookOpen, color: "#214187" },
  { id: "a5", action: "Homework Submitted", detail: "Color Mixing Worksheet — Art", time: "3 days ago", icon: Pencil, color: "#ffd700" },
];

const SKILL_DATA = [
  { label: "Mathematics", level: 72, color: "#F3056D" },
  { label: "Science", level: 85, color: "#214187" },
  { label: "Art & Craft", level: 45, color: "#ffd700" },
  { label: "Technology", level: 30, color: "#F3056D" },
  { label: "Language", level: 60, color: "#214187" },
];

const VERIFICATION_CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

// ===================== COMPONENT =====================

export default function MyProfilePage() {
  const { isDarkMode } = useTheme();
  const { currentUser, appUser } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  // --- Profile Data State ---
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "student",
    photoURL: "",
    uid: "",
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
// console.log(profileData)
  // --- Edit State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    birthday: "2015-06-15",
    grade: "Class 4",
    school: "Sunshine Primary School",
    bio: "I love science and art! I want to be an astronaut when I grow up. 🚀",
    location: "Dhaka, Bangladesh",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // --- Phone Verification Flow ---
  const [phoneFlow, setPhoneFlow] = useState({
    step: "idle" as "idle" | "input" | "sending" | "code" | "verifying" | "verified" | "error",
    newPhone: "",
    code: "",
    error: "",
    timer: 0,
  });

  // --- Email Verification Flow ---
  const [emailFlow, setEmailFlow] = useState({
    step: "idle" as "idle" | "input" | "sending" | "code" | "verifying" | "verified" | "error",
    newEmail: "",
    code: "",
    error: "",
    timer: 0,
  });

  // --- Toast State ---
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  // --- Badge Tab ---
  const [activeBadgeTab, setActiveBadgeTab] = useState<"earned" | "locked">("earned");

  // =================== API: Fetch Profile ===================
  const fetchProfile = useCallback(async () => {
    if (!currentUser) {
      setProfileData({
        firstName: appUser?.firstName || "Little",
        lastName: appUser?.lastName || "Learner",
        email: appUser?.email || "",
        phoneNumber: appUser?.phoneNumber || "",
        role: appUser?.role || "student",
        photoURL: appUser?.profileImageUrl || appUser?.photoURL || "",
        uid: "",
      });
      setEditForm((prev) => ({
        ...prev,
        firstName: appUser?.firstName || "Little",
        lastName: appUser?.lastName || "Learner",
      }));
      setIsLoadingProfile(false);
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        const fetchedData = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || currentUser?.email || "",
          phoneNumber: user.phoneNumber || currentUser?.phoneNumber || "",
          role: user.role || "student",
          photoURL:
            user.profileImageUrl ||
            user.photoURL ||
            user.avatar ||
            currentUser?.photoURL ||
            "",
          uid: user.uid || currentUser.uid,
          createdAt: user.createdAt,
        };
        setProfileData(fetchedData);
        setEditForm((prev) => ({
          ...prev,
          firstName: fetchedData.firstName,
          lastName: fetchedData.lastName,
        }));
      } else {
        const fallbackData = {
          firstName: appUser?.firstName || currentUser?.displayName?.split(" ")[0] || "Little",
          lastName: appUser?.lastName || currentUser?.displayName?.split(" ").slice(1).join(" ") || "Learner",
          email: appUser?.email || currentUser?.email || "",
          phoneNumber: appUser?.phoneNumber || currentUser?.phoneNumber || "",
          role: appUser?.role || "student",
          photoURL:
            appUser?.profileImageUrl ||
            appUser?.photoURL ||
            currentUser?.photoURL ||
            "",
          uid: currentUser.uid,
        };
        setProfileData(fallbackData);
        setEditForm((prev) => ({
          ...prev,
          firstName: fallbackData.firstName,
          lastName: fallbackData.lastName,
        }));
      }
    } catch {
      const fallbackData = {
        firstName: appUser?.firstName || currentUser?.displayName?.split(" ")[0] || "Little",
        lastName: appUser?.lastName || currentUser?.displayName?.split(" ").slice(1).join(" ") || "Learner",
        email: appUser?.email || currentUser?.email || "",
        phoneNumber: appUser?.phoneNumber || currentUser?.phoneNumber || "",
        role: appUser?.role || "student",
        photoURL:
          appUser?.profileImageUrl ||
          appUser?.photoURL ||
          currentUser?.photoURL ||
          "",
        uid: currentUser.uid,
      };
      setProfileData(fallbackData);
      setEditForm((prev) => ({
        ...prev,
        firstName: fallbackData.firstName,
        lastName: fallbackData.lastName,
      }));
    } finally {
      setIsLoadingProfile(false);
    }
  }, [currentUser, appUser, BACKEND_URL]);
// console.log(
//   currentUser
// )
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // =================== Timer Effects ===================
  useEffect(() => {
    if (phoneFlow.timer > 0) {
      const t = setTimeout(() => setPhoneFlow((p) => ({ ...p, timer: p.timer - 1 })), 1000);
      return () => clearTimeout(t);
    }
  }, [phoneFlow.timer]);

  useEffect(() => {
    if (emailFlow.timer > 0) {
      const t = setTimeout(() => setEmailFlow((p) => ({ ...p, timer: p.timer - 1 })), 1000);
      return () => clearTimeout(t);
    }
  }, [emailFlow.timer]);

  // =================== Toast Auto-dismiss ===================
  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast((p) => ({ ...p, show: false })), 3500);
      return () => clearTimeout(t);
    }
  }, [toast.show]);

  // =================== GSAP Animations ===================
  useEffect(() => {
    if (isLoadingProfile) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".profile-hero", { y: 30, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" });
      gsap.fromTo(".stat-card", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.2 });
      gsap.fromTo(".section-card", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.35 });
      gsap.fromTo(".skill-bar-fill", { width: "0%" }, {
        width: (i: number) => `${SKILL_DATA[i]?.level || 0}%`,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.6,
      });
    }, containerRef);
    return () => ctx.revert();
  }, [isLoadingProfile]);

  // Toast GSAP
  useEffect(() => {
    if (toast.show) {
      const el = document.getElementById("profile-toast");
      if (el) {
        gsap.fromTo(el, { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
      }
    }
  }, [toast.show]);

  // =================== Helpers ===================
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
  };

  const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = currentUser ? await currentUser.getIdToken() : "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const displayName = `${profileData.firstName} ${profileData.lastName}`.trim() || "Little Learner";

  const profileCompletion = (() => {
    let count = 0;
    let total = 5;
    if (profileData.firstName) count++;
    if (profileData.email) count++;
    if (profileData.phoneNumber) count++;
    if (editForm.grade) count++;
    if (editForm.school) count++;
    return Math.round((count / total) * 100);
  })();

  const earnedBadges = PROFILE_BADGES.filter((b) => b.isUnlocked);
  const lockedBadges = PROFILE_BADGES.filter((b) => !b.isUnlocked);
  const displayBadges = activeBadgeTab === "earned" ? earnedBadges : lockedBadges;

  // =================== API: Save Name ===================
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
        }),
      });

      if (res.ok) {
        setProfileData((p) => ({ ...p, firstName: editForm.firstName.trim(), lastName: editForm.lastName.trim() }));
        showToast("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setProfileData((p) => ({ ...p, firstName: editForm.firstName.trim(), lastName: editForm.lastName.trim() }));
        showToast("Profile updated locally!", "success");
        setIsEditing(false);
      }
    } catch {
      showToast("Failed to save. Check your connection.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm((prev) => ({ ...prev, firstName: profileData.firstName, lastName: profileData.lastName }));
    setPhoneFlow({ step: "idle", newPhone: "", code: "", error: "", timer: 0 });
    setEmailFlow({ step: "idle", newEmail: "", code: "", error: "", timer: 0 });
  };

  // =================== API: Upload Image ===================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB.", "error");
      return;
    }

    setIsUploadingImage(true);
    try {
      const token = currentUser ? await currentUser.getIdToken() : "";
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(`${BACKEND_URL}/api/auth/profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.imageUrl || data.url || data.photoURL || "";
        if (imageUrl) {
          setProfileData((p) => ({ ...p, photoURL: imageUrl }));
          showToast("Profile image updated!");
        } else {
          showToast("Image uploaded but no URL returned.", "error");
        }
      } else {
        showToast("Failed to upload image.", "error");
      }
    } catch {
      showToast("Upload failed. Check your connection.", "error");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // =================== API: Phone Verification ===================
  const handleSendPhoneCode = async () => {
    if (!phoneFlow.newPhone.trim()) {
      setPhoneFlow((p) => ({ ...p, error: "Phone number is required" }));
      return;
    }
    setPhoneFlow((p) => ({ ...p, step: "sending", error: "" }));
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${BACKEND_URL}/api/auth/send-phone-verification`, {
        method: "POST",
        headers,
        body: JSON.stringify({ phoneNumber: phoneFlow.newPhone.trim() }),
      });
      if (res.ok) {
        setPhoneFlow((p) => ({ ...p, step: "code", timer: RESEND_COOLDOWN, error: "" }));
        showToast("Verification code sent!");
      } else {
        const data = await res.json();
        setPhoneFlow((p) => ({ ...p, step: "input", error: data.message || "Failed to send code" }));
      }
    } catch {
      setPhoneFlow((p) => ({ ...p, step: "input", error: "Network error. Try again." }));
    }
  };

  const handleVerifyPhoneCode = async () => {
    if (phoneFlow.code.length !== VERIFICATION_CODE_LENGTH) {
      setPhoneFlow((p) => ({ ...p, error: `Enter ${VERIFICATION_CODE_LENGTH}-digit code` }));
      return;
    }
    setPhoneFlow((p) => ({ ...p, step: "verifying", error: "" }));
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-phone-code`, {
        method: "POST",
        headers,
        body: JSON.stringify({ phoneNumber: phoneFlow.newPhone.trim(), code: phoneFlow.code }),
      });
      if (res.ok) {
        setPhoneFlow((p) => ({ ...p, step: "verified", error: "" }));
        setProfileData((p) => ({ ...p, phoneNumber: phoneFlow.newPhone.trim() }));
        showToast("Phone number verified!");
      } else {
        const data = await res.json();
        setPhoneFlow((p) => ({ ...p, step: "code", error: data.message || "Invalid code" }));
      }
    } catch {
      setPhoneFlow((p) => ({ ...p, step: "code", error: "Network error. Try again." }));
    }
  };

  // =================== API: Email Verification ===================
  const handleSendEmailCode = async () => {
    if (!emailFlow.newEmail.trim() || !/\S+@\S+\.\S+/.test(emailFlow.newEmail)) {
      setEmailFlow((p) => ({ ...p, error: "Enter a valid email address" }));
      return;
    }
    setEmailFlow((p) => ({ ...p, step: "sending", error: "" }));
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${BACKEND_URL}/api/auth/send-email-verification`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: emailFlow.newEmail.trim() }),
      });
      if (res.ok) {
        setEmailFlow((p) => ({ ...p, step: "code", timer: RESEND_COOLDOWN, error: "" }));
        showToast("Verification code sent to your email!");
      } else {
        const data = await res.json();
        setEmailFlow((p) => ({ ...p, step: "input", error: data.message || "Failed to send code" }));
      }
    } catch {
      setEmailFlow((p) => ({ ...p, step: "input", error: "Network error. Try again." }));
    }
  };

  const handleVerifyEmailCode = async () => {
    if (emailFlow.code.length !== VERIFICATION_CODE_LENGTH) {
      setEmailFlow((p) => ({ ...p, error: `Enter ${VERIFICATION_CODE_LENGTH}-digit code` }));
      return;
    }
    setEmailFlow((p) => ({ ...p, step: "verifying", error: "" }));
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-email-code`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: emailFlow.newEmail.trim(), code: emailFlow.code }),
      });
      if (res.ok) {
        setEmailFlow((p) => ({ ...p, step: "verified", error: "" }));
        setProfileData((p) => ({ ...p, email: emailFlow.newEmail.trim() }));
        showToast("Email verified!");
      } else {
        const data = await res.json();
        setEmailFlow((p) => ({ ...p, step: "code", error: data.message || "Invalid code" }));
      }
    } catch {
      setEmailFlow((p) => ({ ...p, step: "code", error: "Network error. Try again." }));
    }
  };

  // =================== Theme Tokens ===================
  const cardBg = isDarkMode ? "rgba(26,16,53,0.6)" : "#fff";
  const cardBorder = isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(33,65,135,0.06)";
  const textPrimary = isDarkMode ? "#fff" : "#214187";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(33,65,135,0.5)";
  const textMuted = isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(33,65,135,0.35)";
  const inputBg = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(33,65,135,0.04)";
  const inputBorder = isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(33,65,135,0.1)";

  // =================== RENDER: Loading ===================
  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse" style={{ background: "linear-gradient(135deg, #F3056D, #ffd700)" }}>
            <User className="h-8 w-8 text-white" />
          </div>
          <p className="text-sm font-medium" style={{ color: textSecondary }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // =================== Verification Flow Sub-component ===================
  const VerificationFlow = ({ flow, setFlow, fieldLabel, sendHandler, verifyHandler, placeholder, inputType = "text" }: {
    flow: typeof phoneFlow;
    setFlow: React.Dispatch<React.SetStateAction<typeof phoneFlow>>;
    fieldLabel: string;
    sendHandler: () => void;
    verifyHandler: () => void;
    placeholder: string;
    inputType?: string;
  }) => {
    if (flow.step === "idle") return null;

    return (
      <div className="mt-2 p-4 rounded-xl space-y-3" style={{ background: isDarkMode ? "rgba(243,5,109,0.05)" : "rgba(243,5,109,0.03)", border: "1px solid rgba(243,5,109,0.12)" }}>
        {flow.error && (
          <div className="flex items-center gap-2 text-xs" style={{ color: "#F3056D" }}>
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {flow.error}
          </div>
        )}

        {flow.step === "input" && (
          <>
            <input
              type={inputType}
              value={flow.newPhone || flow.newEmail}
              onChange={(e) => {
                const key = inputType === "tel" ? "newPhone" : "newEmail";
                setFlow((p) => ({ ...p, [key]: e.target.value, error: "" }));
              }}
              placeholder={placeholder}
              className="w-full p-3 rounded-xl text-sm outline-none transition-all duration-300"
              style={{ background: inputBg, border: inputBorder, color: textPrimary }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#F3056D"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(243,5,109,0.1)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; }}
              onKeyDown={(e) => e.key === "Enter" && sendHandler()}
            />
            <div className="flex gap-2">
              <button onClick={sendHandler} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)", boxShadow: "0 4px 12px rgba(243,5,109,0.25)" }}>
                <Send className="h-3.5 w-3.5" />
                Send Code
              </button>
              <button onClick={() => setFlow({ step: "idle", newPhone: "", newEmail: "", code: "", error: "", timer: 0 })} className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200" style={{ background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(33,65,135,0.04)", border: inputBorder, color: textSecondary }}>
                Cancel
              </button>
            </div>
          </>
        )}

        {flow.step === "sending" && (
          <div className="flex items-center justify-center gap-2 py-3">
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#F3056D" }} />
            <span className="text-xs font-medium" style={{ color: textSecondary }}>Sending verification code...</span>
          </div>
        )}

        {(flow.step === "code" || flow.step === "verifying") && (
          <>
            <div className="flex items-center gap-2 p-2.5 rounded-lg text-[11px]" style={{ background: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(33,65,135,0.02)", color: textSecondary }}>
              <Mail className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#214187" }} />
              Code sent to <span className="font-bold" style={{ color: textPrimary }}>{inputType === "tel" ? flow.newPhone : flow.newEmail}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={flow.code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, VERIFICATION_CODE_LENGTH);
                  setFlow((p) => ({ ...p, code: val, error: "" }));
                }}
                placeholder={`${VERIFICATION_CODE_LENGTH}-digit code`}
                maxLength={VERIFICATION_CODE_LENGTH}
                className="flex-1 p-3 rounded-xl text-sm text-center font-bold tracking-[0.3em] outline-none transition-all duration-300"
                style={{ background: inputBg, border: inputBorder, color: textPrimary }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#F3056D"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(243,5,109,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; }}
                onKeyDown={(e) => e.key === "Enter" && verifyHandler()}
              />
              <button onClick={verifyHandler} disabled={flow.step === "verifying" || flow.code.length !== VERIFICATION_CODE_LENGTH} className="px-5 py-3 rounded-xl text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0" style={{ background: "linear-gradient(135deg, #214187 0%, #1a3470 100%)", boxShadow: "0 4px 12px rgba(33,65,135,0.25)" }}>
                {flow.step === "verifying" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => setFlow((p) => ({ ...p, step: "input", code: "", error: "" }))} className="text-[11px] font-medium flex items-center gap-1 transition-colors duration-200" style={{ color: textMuted }} onMouseEnter={(e) => (e.currentTarget.style.color = textSecondary)} onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}>
                <ChevronRight className="h-3 w-3 rotate-180" />
                Change {fieldLabel.toLowerCase()}
              </button>
              {flow.timer > 0 ? (
                <span className="text-[11px] font-medium" style={{ color: textMuted }}>
                  Resend in <span className="font-bold" style={{ color: "#F3056D" }}>{flow.timer}s</span>
                </span>
              ) : (
                <button onClick={sendHandler} className="text-[11px] font-bold flex items-center gap-1 transition-colors duration-200" style={{ color: "#F3056D" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#ff3d8f")} onMouseLeave={(e) => (e.currentTarget.style.color = "#F3056D")}>
                  <RefreshCw className="h-3 w-3" />
                  Resend Code
                </button>
              )}
            </div>
          </>
        )}

        {flow.step === "verified" && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.15)" }}>
              <CircleCheck className="h-4 w-4" style={{ color: "#4ade80" }} />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: "#4ade80" }}>Verified!</p>
              <p className="text-[10px]" style={{ color: textSecondary }}>{inputType === "tel" ? flow.newPhone : flow.newEmail}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // =================== RENDER: Main ===================
  return (
    <div className="space-y-6 max-w-7xl mx-auto relative" ref={containerRef}>
      {/* Decorative Blobs */}
      <div className="absolute top-10 right-10 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "#F3056D" }} />
      <div className="absolute bottom-40 left-0 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "#ffd700" }} />

      {/* ==================== PROFILE HERO CARD ==================== */}
      <div className="profile-hero relative overflow-hidden rounded-3xl" style={{ background: isDarkMode ? "linear-gradient(135deg, #2d1045 0%, #1a1035 40%, #0d1a2d 100%)" : "linear-gradient(135deg, #214187 0%, #1a3470 40%, #152d5e 100%)", boxShadow: isDarkMode ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(33,65,135,0.25)" }}>
        {/* Decoratives */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 -translate-y-1/3 translate-x-1/4" style={{ background: "#F3056D" }} />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 rounded-full blur-3xl opacity-15 translate-y-1/2" style={{ background: "#ffd700" }} />
        <div className="hidden sm:block absolute top-8 right-40 w-14 h-14 rounded-2xl rotate-12 opacity-15" style={{ background: "#ffd700", border: "2px solid rgba(255,255,255,0.1)" }} />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #F3056D, #ffd700, #214187, transparent)" }} />

        <div className="relative p-6 sm:p-8 pb-8">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" style={{ color: "#ffd700" }} />
              <h1 className="text-lg font-black text-white tracking-tight">My Profile</h1>
            </div>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}>
                <Edit3 className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0" style={{ background: "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)", boxShadow: "0 4px 15px rgba(243,5,109,0.35)" }}>
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* Profile Info Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-[3px]" style={{ background: "linear-gradient(135deg, #F3056D, #ffd700, #214187)" }}>
                {isUploadingImage ? (
                  <div className="w-full h-full rounded-[21px] flex items-center justify-center" style={{ border: `4px solid ${isDarkMode ? "#1a1035" : "#214187"}`, background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(33,65,135,0.05)" }}>
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#F3056D" }} />
                  </div>
                ) : (
                  <img
                    src={
                      profileData.photoURL
                    }
                    alt="Profile"
                    className="w-full h-full rounded-[21px] object-cover"
                    style={{ border: `4px solid ${isDarkMode ? "#1a1035" : "#214187"}` }}
                  />
                )}
              </div>
              {isEditing && (
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploadingImage} className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50" style={{ background: "linear-gradient(135deg, #F3056D 0%, #ff3d8f 100%)", boxShadow: "0 4px 12px rgba(243,5,109,0.4)", border: `3px solid ${isDarkMode ? "#1a1035" : "#214187"}` }}>
                  {isUploadingImage ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : <Camera className="h-4 w-4 text-white" />}
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#4ade80", border: `3px solid ${isDarkMode ? "#1a1035" : "#214187"}` }} />
            </div>

            {/* Name & Meta */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto sm:mx-0">
                  <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} placeholder="First name" className="flex-1 text-xl sm:text-2xl font-black bg-transparent border-b-2 outline-none text-center sm:text-left" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }} onFocus={(e) => (e.currentTarget.style.borderColor = "#F3056D")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")} />
                  <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} placeholder="Last name" className="flex-1 text-xl sm:text-2xl font-black bg-transparent border-b-2 outline-none text-center sm:text-left" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }} onFocus={(e) => (e.currentTarget.style.borderColor = "#F3056D")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")} />
                </div>
              ) : (
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{displayName}</h2>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Mail className="h-3.5 w-3.5" />
                  {profileData.email || "No email"}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Phone className="h-3.5 w-3.5" />
                  {profileData.phoneNumber || "No phone"}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium capitalize" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <GraduationCap className="h-3.5 w-3.5" />
                  {profileData.role}
                </span>
                {profileData.createdAt && (
                  <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {formatDate(profileData.createdAt)}
                  </span>
                )}
              </div>
              {!isEditing && (
                <p className="text-sm mt-3 max-w-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {editForm.bio}
                </p>
              )}
            </div>

            {/* Completion Ring (desktop) */}
            <div className="hidden lg:flex flex-col items-center gap-2">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="url(#completionGrad)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(profileCompletion / 100) * 213.6} 213.6`} style={{ filter: "drop-shadow(0 0 6px rgba(243,5,109,0.4))" }} />
                  <defs>
                    <linearGradient id="completionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F3056D" />
                      <stop offset="100%" stopColor="#ffd700" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-black text-white">{profileCompletion}%</span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                Profile Complete
              </span>
            </div>
          </div>

          {/* Mobile Completion Bar */}
          <div className="lg:hidden mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                Profile Completion
              </span>
              <span className="text-xs font-black" style={{ color: "#ffd700" }}>{profileCompletion}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full relative overflow-hidden" style={{ width: `${profileCompletion}%`, background: "linear-gradient(90deg, #F3056D, #ffd700)" }}>
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", animation: "shimmer 2s infinite" }} />
              </div>
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {!profileData.phoneNumber ? "Add your phone number to reach 80%" : !editForm.school ? "Add your school name to reach 100%" : "Your profile is complete!"}
            </p>
          </div>
        </div>
      </div>

      {/* ==================== STATS ROW ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Courses", value: "05", icon: BookOpen, color: "#F3056D", bg: isDarkMode ? "rgba(243,5,109,0.1)" : "rgba(243,5,109,0.06)" },
          { label: "Badges", value: `${earnedBadges.length}`, icon: Award, color: "#ffd700", bg: isDarkMode ? "rgba(255,215,0,0.1)" : "rgba(255,215,0,0.08)" },
          { label: "Day Streak", value: "07", icon: Flame, color: "#F3056D", bg: isDarkMode ? "rgba(243,5,109,0.1)" : "rgba(243,5,109,0.06)" },
          { label: "Learning Time", value: "86h", icon: Clock, color: "#214187", bg: isDarkMode ? "rgba(33,65,135,0.15)" : "rgba(33,65,135,0.06)" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl" style={{ background: stat.bg }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <TrendingUp className="h-4 w-4" style={{ color: stat.color, opacity: 0.5 }} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black" style={{ color: textPrimary }}>{stat.value}</h3>
            <p className="text-xs font-medium mt-1" style={{ color: textSecondary }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ==================== MAIN BENTO GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- LEFT COLUMN ---------- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="section-card rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-center justify-between p-5 sm:p-6" style={{ borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(33,65,135,0.06)" }}>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" style={{ color: "#F3056D" }} />
                <h2 className="text-lg font-black" style={{ color: textPrimary }}>Personal Information</h2>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-xs font-bold transition-colors duration-200" style={{ color: "#F3056D" }}>
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
            </div>

            <div className="p-5 sm:p-6">
              {isEditing && (
                <div className="mb-5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: textMuted }}>Bio</label>
                  <textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={3} className="w-full p-3 rounded-xl text-sm outline-none resize-none transition-all duration-300" style={{ background: inputBg, border: inputBorder, color: textPrimary }} onFocus={(e) => { e.currentTarget.style.borderColor = "#F3056D"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(243,5,109,0.1)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; }} />
                  <p className="text-[9px] mt-1" style={{ color: textMuted }}>Stored locally — backend support coming soon</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {/* First Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: textMuted }}>
                    <User className="h-3 w-3" />
                    First Name
                  </label>
                  {isEditing ? (
                    <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="w-full p-3 rounded-xl text-sm outline-none transition-all duration-300" style={{ background: inputBg, border: inputBorder, color: textPrimary }} onFocus={(e) => { e.currentTarget.style.borderColor = "#F3056D"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(243,5,109,0.1)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; }} />
                  ) : (
                    <div className="p-3 rounded-xl text-sm font-medium" style={{ background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(33,65,135,0.02)", border: isDarkMode ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(33,65,135,0.04)", color: textPrimary }}>
                      {profileData.firstName || "—"}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: textMuted }}>
                    <User className="h-3 w-3" />
                    Last Name
                  </label>
                  {isEditing ? (
                    <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="w-full p-3 rounded-xl text-sm outline-none transition-all duration-300" style={{ background: inputBg, border: inputBorder, color: textPrimary }} onFocus={(e) => { e.currentTarget.style.borderColor = "#F3056D"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(243,5,109,0.1)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; }} />
                  ) : (
                    <div className="p-3 rounded-xl text-sm font-medium" style={{ background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(33,65,135,0.02)", border: isDarkMode ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(33,65,135,0.04)", color: textPrimary }}>
                      {profileData.lastName || "—"}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: textMuted }}>
                    <Mail className="h-3 w-3" />
                    Email Address
                    {emailFlow.step === "verified" && <CircleCheck className="h-3 w-3" style={{ color: "#4ade80" }} />}
                  </label>
                  {!isEditing ? (
                    <div className="p-3 rounded-xl text-sm font-medium flex items-center justify-between" style={{ background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(33,65,135,0.02)", border: isDarkMode ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(33,65,135,0.04)", color: textPrimary }}>
                      <span className="truncate">{profileData.email || "Not set"}</span>
                      <Lock className="h-3 w-3 flex-shrink-0 ml-2" style={{ color: textMuted }} />
                    </div>
                  ) : emailFlow.step === "idle" ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 rounded-xl text-sm font-medium truncate" style={{ background: inputBg, border: inputBorder, color: textSecondary }}>
                        {profileData.email || "Not set"}
                      </div>
                      <button onClick={() => setEmailFlow((p) => ({ ...p, step: "input", newEmail: "", code: "", error: "" }))} className="px-3 py-3 rounded-xl text-[10px] font-bold transition-all duration-200 flex-shrink-0" style={{ background: "rgba(243,5,109,0.1)", color: "#F3056D", border: "1px solid rgba(243,5,109,0.15)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(243,5,109,0.18)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(243,5,109,0.1)")}>
                        Change
                      </button>
                    </div>
                  ) : null}
                  <VerificationFlow flow={emailFlow} setFlow={setEmailFlow} fieldLabel="Email" sendHandler={handleSendEmailCode} verifyHandler={handleVerifyEmailCode} placeholder="Enter new email address" inputType="email" />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: textMuted }}>
                    <Phone className="h-3 w-3" />
                    Phone Number
                    {phoneFlow.step === "verified" && <CircleCheck className="h-3 w-3" style={{ color: "#4ade80" }} />}
                  </label>
                  {!isEditing ? (
                    <div className="p-3 rounded-xl text-sm font-medium flex items-center justify-between" style={{ background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(33,65,135,0.02)", border: isDarkMode ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(33,65,135,0.04)", color: textPrimary }}>
                      <span className="truncate">{profileData.phoneNumber || "Not set"}</span>
                      <Lock className="h-3 w-3 flex-shrink-0 ml-2" style={{ color: textMuted }} />
                    </div>
                  ) : phoneFlow.step === "idle" ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 rounded-xl text-sm font-medium truncate" style={{ background: inputBg, border: inputBorder, color: textSecondary }}>
                        {profileData.phoneNumber || "Not set"}
                      </div>
                      <button onClick={() => setPhoneFlow((p) => ({ ...p, step: "input", newPhone: "", code: "", error: "" }))} className="px-3 py-3 rounded-xl text-[10px] font-bold transition-all duration-200 flex-shrink-0" style={{ background: "rgba(243,5,109,0.1)", color: "#F3056D", border: "1px solid rgba(243,5,109,0.15)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(243,5,109,0.18)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(243,5,109,0.1)")}>
                        {profileData.phoneNumber ? "Change" : "Add"}
                      </button>
                    </div>
                  ) : null}
                  <VerificationFlow flow={phoneFlow} setFlow={setPhoneFlow} fieldLabel="Phone" sendHandler={handleSendPhoneCode} verifyHandler={handleVerifyPhoneCode} placeholder="Enter new phone number" inputType="tel" />
                </div>

                {/* Local-only fields below */}
                {[
                  { key: "birthday" as const, label: "Date of Birth", icon: Calendar, type: "date" },
                  { key: "grade" as const, label: "Grade / Class", icon: GraduationCap, type: "text" },
                  { key: "school" as const, label: "School Name", icon: GraduationCap, type: "text" },
                  { key: "location" as const, label: "Location", icon: MapPin, type: "text" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: textMuted }}>
                      <field.icon className="h-3 w-3" />
                      {field.label}
                    </label>
                    {isEditing ? (
                      <>
                        <input type={field.type} value={editForm[field.key]} onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })} className="w-full p-3 rounded-xl text-sm outline-none transition-all duration-300" style={{ background: inputBg, border: inputBorder, color: textPrimary }} onFocus={(e) => { e.currentTarget.style.borderColor = "#F3056D"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(243,5,109,0.1)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; }} />
                        <p className="text-[9px] mt-1" style={{ color: textMuted }}>Local only</p>
                      </>
                    ) : (
                      <div className="p-3 rounded-xl text-sm font-medium" style={{ background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(33,65,135,0.02)", border: isDarkMode ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(33,65,135,0.04)", color: textPrimary }}>
                        {field.key === "birthday" ? formatDate(editForm[field.key]) : editForm[field.key] || "—"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Progress */}
          <div className="section-card rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-center justify-between p-5 sm:p-6" style={{ borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(33,65,135,0.06)" }}>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" style={{ color: "#214187" }} />
                <h2 className="text-lg font-black" style={{ color: textPrimary }}>Subject Skills</h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: isDarkMode ? "rgba(33,65,135,0.12)" : "rgba(33,65,135,0.06)", color: "#214187" }}>
                Based on quiz scores
              </span>
            </div>
            <div className="p-5 sm:p-6 space-y-5">
              {SKILL_DATA.map((skill) => (
                <div key={skill.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: textPrimary }}>{skill.label}</span>
                    <span className="text-xs font-black" style={{ color: skill.color }}>{skill.level}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(33,65,135,0.08)" }}>
                    <div className="skill-bar-fill h-full rounded-full relative overflow-hidden" style={{ width: `${skill.level}%`, background: `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)` }}>
                      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", animation: "shimmer 2.5s infinite" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="section-card rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-center justify-between p-5 sm:p-6" style={{ borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(33,65,135,0.06)" }}>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: "#ffd700" }} />
                <h2 className="text-lg font-black" style={{ color: textPrimary }}>Recent Activity</h2>
              </div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: isDarkMode ? "rgba(255,215,0,0.1)" : "rgba(255,215,0,0.08)", color: "#ffd700" }}>
                Last 7 days
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(33,65,135,0.04)" }}>
              {RECENT_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 sm:p-5 transition-all duration-200 cursor-default" onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(33,65,135,0.02)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                  <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: `${item.color}15` }}>
                    <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold" style={{ color: textPrimary }}>{item.action}</p>
                    <p className="text-[11px] mt-0.5 truncate" style={{ color: textSecondary }}>{item.detail}</p>
                  </div>
                  <span className="text-[10px] font-medium flex-shrink-0" style={{ color: textMuted }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- RIGHT COLUMN ---------- */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="section-card rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(33,65,135,0.06)" }}>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" style={{ color: "#ffd700" }} />
                <h3 className="font-black text-sm" style={{ color: textPrimary }}>Badges</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: isDarkMode ? "rgba(255,215,0,0.1)" : "rgba(255,215,0,0.08)", color: "#ffd700" }}>
                {earnedBadges.length}/{PROFILE_BADGES.length}
              </span>
            </div>

            {/* Badge Tabs */}
            <div className="flex gap-1 p-3" style={{ borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(33,65,135,0.04)" }}>
              {(["earned", "locked"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveBadgeTab(tab)} className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 capitalize" style={{ background: activeBadgeTab === tab ? (tab === "earned" ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.05)") : "transparent", color: activeBadgeTab === tab ? (tab === "earned" ? "#ffd700" : textSecondary) : textMuted, border: activeBadgeTab === tab ? (tab === "earned" ? "1px solid rgba(255,215,0,0.2)" : "1px solid rgba(255,255,255,0.08)") : "1px solid transparent" }}>
                  {tab === "earned" ? `Earned (${earnedBadges.length})` : `Locked (${lockedBadges.length})`}
                </button>
              ))}
            </div>

            <div className="p-3 grid grid-cols-2 gap-2.5">
              {displayBadges.map((badge) => (
                <div key={badge.id} className="relative p-3 rounded-xl text-center transition-all duration-300 cursor-default group" style={{ background: badge.isUnlocked ? (isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(33,65,135,0.02)") : (isDarkMode ? "rgba(255,255,255,0.01)" : "rgba(33,65,135,0.01)"), border: badge.isUnlocked ? `1px solid ${badge.color}20` : (isDarkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(33,65,135,0.03)"), opacity: badge.isUnlocked ? 1 : 0.45 }} onMouseEnter={(e) => { if (badge.isUnlocked) { e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(33,65,135,0.04)"; e.currentTarget.style.transform = "translateY(-2px)"; } }} onMouseLeave={(e) => { e.currentTarget.style.background = badge.isUnlocked ? (isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(33,65,135,0.02)") : (isDarkMode ? "rgba(255,255,255,0.01)" : "rgba(33,65,135,0.01)"); e.currentTarget.style.transform = "translateY(0)"; }}>
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10" style={{ background: isDarkMode ? "#2d1045" : "#214187", color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                    {badge.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `5px solid ${isDarkMode ? "#2d1045" : "#214187"}` }} />
                  </div>

                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: badge.isUnlocked ? `${badge.color}18` : (isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(33,65,135,0.03)") }}>
                    {badge.isUnlocked ? <badge.icon className="h-5 w-5" style={{ color: badge.color }} /> : <Lock className="h-4 w-4" style={{ color: textMuted }} />}
                  </div>
                  <p className="text-[10px] font-bold leading-tight" style={{ color: badge.isUnlocked ? textPrimary : textMuted }}>
                    {badge.title}
                  </p>
                  {badge.isUnlocked && badge.earnedAt && (
                    <p className="text-[8px] mt-0.5" style={{ color: textMuted }}>{formatDate(badge.earnedAt)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* This Week Card */}
          <div className="section-card rounded-2xl overflow-hidden" style={{ background: isDarkMode ? "linear-gradient(180deg, rgba(26,16,53,0.8) 0%, rgba(13,26,45,0.8) 100%)" : "linear-gradient(180deg, #214187 0%, #1a3470 100%)", border: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "none", boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 8px 30px rgba(33,65,135,0.25)" }}>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4" style={{ color: "#ffd700" }} />
                <h3 className="font-black text-sm text-white">This Week</h3>
              </div>
              <Crown className="h-4 w-4" style={{ color: "#ffd700" }} />
            </div>
            <div className="px-4 pb-4 space-y-3">
              {[
                { label: "Lessons Completed", value: "12", total: "15", color: "#F3056D" },
                { label: "Quizzes Taken", value: "4", total: "5", color: "#ffd700" },
                { label: "Study Hours", value: "6.5", total: "8", color: "#4ade80" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                    <span className="text-[11px] font-black text-white">
                      {item.value}
                      <span className="font-medium ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>/ {item.total}</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(parseFloat(item.value) / parseFloat(item.total)) * 100}%`, background: item.color }} />
                  </div>
                </div>
              ))}
              <div className="mt-3 p-3 rounded-xl flex items-center gap-2.5" style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.15)" }}>
                <Sparkles className="h-4 w-4 flex-shrink-0" style={{ color: "#ffd700" }} />
                <p className="text-[10px] font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Complete 3 more lessons to unlock the <span className="font-bold" style={{ color: "#ffd700" }}>Code Ninja</span> badge!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="section-card rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder, boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(33,65,135,0.06)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-center gap-2 p-5" style={{ borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(33,65,135,0.06)" }}>
              <Shield className="h-4 w-4" style={{ color: "#214187" }} />
              <h3 className="font-black text-sm" style={{ color: textPrimary }}>Quick Settings</h3>
            </div>
            <div className="p-3">
              {[
                { icon: Bell, label: "Notification Preferences", color: "#F3056D" },
                { icon: Palette, label: "Theme & Appearance", color: "#ffd700" },
                { icon: Lock, label: "Change Password", color: "#214187" },
                { icon: Globe, label: "Language & Region", color: "#F3056D" },
                { icon: Shield, label: "Privacy & Security", color: "#214187" },
              ].map((item) => (
                <button key={item.label} className="w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-all duration-200" style={{ color: textSecondary }} onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(33,65,135,0.03)"; e.currentTarget.style.color = textPrimary; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = textSecondary; }}>
                  <div className="p-2 rounded-lg" style={{ background: `${item.color}12` }}>
                    <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <span className="flex-1 text-left text-xs font-semibold">{item.label}</span>
                  <ChevronRight className="h-4 w-4" style={{ color: textMuted }} />
                </button>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="section-card rounded-2xl p-5" style={{ background: isDarkMode ? "rgba(243,5,109,0.05)" : "rgba(243,5,109,0.03)", border: isDarkMode ? "1px solid rgba(243,5,109,0.1)" : "1px solid rgba(243,5,109,0.08)" }}>
            <h3 className="font-black text-sm mb-1" style={{ color: "#F3056D" }}>Danger Zone</h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: textSecondary }}>
              These actions are irreversible. Please proceed with caution.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300" style={{ color: "#F3056D", background: isDarkMode ? "rgba(243,5,109,0.08)" : "rgba(243,5,109,0.04)", border: "1px solid rgba(243,5,109,0.15)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(243,5,109,0.15)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = isDarkMode ? "rgba(243,5,109,0.08)" : "rgba(243,5,109,0.04)"; }}>
                <Lock className="h-3.5 w-3.5" />
                Deactivate
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300" style={{ color: "#fff", background: "rgba(239,68,68,0.8)", border: "1px solid rgba(239,68,68,0.3)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,1)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.8)"; }}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== TOAST ==================== */}
      {toast.show && (
        <div id="profile-toast" className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl pointer-events-none" style={{ background: isDarkMode ? "#1a1035" : "#fff", border: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(33,65,135,0.08)", boxShadow: isDarkMode ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(33,65,135,0.15)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: toast.type === "success" ? "linear-gradient(135deg, #4ade80, #22c55e)" : "linear-gradient(135deg, #F3056D, #ff3d8f)", boxShadow: toast.type === "success" ? "0 4px 12px rgba(34,197,94,0.3)" : "0 4px 12px rgba(243,5,109,0.3)" }}>
            {toast.type === "success" ? <CircleCheck className="h-4 w-4 text-white" /> : <AlertCircle className="h-4 w-4 text-white" />}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: textPrimary }}>{toast.type === "success" ? "Success!" : "Error"}</p>
            <p className="text-[11px]" style={{ color: textSecondary }}>{toast.message}</p>
          </div>
        </div>
      )}

      {/* CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}