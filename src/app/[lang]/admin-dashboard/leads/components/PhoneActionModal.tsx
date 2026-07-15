"use client";

import { useState } from "react";
import { Phone, Copy, MessageCircle, X, Check } from "lucide-react";

interface PhoneActionModalProps {
  phone: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneActionModal({
  phone,
  isOpen,
  onClose,
}: PhoneActionModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCall = () => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleWhatsApp = () => {
    // Remove '+' if it exists, as WhatsApp API expects numbers without it
    const cleanPhone = phone.replace(/^\+/, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="bg-[#00477C] p-5 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
          <Phone className="h-8 w-8 mx-auto mb-2 opacity-90" />
          <p className="text-sm font-medium opacity-80">Contact Number</p>
          <h2 className="text-2xl font-bold tracking-wide mt-1">{phone}</h2>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-3">
          {/* Call Option */}
          <button
            onClick={handleCall}
            className="w-full flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors group border border-blue-100"
          >
            <div className="bg-blue-500 text-white p-2.5 rounded-lg group-hover:scale-105 transition-transform">
              <Phone size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Direct Call</p>
              <p className="text-xs text-blue-500">Dial directly from device</p>
            </div>
          </button>

          {/* WhatsApp Option */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors group border border-green-100"
          >
            <div className="bg-green-500 text-white p-2.5 rounded-lg group-hover:scale-105 transition-transform">
              <MessageCircle size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">WhatsApp</p>
              <p className="text-xs text-green-500">Open chat in WhatsApp</p>
            </div>
          </button>

          {/* Copy Option */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors group border border-gray-200"
          >
            <div className="bg-gray-500 text-white p-2.5 rounded-lg group-hover:scale-105 transition-transform">
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">
                {copied ? "Copied!" : "Copy Number"}
              </p>
              <p className="text-xs text-gray-500">
                {copied ? "Saved to clipboard" : "Copy to clipboard"}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
