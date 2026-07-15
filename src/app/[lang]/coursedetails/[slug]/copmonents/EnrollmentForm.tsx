"use client";

import { useState } from "react";
import { UserCircle, Phone, Mail, Loader2, Shield } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import EnrollmentFormInput from "./EnrollmentFormInput";
import Button from "@/app/ui/button/Button";

interface EnrollmentFormProps {
  slug: string;
  courseTitle: string;
  amount: string;
  onSuccess: () => void;
}

export default function EnrollmentForm({
  slug,
  courseTitle,
  amount,
  onSuccess,
}: EnrollmentFormProps) {
  const { isBangla } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, phone: digits }));
    } else if (name === "name") {
      const letters = value.replace(/[^a-zA-Z\u0980-\u09FF\s.]/g, "");
      setFormData((prev) => ({ ...prev, name: letters }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = isBangla ? "আপনার নাম লিখুন" : "Please enter your name";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = isBangla
        ? "নাম কমপক্ষে ২ অক্ষরের হতে হবে"
        : "Name must be at least 2 characters";
    }

    if (!formData.phone) {
      newErrors.phone = isBangla
        ? "ফোন নম্বর দিন"
        : "Please enter your phone number";
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = isBangla
        ? "সঠিক বাংলাদেশি নম্বর দিন (01XXXXXXXXX)"
        : "Enter a valid BD number (01XXXXXXXXX)";
    }

    if (!formData.email.trim()) {
      newErrors.email = isBangla
        ? "ইমেইল ঠিকানা দিন"
        : "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = isBangla
        ? "সঠিক ইমেইল দিন"
        : "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError(null);

    try {
      const { createEnrollment } =
        await import("@/app/services/enrollmentService");
      const result = await createEnrollment({
        name: formData.name.trim(),
        phone: formData.phone,
        courseId: slug || "unknown",
        courseTitle: courseTitle || "Course",
        amount: amount || "0",
        email: formData.email.trim(),
      });

      if (result.success) {
        onSuccess();
      } else {
        throw new Error(result.message || "Enrollment failed");
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setServerError(
        err?.response?.data?.message ||
          err?.message ||
          (isBangla
            ? "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।"
            : "Something went wrong. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Server Error */}
      {serverError && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </span>
          <p className="text-sm text-red-600 font-medium leading-relaxed">
            {serverError}
          </p>
        </div>
      )}

      {/* Name */}
      <EnrollmentFormInput
        label={isBangla ? "আপনার নাম" : "Your Name"}
        name="name"
        type="text"
        placeholder={isBangla ? "যেমনঃ রাহাত ইসলাম" : "e.g. Rahat Islam"}
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        icon={<UserCircle className="h-4.5 w-4.5" />}
      />

      {/* Phone */}
      <EnrollmentFormInput
        label={isBangla ? "ফোন নম্বর" : "Phone Number"}
        name="phone"
        type="tel"
        placeholder="1XXXXXXXXX"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        icon={<Phone className="h-4.5 w-4.5" />}
      />

      {/* Email */}
      <EnrollmentFormInput
        label={isBangla ? "ইমেইল ঠিকানা" : "Email Address"}
        name="email"
        type="email"
        placeholder={isBangla ? "example@gmail.com" : "example@gmail.com"}
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<Mail className="h-4.5 w-4.5" />}
      />

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        bgColor={loading ? "#9CA3AF" : "#F3056D"}
        highlightColor="#FF8FCA"
        darkShadowColor="#C6005F"
        className="w-full text-base md:text-lg flex items-center justify-center gap-2.5 disabled:cursor-not-allowed disabled:shadow-none mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {isBangla ? "জমা হচ্ছে..." : "Submitting..."}
          </>
        ) : (
          <>{isBangla ? "এনরোল করুন" : "Enroll Now"}</>
        )}
      </Button>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <Shield className="h-3.5 w-3.5 text-gray-400" />
        <p className="text-[12px] text-gray-400 font-medium">
          {isBangla
            ? "আপনার তথ্য সম্পূর্ণ নিরাপদ"
            : "Your information is completely safe"}
        </p>
      </div>
    </form>
  );
}
