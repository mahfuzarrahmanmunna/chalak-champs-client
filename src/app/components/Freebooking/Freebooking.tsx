"use client";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { Phone, User, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { createBooking, verifyOtp } from "@/app/services/freeBookingService";
import { useBooking } from "@/app/providers/BookingProvider";

interface Country {
  name: string;
  flag: string;
  code: string;
  cca2: string;
}

const STATIC_COUNTRIES: Country[] = [
  { name: "Bangladesh", flag: "https://flagcdn.com/bd.svg", code: "+880", cca2: "BD" },
  { name: "United States", flag: "https://flagcdn.com/us.svg", code: "+1", cca2: "US" },
  { name: "United Kingdom", flag: "https://flagcdn.com/gb.svg", code: "+44", cca2: "GB" },
  { name: "Canada", flag: "https://flagcdn.com/ca.svg", code: "+1", cca2: "CA" },
  { name: "Australia", flag: "https://flagcdn.com/au.svg", code: "+61", cca2: "AU" },
  { name: "India", flag: "https://flagcdn.com/in.svg", code: "+91", cca2: "IN" },
  { name: "Pakistan", flag: "https://flagcdn.com/pk.svg", code: "+92", cca2: "PK" },
  { name: "Saudi Arabia", flag: "https://flagcdn.com/sa.svg", code: "+966", cca2: "SA" },
  { name: "United Arab Emirates", flag: "https://flagcdn.com/ae.svg", code: "+971", cca2: "AE" },
  { name: "Malaysia", flag: "https://flagcdn.com/my.svg", code: "+60", cca2: "MY" },
  { name: "Singapore", flag: "https://flagcdn.com/sg.svg", code: "+65", cca2: "SG" },
  { name: "Germany", flag: "https://flagcdn.com/de.svg", code: "+49", cca2: "DE" },
  { name: "France", flag: "https://flagcdn.com/fr.svg", code: "+33", cca2: "FR" },
  { name: "Italy", flag: "https://flagcdn.com/it.svg", code: "+39", cca2: "IT" },
  { name: "Spain", flag: "https://flagcdn.com/es.svg", code: "+34", cca2: "ES" },
  { name: "Japan", flag: "https://flagcdn.com/jp.svg", code: "+81", cca2: "JP" },
  { name: "China", flag: "https://flagcdn.com/cn.svg", code: "+86", cca2: "CN" },
  { name: "South Korea", flag: "https://flagcdn.com/kr.svg", code: "+82", cca2: "KR" },
  { name: "Nepal", flag: "https://flagcdn.com/np.svg", code: "+977", cca2: "NP" },
  { name: "Sri Lanka", flag: "https://flagcdn.com/lk.svg", code: "+94", cca2: "LK" },
  { name: "Oman", flag: "https://flagcdn.com/om.svg", code: "+968", cca2: "OM" },
  { name: "Qatar", flag: "https://flagcdn.com/qa.svg", code: "+974", cca2: "QA" },
  { name: "Kuwait", flag: "https://flagcdn.com/kw.svg", code: "+965", cca2: "KW" },
  { name: "Bahrain", flag: "https://flagcdn.com/bh.svg", code: "+973", cca2: "BH" },
  { name: "Turkey", flag: "https://flagcdn.com/tr.svg", code: "+90", cca2: "TR" },
  { name: "Iran", flag: "https://flagcdn.com/ir.svg", code: "+98", cca2: "IR" },
  { name: "Thailand", flag: "https://flagcdn.com/th.svg", code: "+66", cca2: "TH" },
  { name: "Indonesia", flag: "https://flagcdn.com/id.svg", code: "+62", cca2: "ID" },
  { name: "Vietnam", flag: "https://flagcdn.com/vn.svg", code: "+84", cca2: "VN" },
  { name: "Philippines", flag: "https://flagcdn.com/ph.svg", code: "+63", cca2: "PH" },
  { name: "Russia", flag: "https://flagcdn.com/ru.svg", code: "+7", cca2: "RU" },
  { name: "Brazil", flag: "https://flagcdn.com/br.svg", code: "+55", cca2: "BR" },
  { name: "South Africa", flag: "https://flagcdn.com/za.svg", code: "+27", cca2: "ZA" },
  { name: "Nigeria", flag: "https://flagcdn.com/ng.svg", code: "+234", cca2: "NG" },
  { name: "Egypt", flag: "https://flagcdn.com/eg.svg", code: "+20", cca2: "EG" },
  { name: "Mexico", flag: "https://flagcdn.com/mx.svg", code: "+52", cca2: "MX" },
  { name: "Sweden", flag: "https://flagcdn.com/se.svg", code: "+46", cca2: "SE" },
  { name: "Norway", flag: "https://flagcdn.com/no.svg", code: "+47", cca2: "NO" },
  { name: "Denmark", flag: "https://flagcdn.com/dk.svg", code: "+45", cca2: "DK" },
  { name: "Netherlands", flag: "https://flagcdn.com/nl.svg", code: "+31", cca2: "NL" },
  { name: "Belgium", flag: "https://flagcdn.com/be.svg", code: "+32", cca2: "BE" },
  { name: "Switzerland", flag: "https://flagcdn.com/ch.svg", code: "+41", cca2: "CH" },
  { name: "Ireland", flag: "https://flagcdn.com/ie.svg", code: "+353", cca2: "IE" },
  { name: "New Zealand", flag: "https://flagcdn.com/nz.svg", code: "+64", cca2: "NZ" },
  { name: "Greece", flag: "https://flagcdn.com/gr.svg", code: "+30", cca2: "GR" },
  { name: "Portugal", flag: "https://flagcdn.com/pt.svg", code: "+351", cca2: "PT" },
  { name: "Poland", flag: "https://flagcdn.com/pl.svg", code: "+48", cca2: "PL" },
  { name: "Ukraine", flag: "https://flagcdn.com/ua.svg", code: "+380", cca2: "UA" },
  { name: "Argentina", flag: "https://flagcdn.com/ar.svg", code: "+54", cca2: "AR" },
  { name: "Israel", flag: "https://flagcdn.com/il.svg", code: "+972", cca2: "IL" },
];

/* ============================================================
   HELPER FUNCTIONS — SHA-256 hashing + phone/name normalization
   Never send plain-text PII to dataLayer. Only hashes.
   ============================================================ */

async function sha256Hex(input: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhone(rawPhone: string, countryCode: string): string {
  let p = (rawPhone || "").replace(/[\s\-()]/g, "");
  const cc = (countryCode || "").replace("+", "");
  if (p.startsWith("+")) {
    p = p.slice(1);
  } else if (p.startsWith("00")) {
    p = p.slice(2);
  } else if (p.startsWith("0")) {
    p = cc + p.slice(1);
  } else if (!p.startsWith(cc)) {
    p = cc + p;
  }
  return p.toLowerCase();
}

function normalizeName(rawName: string): string {
  return (rawName || "").toLowerCase().trim();
}

/* ============================================================
   COMPONENT
   ============================================================ */

const Freebooking: React.FC = () => {
  const { isOpen, closeBooking, toast } = useBooking();
  const { colors } = useTheme();

  const phoneNumber = "01740176774";
  const message = encodeURIComponent(
    "Hello, I have a question about your service.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  // --- Form State ---
  const [formData, setFormData] = useState({
    studentName: "",
    guardianName: "",
    phone: "",
    studentClass: "",
    course: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Country State ---
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- OTP / Step State ---
  const [formStep, setFormStep] = useState<"form" | "otp" | "success">("form");
  const [otpValue, setOtpValue] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);

  /* --- Initialize dataLayer + Countries on Mount --- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
    }

    const sortedCountries = [...STATIC_COUNTRIES].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    setCountries(sortedCountries);

    const bd = sortedCountries.find((c: Country) => c.cca2 === "BD");
    setSelectedCountry(bd || sortedCountries[0]);
  }, []);

  /* --- Auto-close success card after 5 seconds --- */
  useEffect(() => {
    if (formStep === "success") {
      const timer = setTimeout(() => handleClose(), 5000);
      return () => clearTimeout(timer);
    }
  }, [formStep]);

  /* --- Input Change --- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* --- Validation --- */
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== "",
  );

  /* --- Close & Reset Everything --- */
  const handleClose = () => {
    closeBooking();
    setIsDropdownOpen(false);
    setFormStep("form");
    setOtpValue("");
    setOtpError("");
    setBookingData(null);
    setFormData({
      studentName: "",
      guardianName: "",
      phone: "",
      studentClass: "",
      course: "",
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  /* ============================================================
     STEP 1: Form Submit → calls createBooking → sends OTP
     NO dataLayer push happens here. Only transitions to OTP step.
     ============================================================ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && selectedCountry) {
      setIsSubmitting(true);

      const fullPhone = `${selectedCountry.code} ${formData.phone}`;
      const payload = {
        ...formData,
        countryCode: selectedCountry.code,
        fullPhone: fullPhone,
      };

      try {
        const response = await createBooking(payload);

        if (response.success) {
          // Store everything we need for the dataLayer push later
          setBookingData({
            ...formData,
            country: selectedCountry,
            newCustomer:
              response.newCustomer ??
              response.new_customer ??
              response.isNewCustomer ??
              true,
          });
          // Transition to OTP step — NO dataLayer push here
          setFormStep("otp");
        } else {
          toast(response.message || "Submission failed", "error");
        }
      } catch (error: any) {
        console.error("Submission Error:", error);
        toast("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  /* ============================================================
     STEP 2: OTP Verification
     User enters 4-digit code → verifyOtp() → on success, transition
     to success card and fire the ONE allowed generate_lead event.
     ============================================================ */
  const handleVerifyOtp = async () => {
    if (otpValue.length !== 4) {
      setOtpError("4-digit কোড টাইপ করুন");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const response = await verifyOtp({
        phone: formData.phone,
        countryCode: selectedCountry?.code || "+880",
        otp: otpValue,
      });

      if (response.success) {
        // Show success card FIRST, then fire the event
        setFormStep("success");
        // Update new_customer if backend provided it in verify response
        if (
          response.newCustomer !== undefined ||
          response.new_customer !== undefined
        ) {
          setBookingData((prev: any) => ({
            ...prev,
            newCustomer:
              response.newCustomer ?? response.new_customer ?? prev.newCustomer,
          }));
        }
        // Fire the single generate_lead event
        await pushGenerateLead(bookingData);
      } else {
        setOtpError(response.message || "ভুল OTP কোড। আবার চেষ্টা করুন।");
      }
    } catch (error: any) {
      console.error("OTP Verify Error:", error);
      setOtpError("ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /* ============================================================
     STEP 3: Push generate_lead — fires ONLY after OTP success
     Uses sessionStorage guard to prevent duplicate fires.
     Never sends plain-text PII. Only SHA-256 hashes.
     ============================================================ */
  const pushGenerateLead = async (data: any) => {
    if (typeof window === "undefined") return;

    // Guard: fire only once per session
    if (sessionStorage.getItem("kids_eng_lead_fired") === "1") return;

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Normalize + hash PII (never send plain-text)
    const phoneHash = await sha256Hex(
      normalizePhone(data.phone, data.country.code),
    );
    const childNameHash = await sha256Hex(normalizeName(data.studentName));

    // Push single event — exact field names per spec
    window.dataLayer.push({
      event: "generate_lead",
      new_customer: !!data.newCustomer,
      form_name: "Kids English Lead Form",
      course_id: "KIDS-ENG",
      course_name: "Kids English Course",
      class_level: data.studentClass,
      customer: {
        phone_hash: phoneHash,
        child_name_hash: childNameHash,
        country: data.country.cca2,
      },
    });

    // Lock against re-fire on refresh / duplicate callback
    sessionStorage.setItem("kids_eng_lead_fired", "1");
  };

  /* --- OTP Input Handler (numeric only, max 4) --- */
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setOtpValue(value);
    if (otpError) setOtpError("");
  };

  /* --- Resend OTP --- */
  const handleResendOtp = async () => {
    if (!selectedCountry) return;
    setOtpError("");
    setOtpValue("");
    try {
      const fullPhone = `${selectedCountry.code} ${formData.phone}`;
      const response = await createBooking({
        ...formData,
        countryCode: selectedCountry.code,
        fullPhone,
      });
      if (response.success) {
        toast("OTP পুনরায় পাঠানো হয়েছে", "success");
      } else {
        setOtpError(response.message || "OTP পাঠাতে সমস্যা হয়েছে");
      }
    } catch {
      setOtpError("OTP পাঠাতে সমস্যা হয়েছে");
    }
  };

  // Filter countries
  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.includes(searchTerm),
  );

  if (!isOpen) return null;

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div
      className="fixed overflow-auto opacity-100 inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop Blur */}
      <div className="absolute inset-0 bg-[#490023]/15 backdrop-blur-sm transition-opacity" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-md rounded-2xl border-2 border-primary shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200"
        style={{
          backgroundColor: "var(--color-card)",
          border: `1px solid var(--color-border)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute bottom-0 -right-14">
          <Image
            src={"/liveicon.webp"}
            width={120}
            height={120}
            alt="live Icon"
          />
        </div>
        <div className="absolute w-20 top-12 -left-9">
          <Image
            src={"/bellicon.webp"}
            width={40}
            height={60}
            alt="live Icon"
            className="w-auto h-auto"
          />
        </div>

        {/* Close Button — visible on all steps */}
        <div className=" bg-radial from-[#FF8FCA] to-[#D9D9D9] p-px">
          <button
            onClick={handleClose}
            className="p-1 absolute -top-4 -right-4 bg-[#FF8FCA]/70 rounded-full dark:hover:bg-white/10 transition-colors"
            style={{ color: "var(--color-foreground)" }}
          >
            <svg
              width="28"
              height="29"
              viewBox="0 0 28 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_462_31722)">
                <path
                  d="M20.0918 7.51514L7.48448 20.5151"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M7.87695 7.51514L20.4843 20.5151"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_462_31722"
                  x="0"
                  y="0"
                  width="27.9688"
                  height="28.0303"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="3.25" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.129412 0 0 0 0 0.254902 0 0 0 0 0.529412 0 0 0 0.4 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropshadow_462_31722"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropshadow_462_31722"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </button>
        </div>

        {/* ============================================== */}
        {/* STEP 1: FORM                                   */}
        {/* ============================================== */}
        {formStep === "form" && (
          <>
            {/* Header */}
            <div className="flex text-primary justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1 text-primary">
                  ফ্রি ডেমো ক্লাস বুক করতে রেজিস্ট্রেশন করো
                </h2>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                {/* Student Name */}
                <div className="space-y-1">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider opacity-70"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    শিক্ষার্থীর নাম <span className="text-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span
                      className="absolute left-3 opacity-50"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-foreground)",
                      }}
                    />
                  </div>
                </div>

                {/* Guardian Name */}
                <div className="space-y-1">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider opacity-70"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    শিক্ষার্থীর অভিভাবকের নাম{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-foreground)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold uppercase tracking-wider opacity-70"
                  style={{ color: "var(--color-foreground)" }}
                >
                  ফোন নাম্বার <span className="text-primary">*</span>
                </label>
                <div
                  className="flex rounded-lg border focus-within:ring-2 focus-within:ring-[var(--color-primary)] transition-all"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {/* Country Selector */}
                  <div className="relative w-32 md:w-40 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        !isSubmitting && setIsDropdownOpen(!isDropdownOpen)
                      }
                      disabled={isSubmitting}
                      className="w-full h-full flex items-center justify-between px-2 border-r transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-background)",
                        borderTopLeftRadius: "0.5rem",
                        borderBottomLeftRadius: "0.5rem",
                      }}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {selectedCountry && (
                          <img
                            src={selectedCountry.flag}
                            alt="flag"
                            className="w-5 h-4 object-cover rounded-sm"
                          />
                        )}
                        <span
                          className="text-sm font-medium whitespace-nowrap"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          {selectedCountry?.code}
                        </span>
                      </div>
                      <ChevronDown size={14} className="text-gray-500 ml-1" />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto z-50">
                        <div className="sticky top-0 bg-white dark:bg-gray-900 p-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <Search size={12} className="text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search..."
                              className="bg-transparent border-none outline-none text-xs w-full text-gray-800 dark:text-gray-200"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                        {filteredCountries.map((country) => (
                          <button
                            type="button"
                            key={country.cca2}
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsDropdownOpen(false);
                              setSearchTerm("");
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
                          >
                            <img
                              src={country.flag}
                              alt="flag"
                              className="w-5 h-4 object-cover rounded-sm"
                            />
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                {country.name}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {country.code}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Phone Number Input */}
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 outline-none bg-transparent rounded-r-lg disabled:opacity-50"
                    style={{ color: "var(--color-foreground)" }}
                  />
                </div>
              </div>

              {/* Class Select */}
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold uppercase tracking-wider opacity-70"
                  style={{ color: "var(--color-foreground)" }}
                >
                  শিক্ষার্থীর ক্লাস
                </label>
                <select
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                >
                  <option value="">ক্লাস সিলেক্ট করুন</option>
                  <option value="KG-1">KG-1</option>
                  <option value="2-3">2-3</option>
                  <option value="4-5">4-5</option>
                </select>
              </div>

              {/* Course Select */}
              {/* <div className="space-y-1">
                <label
                  className="text-xs font-semibold uppercase tracking-wider opacity-70"
                  style={{ color: "var(--color-foreground)" }}
                >
                  শিক্ষার্থী কোন কোর্সটি করতে আগ্রহী
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                >
                  <option className="text-gray-500" value="">
                    পছন্দের কোর্স সিলেক্ট করো
                  </option>
                  <option value="playgroup">Playgroup</option>
                  <option value="nursery">Nursery</option>
                  <option value="kg">KG</option>
                  <option value="class1">Class 1</option>
                  <option value="class2">Class 2</option>
                  <option value="class3">Class 3</option>
                  <option value="class4">Class 4</option>
                  <option value="class5">Class 5</option>
                  <option value="class6">Class 6</option>
                  <option value="class7">Class 7</option>
                  <option value="class8">Class 8</option>
                  <option value="class9">Class 9</option>
                  <option value="class10">Class 10</option>
                </select>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-lg shadow-lg transform active:scale-[0.98] transition-all ${
                  isFormValid
                    ? "hover:shadow-xl bg-[var(--color-primary)] cursor-pointer"
                    : "bg-gray-400 opacity-50 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <span>প্রসেসিং...</span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    সাবমিট করো
                  </>
                )}
              </button>
            </form>

            {/* WhatsApp Contact */}
            <div className="flex flex-col items-center mt-6">
              <p className="text-sm md:text-base text-gray-600 text-center">
                আমাদের কল করে ডেমো ক্লাস বুক করুন এখনই (24/7)
              </p>
              <button
                onClick={() => window.open(whatsappUrl, "_blank")}
                className="mt-2 bg-gray-500 text-white py-2 px-6 rounded-lg transition-colors hover:bg-gray-600 cursor-pointer flex items-center gap-2 font-medium"
              >
                <Phone size={18} />
                +88 01740176774
              </button>
            </div>
          </>
        )}

        {/* ============================================== */}
        {/* STEP 2: OTP VERIFICATION                       */}
        {/* ============================================== */}
        {formStep === "otp" && (
          <div className="text-center py-4">
            <h2 className="text-lg font-semibold mb-2 text-primary">
              OTP ভেরিফিকেশন
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-foreground)" }}
            >
              আপনার ফোন নাম্বারে পাঠানো ৪-ডিজিট কোড টাইপ করুন
            </p>

            {/* OTP Input */}
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otpValue}
              onChange={handleOtpChange}
              disabled={isVerifyingOtp}
              placeholder="----"
              className="w-full text-center text-3xl font-bold tracking-[1rem] py-4 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            />

            {/* Error Message */}
            {otpError && (
              <p className="text-red-500 text-sm mt-3">{otpError}</p>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={otpValue.length !== 4 || isVerifyingOtp}
              className={`w-full mt-6 py-3 rounded-xl text-white font-bold text-lg shadow-lg transform active:scale-[0.98] transition-all ${
                otpValue.length === 4 && !isVerifyingOtp
                  ? "hover:shadow-xl bg-[var(--color-primary)] cursor-pointer"
                  : "bg-gray-400 opacity-50 cursor-not-allowed"
              }`}
            >
              {isVerifyingOtp ? "ভেরিফাই হচ্ছে..." : "ভেরিফাই করুন"}
            </button>

            {/* Resend + Back */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setFormStep("form")}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← পেছনে যান
              </button>
              <button
                onClick={handleResendOtp}
                className="text-sm text-primary hover:underline transition-colors"
              >
                OTP পুনরায় পাঠান
              </button>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* STEP 3: SUCCESS CARD                           */}
        {/* generate_lead fires HERE, right after this     */}
        {/* card is displayed and OTP was verified.        */}
        {/* ============================================== */}
        {formStep === "success" && (
          <div className="text-center py-8">
            {/* Checkmark Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold mb-3 text-primary">
              ধন্যবাদ!
            </h2>
            <p
              className="text-sm mb-2"
              style={{ color: "var(--color-foreground)" }}
            >
              আপনার ফ্রি ডেমো ক্লাস সফলভাবে বুক করা হয়েছে।
            </p>
            <p className="text-sm text-gray-500 mb-8">
              আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
            </p>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg bg-[var(--color-primary)] hover:shadow-xl cursor-pointer transition-all"
            >
              বন্ধ করুন
            </button>

            {/* Auto-close hint */}
            <p className="text-xs text-gray-400 mt-4">
              এই উইন্ডোটি স্বয়ংক্রিয়ভাবে ৫ সেকেন্ডে বন্ধ হবে
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Freebooking;
