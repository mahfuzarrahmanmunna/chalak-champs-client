"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface EnrollmentFormInputProps {
  label: string;
  name: string;
  type?: "text" | "tel" | "email";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  icon: React.ReactNode;
}

export default function EnrollmentFormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = true,
  icon,
}: EnrollmentFormInputProps) {
  const [focused, setFocused] = useState(false);
  const [showValue, setShowValue] = useState(false);

  const isPhone = type === "tel";
  const isEmail = type === "email";

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-700"
      >
        <span className="text-[#F3056D]">{required && "*"}</span>
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
          error
            ? "border-red-400 ring-4 ring-red-50"
            : focused
              ? "border-[#F3056D] ring-4 ring-pink-50/60"
              : "border-gray-200 hover:border-gray-300"
        } bg-white`}
      >
        <span
          className={`absolute left-3.5 transition-colors duration-200 ${
            error
              ? "text-red-400"
              : focused
                ? "text-[#F3056D]"
                : "text-gray-400"
          }`}
        >
          {icon}
        </span>

        {isPhone && (
          <span className="absolute left-11 text-sm font-semibold text-gray-500 pointer-events-none select-none">
            +880
          </span>
        )}

        <input
          id={name}
          name={name}
          type={isPhone ? "tel" : isEmail && showValue ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={isPhone ? 11 : undefined}
          className={`w-full bg-transparent outline-none text-gray-900 text-[15px] placeholder:text-gray-400 transition-all duration-200 ${
            isPhone ? "pl-[75px]" : "pl-11"
          } ${isEmail ? "pr-11" : "pr-4"} py-3.5`}
        />

        
      </div>
      {error && (
        <p className="text-[13px] text-red-500 font-medium flex items-center gap-1 pl-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}
