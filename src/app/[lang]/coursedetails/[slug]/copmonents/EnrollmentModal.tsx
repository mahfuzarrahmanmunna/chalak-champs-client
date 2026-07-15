"use client";

import { useEffect, useCallback, useState } from "react";
import EnrollmentModalHeader from "./EnrollmentModalHeader";
import EnrollmentForm from "./EnrollmentForm";
import EnrollmentSuccess from "./EnrollmentSuccess";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  courseTitle: string;
  amount: string;
}

export default function EnrollmentModal({
  isOpen,
  onClose,
  slug,
  courseTitle,
  amount,
}: EnrollmentModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = useCallback(() => {
    setShowSuccess(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowSuccess(false);
    onClose();
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[28px] md:rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <EnrollmentModalHeader
          courseTitle={courseTitle}
          onClose={handleClose}
        />

        <div className="px-6 py-6 md:px-8 md:py-8">
          {showSuccess ? (
            <EnrollmentSuccess
              courseTitle={courseTitle}
              onClose={handleClose}
            />
          ) : (
            <EnrollmentForm
              slug={slug}
              courseTitle={courseTitle}
              amount={amount}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
