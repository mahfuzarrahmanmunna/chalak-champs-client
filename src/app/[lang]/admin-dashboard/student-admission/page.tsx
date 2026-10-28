"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import api from "@/lib/api";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  UserRoundPlus,
} from "lucide-react";

interface CourseOption {
  _id: string;
  title: string | { en?: string; bn?: string };
}

interface AdmissionFormValues {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  presentAddress: string;
  permanentAddress: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  qualification: string;
  institution: string;
  passingYear: string;
  educationDetails: string;
  courseId: string;
  preferredBatch: string;
  motivation: string;
  previousExperience: string;
}

const defaultValues: AdmissionFormValues = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  presentAddress: "",
  permanentAddress: "",
  guardianName: "",
  guardianRelationship: "",
  guardianPhone: "",
  guardianEmail: "",
  qualification: "",
  institution: "",
  passingYear: "",
  educationDetails: "",
  courseId: "",
  preferredBatch: "",
  motivation: "",
  previousExperience: "",
};

const courseLabel = (title: CourseOption["title"]): string => {
  if (typeof title === "string") return title;
  return title.en || title.bn || "Untitled course";
};

export default function StudentAdmissionPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { getLink } = useLanguage();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionFormValues>({
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (authLoading || !currentUser) return;

    let active = true;

    const loadCourses = async () => {
      try {
        const token = await currentUser.getIdToken();
        const response = await api.get("/api/admin/courses", {
          params: { limit: 100, published: "all" },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error("The course list response was invalid.");
        }
        if (active) setCourses(response.data.data);
      } catch (loadError) {
        console.error("Failed to load courses for admission form:", loadError);
        if (active) {
          setError("Courses could not be loaded. Please refresh and try again.");
        }
      } finally {
        if (active) setLoadingCourses(false);
      }
    };

    void loadCourses();
    return () => {
      active = false;
    };
  }, [authLoading, currentUser]);

  const onSubmit = async (values: AdmissionFormValues) => {
    setError("");
    setSuccess("");

    try {
      if (!currentUser) {
        throw new Error("You must be signed in to submit an admission.");
      }
      const token = await currentUser.getIdToken();
      const response = await api.post("/api/admin/admissions", {
        student: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          dateOfBirth: values.dateOfBirth || undefined,
          gender: values.gender || undefined,
          presentAddress: values.presentAddress || undefined,
          permanentAddress: values.permanentAddress || undefined,
        },
        guardian: {
          fullName: values.guardianName,
          relationship: values.guardianRelationship || undefined,
          phone: values.guardianPhone,
          email: values.guardianEmail || undefined,
        },
        education: {
          qualification: values.qualification || undefined,
          institution: values.institution || undefined,
          passingYear: values.passingYear ? Number(values.passingYear) : undefined,
          details: values.educationDetails || undefined,
        },
        courseId: values.courseId,
        preferredBatch: values.preferredBatch || undefined,
        motivation: values.motivation || undefined,
        previousExperience: values.previousExperience || undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success || !response.data.application?.applicationNumber) {
        throw new Error(response.data.message || "The application was not saved.");
      }

      setSuccess(
        `Application ${response.data.application.applicationNumber} was created successfully.`,
      );
      reset(defaultValues);
    } catch (submitError) {
      console.error("Failed to submit admission application:", submitError);
      const message = axios.isAxiosError<{ message?: string }>(submitError)
        ? submitError.response?.data?.message ||
          "Could not submit the application. Please try again."
        : submitError instanceof Error
          ? submitError.message
          : "Could not submit the application. Please try again.";
      setError(message);
    }
  };

  const baseInputClass =
    "w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#214187] focus:ring-4 focus:ring-[#214187]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

  const errorBorderClass =
    "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-700/60 dark:focus:border-rose-500 dark:focus:ring-rose-500/20";

  const normalBorderClass =
    "border-slate-200 dark:border-slate-700";

  const fieldError = (field: keyof AdmissionFormValues) =>
    errors[field] ? (
      <span className="mt-1 block text-xs font-medium text-rose-600 dark:text-rose-400">
        {errors[field]?.message as string}
      </span>
    ) : null;

  const textField = (
    field: keyof AdmissionFormValues,
    label: string,
    required = false,
    type = "text",
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}{required && <span className="ml-1 text-[#F3056D]">*</span>}
      </span>
      <input
        type={type}
        min={type === "number" ? 1900 : undefined}
        max={type === "number" ? new Date().getFullYear() + 10 : undefined}
        step={type === "number" ? 1 : undefined}
        {...register(field, {
          required: required ? `${label} is required` : false,
        })}
        className={`${baseInputClass} ${
          errors[field] ? errorBorderClass : normalBorderClass
        }`}
      />
      {fieldError(field)}
    </label>
  );

  const textArea = (
    field: keyof AdmissionFormValues,
    label: string,
    rows = 3,
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <textarea
        rows={rows}
        {...register(field)}
        className={`${baseInputClass} ${
          errors[field] ? errorBorderClass : normalBorderClass
        }`}
      />
      {fieldError(field)}
    </label>
  );

  const sectionClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6";

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={getLink("/admin-dashboard")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#214187] dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin dashboard
        </Link>
        <span className="rounded-full bg-[#214187]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#214187] dark:bg-blue-400/10 dark:text-blue-200">
          Admission intake
        </span>
      </div>

      <header className="rounded-3xl bg-linear-to-r from-[#214187] to-[#142b5e] p-6 text-white shadow-xl shadow-[#214187]/20 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/10 p-3">
            <UserRoundPlus className="h-7 w-7 text-[#FFD700]" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
              Chalak Champs
            </p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              Student admission form
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
              Enter a student&apos;s details to create an application. Required
              fields are marked with an asterisk.
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <section className={sectionClass}>
          <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
            Student information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("fullName", "Full name", true)}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email address<span className="ml-1 text-[#F3056D]">*</span>
              </span>
              <input
                type="email"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`${baseInputClass} ${
                  errors.email ? errorBorderClass : normalBorderClass
                }`}
              />
              {fieldError("email")}
            </label>
            {textField("phone", "Phone number", true, "tel")}
            {textField("dateOfBirth", "Date of birth", false, "date")}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Gender
              </span>
              <select
                {...register("gender")}
                className={`${baseInputClass} ${normalBorderClass}`}
              >
                <option value="">Prefer not to say</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <div className="sm:col-span-2">
              {textArea("presentAddress", "Present address", 2)}
            </div>
            <div className="sm:col-span-2">
              {textArea("permanentAddress", "Permanent address", 2)}
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
            Guardian information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("guardianName", "Guardian's full name", true)}
            {textField("guardianRelationship", "Relationship")}
            {textField("guardianPhone", "Guardian's phone number", true, "tel")}
            {textField("guardianEmail", "Guardian's email", false, "email")}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
            Educational background
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("qualification", "Highest qualification")}
            {textField("institution", "Institution name")}
            {textField("passingYear", "Passing year", false, "number")}
            <div className="sm:col-span-2">
              {textArea("educationDetails", "Academic information", 3)}
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
            Course and goals
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Course applied for<span className="ml-1 text-[#F3056D]">*</span>
              </span>
              <select
                disabled={loadingCourses || courses.length === 0}
                {...register("courseId", {
                  required: "Please select a course",
                })}
                className={`${baseInputClass} ${
                  errors.courseId ? errorBorderClass : normalBorderClass
                } disabled:opacity-60`}
              >
                <option value="">
                  {loadingCourses ? "Loading courses..." : "Select a course"}
                </option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {courseLabel(course.title)}
                  </option>
                ))}
              </select>
              {fieldError("courseId")}
            </label>
            {textField("preferredBatch", "Preferred batch")}
            <div className="sm:col-span-2">
              {textArea("motivation", "Learning goals or motivation", 3)}
            </div>
            <div className="sm:col-span-2">
              {textArea("previousExperience", "Previous experience", 3)}
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The application will be saved securely and marked Submitted.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || loadingCourses || courses.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F3056D] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#F3056D]/20 transition hover:bg-[#d90460] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit admission"}
          </button>
        </div>
      </form>
    </main>
  );
}