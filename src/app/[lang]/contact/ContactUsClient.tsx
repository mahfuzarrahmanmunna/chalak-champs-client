"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  ChevronDown,
  Search,
  Check,
  MessageCircle,
  Phone,
  FileText,
  GraduationCap,
} from "lucide-react";

// Define Interface for Country to fix TypeScript errors
interface Country {
  name: string;
  flag: string;
  code: string;
  cca2: string;
}

export default function ContactUsClient() {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      studentName: "",
      guardianName: "",
      countryCode: "",
      phone: "",
      classLevel: "",
      message: "",
      contactMethod: "whatsapp", // Default preference
    },
  });

  // State for Country Selector - Fixed with <Country[]>
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Countries Data
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2")
      .then((res) => res.json())
      .then((data) => {
        // Explicitly type incoming data map as 'any' to avoid complex API type definition
        const mappedCountries: Country[] = data
          .map((country: any) => {
            const root = country.idd?.root || "";
            const suffix = country.idd?.suffixes?.[0] || "";
            if (!root) return null;
            return {
              name: country.name.common,
              flag: country.flags.svg,
              code: `${root}${suffix}`,
              cca2: country.cca2,
            };
          })
          .filter(Boolean);

        mappedCountries.sort((a: Country, b: Country) =>
          a.name.localeCompare(b.name),
        );
        setCountries(mappedCountries);

        // Default to Bangladesh
        const bangladesh = mappedCountries.find(
          (c: Country) => c.cca2 === "BD",
        );
        if (bangladesh) {
          setSelectedCountry(bangladesh);
          setValue("countryCode", bangladesh.code);
        } else if (mappedCountries.length > 0) {
          setSelectedCountry(mappedCountries[0]);
          setValue("countryCode", mappedCountries[0].code);
        }
      })
      .catch((err) => console.error("Failed to fetch countries", err));
  }, [setValue]);

  // Filter countries - Type inferred correctly now
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm),
  );

  // Click Outside - Fixed event parameter type
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setValue("countryCode", country.code);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const onSubmit = (data: any) => {
    const fullPhoneNumber = `${data.countryCode}${data.phone}`;
    console.log("Form Submitted:", { ...data, fullPhoneNumber });
    // Submit logic here
  };

  return (
    <section className="container mx-auto py-12 px-4">
      {/* Header Section */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-[#00477C] pointer-events-none tracking-tight mb-4">
          কোর্স সম্পর্কিত{" "}
          <span className="relative inline-block px-3 py-3 group">
            {/* Dashed Border */}
            <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>

            {/* Corner Dots */}
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>

            {/* Gradient Text - Fixed className typo here */}
            <span className="relative bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent">
              জিজ্ঞাসা
            </span>
          </span>
        </h1>
        <p className="text-[#2D2D2D] leading-relaxed text-base md:text-lg opacity-90">
          আপনার নাম, ইমেইল, মোবাইল নাম্বার এবং কোন কোর্সে ডিসকাউন্ট চাচ্ছেন বা
          বিস্তারিত জানতে চাচ্ছেন তা সিলেক্ট করে নিচের ফর্মটি সাবমিট করুন।
          আমাদের টিম থেকে শীঘ্রই আপনাকে কল করা হবে ইনশাআল্লাহ! আপনি চাইলে দ্রুত
          রিপ্লাই পেতে{" "}
          <a
            target="_blank"
            href="https://wa.me/8801740176774?text=Hello!%20I%20want%20to%20know%20more%20about%20Chalak%20Champs."
            className="hover:text-primary font-bold"
          >
            WhatsApp
          </a>{" "}
          এ মেসেজ দিতে পারেন!
        </p>
      </section>

      {/* Main Grid Layout */}
      <section className=" mx-auto grid grid-cols-1  gap-8">
        {/* Left Column: The Form */}
        <div className="lg:col-span-2 ">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Name */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                  শিক্ষার্থীর নাম <span className="text-primary">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 opacity-50 pointer-events-none text-gray-500">
                    <User size={18} />
                  </span>
                  <input
                    {...register("studentName", { required: true })}
                    type="text"
                    placeholder="শিক্ষার্থীর নাম"
                    className="w-full pl-10 pr-4 py-3 placeholder:text-gray-500 text-[#020817] rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Guardian Name */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                  অভিভাবকের নাম <span className="text-primary">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 opacity-50 pointer-events-none text-gray-500">
                    <User size={18} />
                  </span>
                  <input
                    {...register("guardianName", { required: true })}
                    type="text"
                    placeholder="অভিভাবকের নাম"
                    className="w-full pl-10 pr-4 py-3 placeholder:text-gray-500 text-[#020817] rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                ফোন নাম্বার <span className="text-primary">*</span>
              </label>
              <div className="relative" ref={dropdownRef}>
                <div className="flex rounded-lg border focus-within:ring-2 focus-within:ring-primary transition-all">
                  {/* Country Selector */}
                  <div className="relative w-full md:w-48 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full h-full flex items-center justify-between px-3 border-r bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 transition-colors rounded-l-lg"
                    >
                      <div className="flex items-center text-[#111827] gap-2">
                        {selectedCountry && (
                          <img
                            src={selectedCountry.flag}
                            alt="flag"
                            className="w-6 h-4 object-cover rounded-sm"
                          />
                        )}
                        <span className="text-sm font-medium whitespace-nowrap">
                          {selectedCountry?.code}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg max-h-80 overflow-y-auto z-50">
                        <div className="sticky top-0 bg-white dark:bg-gray-900 p-3 border-b border-gray-100 dark:border-gray-800 z-10">
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <Search size={14} className="text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search..."
                              className="bg-transparent text-[#111827] placeholder:text-gray-500 border-none outline-none text-xs w-full"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        {filteredCountries.map((country) => (
                          <button
                            type="button"
                            key={country.cca2}
                            onClick={() => handleSelectCountry(country)}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={country.flag}
                                alt="flag"
                                className="w-5 h-4 object-cover rounded-sm"
                              />
                              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                {country.name}
                              </span>
                            </div>
                            {selectedCountry?.cca2 === country.cca2 && (
                              <Check size={14} className="text-[#00477C]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    {...register("phone", { required: true })}
                    type="tel"
                    placeholder="1XXXXXXXXXX"
                    className="flex-1 px-4 placeholder:text-gray-500 text-[#111827] py-3 outline-none bg-transparent rounded-r-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Class Selection (1-10th) */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                ক্লাস সিলেক্ট করুন <span className="text-primary">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 opacity-50 pointer-events-none text-gray-500">
                  <GraduationCap size={18} />
                </span>
                <select
                  {...register("classLevel", { required: true })}
                  className="w-full pl-10 pr-4 py-3 placeholder:text-gray-500 text-[#020817] rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-[#111827]"
                >
                  <option value="" disabled>
                    ক্লাস বেছে নিন
                  </option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {getBengaliOrdinal(num)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 text-gray-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Contact Preference (Radio) */}
            <div className="space-y-3">
              <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70 block">
                আপনার সঙ্গে কিভাবে যোগাযোগ করবো?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Call */}
                <label
                  className={`cursor-pointer relative rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${watch("contactMethod") === "call" ? "border-primary bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    {...register("contactMethod")}
                    value="call"
                    className="peer sr-only"
                  />
                  <div
                    className={`p-2 rounded-full transition-colors ${watch("contactMethod") === "call" ? "bg-primary/50 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}
                  >
                    <Phone size={18} />
                  </div>
                  <div>
                    <span
                      className={`block text-sm font-semibold ${watch("contactMethod") === "call" ? "text-[#00477C]" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      ডিরেক্ট সিমে কল চাই
                    </span>
                  </div>
                </label>

                {/* Option 2: WhatsApp */}
                <label
                  className={`cursor-pointer relative rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${watch("contactMethod") === "whatsapp" ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    {...register("contactMethod")}
                    value="whatsapp"
                    className="peer sr-only"
                  />
                  <div
                    className={`p-2 rounded-full transition-colors ${watch("contactMethod") === "whatsapp" ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}
                  >
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <span
                      className={`block text-sm font-semibold ${watch("contactMethod") === "whatsapp" ? "text-green-600" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      WhatsApp এ মেসেজ চাই
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                আপনার বার্তা (ঐচ্ছিক)
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 opacity-50 pointer-events-none">
                  <FileText size={18} />
                </span>
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="আপনার প্রশ্ন বা বিস্তারিত এখানে লিখুন..."
                  className="w-full pl-10 pr-4 py-3 placeholder:text-gray-500 text-[#020817] rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}

            <button
              className="group mb-12 cursor-pointer w-full relative overflow-hidden rounded-lg bg-primary py-4 px-16 text-lg font-bold text-white transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,143,202,0.5)] active:scale-95"
              style={{ animation: "pulseScale 2.5s infinite ease-in-out" }}
            >
              {/* Shimmering layer */}
              <span
                className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent"
                style={{
                  transform: "translateX(-100%)",
                  animation: "shimmer 2.5s infinite ease-in-out",
                }}
              ></span>

              {/* Button Text */}
              <span className="relative tracking-[-2%] px-24 z-10 text-white transition-transform duration-300 group-hover:translate-y-[-1px]  flex items-center justify-center">
                জমা দিন <Check size={18} />
              </span>

              {/* Keyframes */}
              <style
                dangerouslySetInnerHTML={{
                  __html: `
    @keyframes shimmer {
      0% { transform: translateX(-100%) skewX(-45deg); }
      40%, 100% { transform: translateX(150%) skewX(-45deg); }
    }
    
    @keyframes pulseScale {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); } 
    }
  `,
                }}
              />
            </button>
          </form>
        </div>

        {/* Right Column: WhatsApp Info Section */}
        <div className="lg:col-span-1">
          {/* WhatsApp Card - Design based on description */}
          <div className="sticky top-8 border-2 border-[#25D366] rounded-xl p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg text-center h-full flex flex-col justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-[#25D366]" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              WhatsApp সম্পর্কে
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              আপনি চাইলে দ্রুত রিপ্লাই পেতে WhatsApp এ মেসেজ দিতে পারেন! আমাদের
              সাপোর্ট টিম সবসময় আপনার সেবায় প্রস্তুত।
            </p>

            <a
              target="_blank"
              href="https://wa.me/8801740176774?text=Hello!%20I%20want%20to%20know%20more%20about%20Chalak%20Champs."
            >
              <button
                className="w-full cursor-pointer bg-[#25D366] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 shadow-md"
                onClick={() => console.log("Open WhatsApp")}
              >
                <MessageCircle size={20} />
                চ্যাট শুরু করুন
              </button>
            </a>

            <p className="text-xs text-gray-400 mt-4">
              সাধারণত ২৪ ঘন্টার মধ্যে উত্তর দেওয়া হয়।
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

// Helper for Bengali Class Ordinals - Fixed parameter type
function getBengaliOrdinal(num: number) {
  if (num === 1) return "ম";
  if (num === 2 || num === 3) return "য়";
  return "ম";
}
