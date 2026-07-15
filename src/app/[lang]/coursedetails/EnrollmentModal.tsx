"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  Calendar,
  UserCircle,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import Button from "@/app/ui/button/Button";
import { createEnrollment } from "@/app/services/enrollmentService";

/* ═══════════════════════════════════════════════════
   2-STEP ENROLLMENT MODAL (Primary Color: #F3056D)
   ═══════════════════════════════════════════════════ */
interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  coursePrice: string;
  courseSlug: string; // ✅ Added - required for API
  originalPrice?: string;
  startDate: string;
  endDate: string;
  onSubmit?: (data: { name: string; phone: string }) => Promise<void>; // Optional - uses service by default
}

export default function EnrollmentModal({
  isOpen,
  onClose,
  courseTitle,
  coursePrice,
  courseSlug,
  originalPrice,
  startDate,
  endDate,
  onSubmit: customOnSubmit,
}: EnrollmentModalProps) {
  const { isBangla } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const handleStep1Next = () => {
    setStep(2);
    setError(null);
  };

  const handleStep2Submit = async () => {
    if (!formData.name || !formData.phone) {
      setError(isBangla ? "সকল তথ্য পূরণ করুন" : "Please fill in all fields");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(formData.phone.trim())) {
      setError(
        isBangla
          ? "সঠিক ফোন নম্বর দিন (01XXXXXXXXX)"
          : "Enter a valid BD phone number"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Use custom onSubmit if provided, otherwise use the service
      if (customOnSubmit) {
        await customOnSubmit({ name: formData.name, phone: formData.phone });
      } else {
        // Use the enrollment service
        const result = await createEnrollment({
          name: formData.name,
          phone: formData.phone,
          courseId: courseSlug, // Using slug as courseId
          courseTitle: courseTitle,
          amount: coursePrice,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to submit enrollment");
        }

        // Store purchase ID for reference
        if (result.data?.purchaseId) {
          setPurchaseId(result.data.purchaseId);
        }
      }

      // Show success state
      setSuccess(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        (isBangla ? "কিছু সমস্যা হয়েছে।" : "Something went wrong.");

      // Handle specific error cases
      if (err.response?.status === 409) {
        setError(
          isBangla
            ? "আপনি ইতিমধ্যে এই কোর্সের জন্য আবেদন করেছেন। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।"
            : "You have already applied for this course. Please contact support."
        );
      } else if (err.response?.status === 404) {
        setError(
          isBangla
            ? "কোর্সটি পাওয়া যায়নি।"
            : "Course not found."
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ name: "", phone: "" });
    setError(null);
    setSuccess(false);
    setPurchaseId(null);
    onClose();
  };

  const handleDone = () => {
    setStep(1);
    setFormData({ name: "", phone: "" });
    setError(null);
    setSuccess(false);
    setPurchaseId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="bg-white w-full max-w-md rounded-[28px] md:rounded-[32px] shadow-2xl overflow-hidden relative z-10 flex flex-col animate-in zoom-in-95 duration-300">
        {/* ═══════════════════════════════════════════
            SUCCESS STATE
            ═══════════════════════════════════════════ */}
        {success ? (
          <>
            {/* Success Header */}
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 md:p-8 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold">
                  {isBangla ? "সফলভাবে সম্পন্ন!" : "Successfully Completed!"}
                </h2>
              </div>
            </div>

            {/* Success Body */}
            <div className="p-6 md:p-8 space-y-5">
              <div className="text-center space-y-3">
                <p className="text-gray-600 text-base leading-relaxed">
                  {isBangla
                    ? "আপনার এনরোলমেন্ট আবেদনটি সফলভাবে জমা হয়েছে।"
                    : "Your enrollment application has been submitted successfully."}
                </p>

                {purchaseId && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      {isBangla ? "পারচেজ আইডি" : "Purchase ID"}
                    </p>
                    <p className="text-lg font-bold text-gray-900 font-mono">
                      {purchaseId}
                    </p>
                  </div>
                )}

                <div className="bg-[#F3056D]/5 rounded-xl p-4 border border-[#F3056D]/10">
                  <p className="text-sm text-gray-600">
                    {isBangla
                      ? "আমরা শীঘ্রই আপনার ফোনে যোগাযোগ করব।"
                      : "We will contact you on your phone soon."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Phone className="h-3.5 w-3.5" />
                <span>{formData.phone}</span>
              </div>

              <Button
                onClick={handleDone}
                bgColor="#F3056D"
                highlightColor="#FF3D8F"
                darkShadowColor="#C6005F"
                className="w-full py-3.5 text-base font-bold"
                px="px-6"
              >
                {isBangla ? "ডন" : "Done"}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* ═══════════════════════════════════════════
                HEADER - Step 1 (White)
                ═══════════════════════════════════════════ */}
            {step === 1 ? (
              <div className="relative bg-white p-5 md:p-6 border-b border-gray-100">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  {[1, 2].map((s) => (
                    <React.Fragment key={s}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            step >= s
                              ? "bg-[#F3056D] text-white scale-110 shadow-md shadow-pink-200"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {s}
                        </div>
                        <span
                          className={`text-sm font-bold transition-colors ${
                            step >= s ? "text-[#F3056D]" : "text-gray-400"
                          }`}
                        >
                          {isBangla ? `ধাপ ${s}` : `Step ${s}`}
                        </span>
                      </div>
                      {s < 2 && (
                        <div
                          className={`h-0.5 w-10 md:w-14 rounded-full transition-colors duration-300 ${
                            step > s ? "bg-[#F3056D]" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    {isBangla ? "আবেদন ফর্ম পূরণ" : "Fill Application Form"}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            ) : (
              /* ═══════════════════════════════════════════
                  HEADER - Step 2 (Primary Color Gradient)
                  ═══════════════════════════════════════════ */
              <div className="relative bg-gradient-to-br from-[#F3056D] to-[#C6005F] p-5 md:p-6 pt-7 md:pt-8 text-white">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold border border-white/30">
                        2
                      </div>
                      <span className="text-xs font-medium text-pink-200">
                        {isBangla ? "ধাপ ২" : "Step 2"}
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold">
                      {isBangla ? "এর ঠিকানা দিন" : "Provide Your Information"}
                    </h2>
                    <p className="text-pink-200 text-sm font-medium mt-1 line-clamp-1">
                      {courseTitle}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                BODY
                ═══════════════════════════════════════════ */}
            <div className="p-5 md:p-6 lg:p-8 flex-1 overflow-y-auto">
              {/* ─────────────────────────────────────
                  STEP 1: Course Summary & Price
                  ───────────────────────────────────── */}
              {step === 1 && (
                <div className="animate-in fade-in duration-300 space-y-5">
                  {/* Course Info Card */}
                  <div className="flex items-start gap-3 p-4 bg-pink-50/50 rounded-xl border border-pink-100">
                    <div className="w-10 h-10 rounded-xl bg-[#F3056D] flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2">
                        {courseTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {startDate} - {endDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Table */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-3 bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {isBangla ? "বিবরণ" : "Description"}
                      </span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                        {isBangla ? "ধরণ" : "Type"}
                      </span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                        {isBangla ? "মূল্য" : "Amount"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 px-4 py-3.5 border-b border-gray-50 items-center">
                      <span className="text-sm text-gray-700 font-medium truncate pr-2">
                        {isBangla ? "কোর্স ফি" : "Course Fee"}
                      </span>
                      <span className="text-xs text-gray-500 text-center">
                        {isBangla ? "মূল ফি" : "Base Fee"}
                      </span>
                      <span className="text-sm font-bold text-gray-900 text-right">
                        {coursePrice}
                      </span>
                    </div>

                    {originalPrice && (
                      <div className="grid grid-cols-3 px-4 py-3.5 border-b border-gray-50 items-center">
                        <span className="text-sm text-gray-400 font-medium truncate pr-2 line-through">
                          {isBangla ? "আসল মূল্য" : "Original Price"}
                        </span>
                        <span className="text-xs text-gray-400 text-center">
                          {isBangla ? "আগে" : "Before"}
                        </span>
                        <span className="text-sm text-gray-400 text-right line-through">
                          {originalPrice}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 px-4 py-3.5 bg-[#F3056D]/5 items-center">
                      <span className="text-sm font-bold text-[#F3056D] truncate pr-2">
                        {isBangla ? "মোট" : "Total"}
                      </span>
                      <span className="text-xs text-[#F3056D] text-center font-medium">
                        {isBangla ? "পেমেন্ট" : "Payment"}
                      </span>
                      <span className="text-base font-bold text-[#F3056D] text-right">
                        {coursePrice}
                      </span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Shield className="h-4 w-4 text-[#F3056D]" />
                    <span className="text-xs font-medium text-gray-500">
                      {isBangla
                        ? "নিরাপদ পেমেন্ট গ্যারান্টি"
                        : "Secure Payment Guaranteed"}
                    </span>
                  </div>

                  {/* Next Button */}
                  <Button
                    onClick={handleStep1Next}
                    bgColor="#F3056D"
                    highlightColor="#FF3D8F"
                    darkShadowColor="#C6005F"
                    className="w-full py-3.5 text-base font-bold flex items-center justify-center gap-2"
                    px="px-6"
                  >
                    {isBangla ? "পরবর্তী ধাপ" : "Next Step"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* ─────────────────────────────────────
                  STEP 2: User Information Form
                  ───────────────────────────────────── */}
              {step === 2 && (
                <div className="animate-in fade-in duration-300 space-y-5">
                  {/* Back Button */}
                  <button
                    onClick={() => {
                      setStep(1);
                      setError(null);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#F3056D] transition-colors group"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    {isBangla ? "পূর্ববর্তী ধাপ" : "Previous Step"}
                  </button>

                  {/* Info Notice */}
                  <div className="flex items-start gap-3 p-4 bg-[#F3056D]/5 rounded-xl border border-[#F3056D]/10">
                    <div className="w-10 h-10 rounded-xl bg-[#F3056D] flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {isBangla
                          ? "আপনার তথ্য প্রদান করুন"
                          : "Provide Your Details"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isBangla
                          ? "এনরোলমেন্ট সম্পন্ন করতে নিচের তথ্য দিন"
                          : "Fill in the details below to complete enrollment"}
                      </p>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <UserCircle className="h-4 w-4 text-[#F3056D]" />
                      {isBangla ? "আপনার নাম" : "Your Name"}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={
                        isBangla ? "পূর্ণ নাম লিখুন" : "Enter your full name"
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                        error && !formData.name
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                          : "border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-pink-50"
                      }`}
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Phone className="h-4 w-4 text-[#F3056D]" />
                      {isBangla ? "ফোন নম্বর" : "Phone Number"}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={isBangla ? "01XXXXXXXXX" : "01XXXXXXXXX"}
                      maxLength={11}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                        error &&
                        (!formData.phone ||
                          !/^01[3-9]\d{8}$/.test(formData.phone.trim()))
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                          : "border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-pink-50"
                      }`}
                    />
                    <p className="text-xs text-gray-400">
                      {isBangla
                        ? "বাংলাদেশি মোবাইল নম্বর দিন"
                        : "Enter a Bangladeshi mobile number"}
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100 animate-in slide-in-from-top-2 duration-200">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                  )}

                  {/* Price Summary */}
                  <div className="bg-[#F3056D]/5 rounded-xl p-4 border border-[#F3056D]/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        {isBangla ? "মোট পেমেন্ট" : "Total Payment"}
                      </span>
                      <span className="text-xl font-bold text-[#F3056D]">
                        {coursePrice}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleStep2Submit}
                    bgColor="#F3056D"
                    highlightColor="#FF3D8F"
                    darkShadowColor="#C6005F"
                    disabled={loading}
                    className="w-full py-3.5 text-base font-bold flex items-center justify-center gap-2"
                    px="px-6"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isBangla ? "প্রক্রিয়াকরণ..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        {isBangla
                          ? "এনরোলমেন্ট সম্পন্ন করুন"
                          : "Complete Enrollment"}
                      </>
                    )}
                  </Button>

                  {/* Terms */}
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    {isBangla
                      ? "এনরোলমেন্ট করার মাধ্যমে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন"
                      : "By enrolling, you agree to our terms and conditions"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}