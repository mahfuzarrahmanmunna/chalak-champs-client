"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  MapPin,
  Briefcase,
  Clock,
  ArrowLeft,
  CheckCircle,
  Upload,
  ChevronDown,
  Search,
  Send,
} from "lucide-react";
import Link from "next/link";

// Country Interface
interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

// 1. Define the Schema First
const applicationSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .min(8, "Phone number is too short"),
  // Not required(), so they are optional
  linkedIn: yup.string().url("Must be a valid URL"),
  portfolio: yup.string().url("Must be a valid URL"),
  coverLetter: yup
    .string()
    .required("Cover letter is required")
    .min(50, "Please write at least 50 characters"),
});

// 2. Infer the Type from the Schema (The Fix)
// This ensures TypeScript and Yup are always in sync.
type ApplicationFormInputs = yup.InferType<typeof applicationSchema>;

interface JobDetails {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

interface CareerDetailClientProps {
  job: JobDetails;
}

export default function CareerDetailClient({ job }: CareerDetailClientProps) {
  const { colors } = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // File State
  const [fileName, setFileName] = useState("");

  // Country Dropdown State
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1?fields=name,flags,idd,cca2",
        );
        const data = await response.json();

        const formatted: Country[] = data
          .map((c: any) => {
            let dial = c.idd?.root || "";
            if (c.idd?.suffixes) dial += c.idd.suffixes[0];
            return {
              name: c.name.common,
              code: c.cca2,
              dial_code: dial,
              flag: c.flags.svg,
            };
          })
          .filter((c: Country) => c.dial_code)
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formatted);
        const bd = formatted.find((c) => c.code === "BD");
        if (bd) setSelectedCountry(bd);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCountries();
  }, []);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplicationFormInputs>({
    // Cast resolver to align with react-hook-form's Resolver type for this schema
    resolver: yupResolver(applicationSchema) as any,
  });

  const onSubmit: SubmitHandler<ApplicationFormInputs> = async (data) => {
    const fullData = {
      ...data,
      phone: `${selectedCountry?.dial_code} ${data.phone}`,
      resume: fileName,
      jobId: job.id,
    };

    // Simulate API
    await new Promise((res) => setTimeout(res, 1500));
    console.log(fullData);
    setIsSubmitted(true);
    reset();
    setFileName("");
  };

  // Filter Countries
  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dial_code.includes(searchQuery),
  );

  // Helper for input style
  const inputStyle = (hasError: boolean) => ({
    backgroundColor: colors.background,
    borderColor: hasError ? colors.destructive : colors.border,
    color: colors.foreground,
  });

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/career"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium hover:underline"
          style={{ color: colors.primary }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Careers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div
              className="p-8 rounded-2xl border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <h1
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.foreground }}
              >
                {job.title}
              </h1>
              <p
                className="mb-6"
                style={{ color: colors.foreground, opacity: 0.8 }}
              >
                {job.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <span
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  style={{
                    backgroundColor: colors.primary + "15",
                    color: colors.primary,
                  }}
                >
                  <Briefcase className="h-4 w-4" /> {job.department}
                </span>
                <span
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border"
                  style={{
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                >
                  <MapPin className="h-4 w-4" /> {job.location}
                </span>
                <span
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border"
                  style={{
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                >
                  <Clock className="h-4 w-4" /> {job.type}
                </span>
              </div>
            </div>

            {/* Details Sections */}
            <div
              className="p-8 rounded-2xl border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.foreground }}
              >
                Requirements
              </h2>
              <ul
                className="list-disc list-inside space-y-2 mb-6"
                style={{ color: colors.foreground, opacity: 0.8 }}
              >
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>

              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.foreground }}
              >
                Key Responsibilities
              </h2>
              <ul
                className="list-disc list-inside space-y-2"
                style={{ color: colors.foreground, opacity: 0.8 }}
              >
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-1">
            <div
              className="p-6 rounded-2xl border sticky top-8"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <h2
                className="text-xl font-semibold mb-6"
                style={{ color: colors.foreground }}
              >
                Apply for this role
              </h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle
                    className="h-12 w-12 mx-auto mb-3"
                    style={{ color: colors.success || "#10b981" }}
                  />
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: colors.foreground }}
                  >
                    Application Submitted!
                  </h3>
                  <p className="text-sm" style={{ color: colors.muted }}>
                    We will review your application and get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: colors.foreground }}
                    >
                      Full Name <span style={{ color: colors.primary }}>*</span>
                    </label>
                    <input
                      {...register("fullName")}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                      style={inputStyle(!!errors.fullName)}
                    />
                    {errors.fullName && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: colors.destructive }}
                      >
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: colors.foreground }}
                    >
                      Email <span style={{ color: colors.primary }}>*</span>
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                      style={inputStyle(!!errors.email)}
                    />
                    {errors.email && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: colors.destructive }}
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone with Dropdown */}
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: colors.foreground }}
                    >
                      Phone <span style={{ color: colors.primary }}>*</span>
                    </label>
                    <div className="flex">
                      {/* Dropdown Button */}
                      <div ref={dropdownRef} className="relative w-24">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="flex items-center justify-between w-full h-full px-2 py-2 rounded-l-lg border-r-0 border focus:outline-none"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.foreground,
                          }}
                        >
                          {selectedCountry ? (
                            <div className="flex items-center gap-1">
                              <img
                                src={selectedCountry.flag}
                                className="w-4 h-3 object-cover rounded-sm"
                                alt="flag"
                              />
                              <span className="text-xs">
                                +{selectedCountry.dial_code}
                              </span>
                            </div>
                          ) : (
                            "Code"
                          )}
                          <ChevronDown className="h-3 w-3" />
                        </button>

                        {isDropdownOpen && (
                          <div
                            className="absolute z-20 w-64 mt-1 rounded-lg shadow-lg border overflow-hidden"
                            style={{
                              backgroundColor: colors.card,
                              borderColor: colors.border,
                            }}
                          >
                            <div
                              className="p-2 border-b"
                              style={{ borderColor: colors.border }}
                            >
                              <div className="relative">
                                <Search className="absolute left-2 top-2 h-4 w-4 opacity-50" />
                                <input
                                  placeholder="Search..."
                                  value={searchQuery}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
                                  className="w-full pl-8 pr-2 py-1.5 text-sm rounded border focus:outline-none"
                                  style={{
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    color: colors.foreground,
                                  }}
                                />
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCountries.map((c) => (
                                <button
                                  type="button"
                                  key={c.code}
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setIsDropdownOpen(false);
                                    setSearchQuery("");
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs hover:bg-opacity-50"
                                  style={{ color: colors.foreground }}
                                >
                                  <img
                                    src={c.flag}
                                    className="w-4 h-3 object-cover"
                                    alt={c.name}
                                  />
                                  <span className="flex-1 truncate">
                                    {c.name}
                                  </span>
                                  <span style={{ opacity: 0.7 }}>
                                    +{c.dial_code}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        {...register("phone")}
                        className="flex-1 px-4 py-2 rounded-r-lg border focus:outline-none"
                        style={inputStyle(!!errors.phone)}
                      />
                    </div>
                    {errors.phone && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: colors.destructive }}
                      >
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* LinkedIn & Portfolio */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        className="block text-sm mb-1"
                        style={{ color: colors.foreground }}
                      >
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        {...register("linkedIn")}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                        style={inputStyle(!!errors.linkedIn)}
                      />
                      {errors.linkedIn && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.destructive }}
                        >
                          {errors.linkedIn.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-sm mb-1"
                        style={{ color: colors.foreground }}
                      >
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        {...register("portfolio")}
                        placeholder="https://..."
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                        style={inputStyle(!!errors.portfolio)}
                      />
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: colors.foreground }}
                    >
                      Resume/CV
                    </label>
                    <div
                      className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-opacity-50"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      }}
                    >
                      <Upload
                        className="h-4 w-4"
                        style={{ color: colors.primary }}
                      />
                      <span
                        className="text-sm truncate"
                        style={{ color: colors.foreground }}
                      >
                        {fileName || "Upload File (PDF, DOCX)"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="resumeUpload"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFileName(e.target.files[0].name);
                          }
                        }}
                      />
                      <label
                        htmlFor="resumeUpload"
                        className="cursor-pointer text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: colors.primary,
                          color: "white",
                        }}
                      >
                        Choose
                      </label>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: colors.foreground }}
                    >
                      Cover Letter{" "}
                      <span style={{ color: colors.primary }}>*</span>
                    </label>
                    <textarea
                      rows={4}
                      {...register("coverLetter")}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none resize-none"
                      style={inputStyle(!!errors.coverLetter)}
                      placeholder="Tell us why you are a good fit..."
                    />
                    {errors.coverLetter && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: colors.destructive }}
                      >
                        {errors.coverLetter.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: colors.primary,
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Submit Application <Send className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
