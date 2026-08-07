// src/app/[lang]/products/[slug]/components/OrderModal.tsx
"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { X, Package, Loader2, MapPin, User, Phone } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import Button from "@/app/ui/button/Button";
import axiosInstance from "@/lib/axios";

/* ═══════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════ */
function OrderModalHeader({
  productTitle,
  productImage,
  currentPrice,
  originalPrice,
  onClose,
}: {
  productTitle: string;
  productImage: string;
  currentPrice: string;
  originalPrice: string | null;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      {/* Product Image Banner */}
      <div className="relative h-[120px] bg-gradient-to-br from-[#214187] to-[#1a2f6e] overflow-hidden">
        {productImage ? (
          <Image
            src={productImage}
            alt={productTitle}
            fill
            className="object-cover opacity-30"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-20 w-20 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all border border-white/20"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-white font-bold text-lg leading-tight line-clamp-2 flex-1">
              {productTitle}
            </h2>
            <div className="flex items-end gap-2 flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                {currentPrice}
              </span>
              {originalPrice && (
                <span className="text-sm text-white/60 line-through mb-0.5">
                  {originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FORM
   ═══════════════════════════════════════════════════ */
function OrderForm({
  productId,
  productTitle,
  amount,
  onSuccess,
}: {
  productId: string;
  productTitle: string;
  amount: string;
  onSuccess: () => void;
}) {
  const { isBangla } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Bangladesh phone validation
  const isValidPhone = /^01[3-9]\d{8}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(isBangla ? "নাম দিন" : "Please enter your name");
      return;
    }
    if (!isValidPhone) {
      setError(
        isBangla
          ? "সঠিক বাংলাদেশি নম্বর দিন (01XXXXXXXXX)"
          : "Enter a valid BD number (01XXXXXXXXX)",
      );
      return;
    }
    if (!address.trim()) {
      setError(isBangla ? "ঠিকানা দিন" : "Please enter your address");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/api/product-orders", {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        quantity,
        note: note.trim(),
        productId,
        productTitle,
        amount,
      });
      onSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (isBangla ? "অর্ডার ব্যর্থ হয়েছে" : "Order failed");
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uiText = {
    name: isBangla ? "আপনার নাম" : "Your Name",
    namePlaceholder: isBangla ? "নাম লিখুন" : "Enter your name",
    phone: isBangla ? "ফোন নম্বর" : "Phone Number",
    phonePlaceholder: isBangla ? "01XXXXXXXXX" : "01XXXXXXXXX",
    address: isBangla ? "ডেলিভারি ঠিকানা" : "Delivery Address",
    addressPlaceholder: isBangla
      ? "সম্পূর্ণ ঠিকানা লিখুন"
      : "Enter full address",
    quantity: isBangla ? "পরিমাণ" : "Quantity",
    note: isBangla ? "নোট (ঐচ্ছিক)" : "Note (optional)",
    notePlaceholder: isBangla
      ? "বিশেষ নির্দেশনা থাকলে লিখুন..."
      : "Any special instructions...",
    submit: isBangla ? "অর্ডার কনফার্ম করুন" : "Confirm Order",
    submitting: isBangla ? "প্রসেসিং..." : "Processing...",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <User className="h-4 w-4 text-[#F3056D]" />
          {uiText.name} <span className="text-[#F3056D]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={uiText.namePlaceholder}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10 outline-none text-gray-800 transition-all placeholder:text-gray-400"
          autoFocus
        />
      </div>

      {/* Phone Field */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Phone className="h-4 w-4 text-[#F3056D]" />
          {uiText.phone} <span className="text-[#F3056D]">*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, "");
            setPhone(val);
          }}
          placeholder={uiText.phonePlaceholder}
          maxLength={11}
          className={`w-full px-4 py-3 rounded-xl border-2 outline-none text-gray-800 transition-all placeholder:text-gray-400 ${
            phone && !isValidPhone
              ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
              : "border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10"
          }`}
        />
        {phone && !isValidPhone && (
          <p className="text-xs text-red-500 mt-1">
            {isBangla
              ? "সঠিক বাংলাদেশি নম্বর দিন"
              : "Enter a valid Bangladesh number"}
          </p>
        )}
      </div>

      {/* Address Field */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MapPin className="h-4 w-4 text-[#F3056D]" />
          {uiText.address} <span className="text-[#F3056D]">*</span>
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={uiText.addressPlaceholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10 outline-none text-gray-800 transition-all placeholder:text-gray-400 resize-none"
        />
      </div>

      {/* Quantity */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">
          {uiText.quantity}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#F3056D] hover:text-[#F3056D] transition-colors font-bold text-lg"
          >
            −
          </button>
          <span className="w-14 text-center text-xl font-bold text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#F3056D] hover:text-[#F3056D] transition-colors font-bold text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Note Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">
          {uiText.note}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={uiText.notePlaceholder}
          rows={2}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F3056D] focus:ring-4 focus:ring-[#F3056D]/10 outline-none text-gray-800 transition-all placeholder:text-gray-400 resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          isSubmitting || !name.trim() || !isValidPhone || !address.trim()
        }
        bgColor="#F3056D"
        darkShadowColor="#F3066E"
        highlightColor="#FF8FCA"
        hoverTextColor="#F3056D"
        className="w-full py-3.5 rounded-xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.98] bg-[#F3056D] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mt-2"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {uiText.submitting}
          </span>
        ) : (
          uiText.submit
        )}
      </Button>
    </form>
  );
}

/* ═══════════════════════════════════════════════════
   SUCCESS
   ═══════════════════════════════════════════════════ */
function OrderSuccess({
  productTitle,
  onClose,
}: {
  productTitle: string;
  onClose: () => void;
}) {
  const { isBangla } = useLanguage();

  return (
    <div className="text-center py-4 space-y-5 animate-in zoom-in-95 fade-in duration-400">
      {/* Animated Checkmark */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {isBangla ? "অর্ডার সফল হয়েছে!" : "Order Placed Successfully!"}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          {isBangla
            ? `আপনার "${productTitle}" অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।`
            : `Your order for "${productTitle}" has been received. We will contact you soon.`}
        </p>
      </div>

      {/* Info Cards */}
      <div className="bg-green-50 rounded-xl p-4 border border-green-100 space-y-2">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <Phone className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-green-700 text-left">
            {isBangla
              ? "ফোনে কল করে অর্ডার নিশ্চিত করা হবে"
              : "We'll call to confirm your order"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-green-700 text-left">
            {isBangla
              ? "ডেলিভারি ঠিকানায় পৌঁছে দেওয়া হবে"
              : "Will be delivered to your address"}
          </span>
        </div>
      </div>

      <Button
        onClick={onClose}
        bgColor="#214187"
        darkShadowColor="#1a2f6e"
        highlightColor="#4a6fa5"
        hoverTextColor="#214187"
        className="w-full py-3 rounded-xl text-white font-bold text-base shadow-lg transition-all active:scale-[0.98] bg-[#214187]"
      >
        {isBangla ? "ঠিক আছে" : "Okay, Got It"}
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MODAL WRAPPER
   ═══════════════════════════════════════════════════ */
interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  productImage: string;
  amount: string;
  originalAmount: string | null;
}

export default function OrderModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  productImage,
  amount,
  originalAmount,
}: OrderModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  // Form state key to force reset on reopen
  const [formKey, setFormKey] = useState(0);

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

  // Reset success state and form when modal reopens
  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      setFormKey((prev) => prev + 1);
    }
  }, [isOpen]);

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
        <OrderModalHeader
          productTitle={productTitle}
          productImage={productImage}
          currentPrice={amount}
          originalPrice={originalAmount}
          onClose={handleClose}
        />

        <div className="px-6 py-6 md:px-8 md:py-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {showSuccess ? (
            <OrderSuccess productTitle={productTitle} onClose={handleClose} />
          ) : (
            <OrderForm
              key={formKey}
              productId={productId}
              productTitle={productTitle}
              amount={amount}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
