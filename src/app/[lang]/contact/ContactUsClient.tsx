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
import { useLanguage } from "@/app/context/LanguageContext";

interface Country {
  name: string;
  flag: string;
  code: string;
  cca2: string;
}

const translations = {
  en: {
    titlePrefix: "Course Related",
    titleHighlight: "Inquiry",
    description:
      "Submit the form below with your name, email, phone number, and which course you want a discount on or want to know more about. Our team will call you soon, InshaAllah! For a faster reply, you can message us on ",
    whatsappLink: "WhatsApp",
    whatsappLinkSuffix: ".",
    studentName: "Student Name",
    guardianName: "Guardian Name",
    phoneNumber: "Phone Number",
    selectClass: "Select Class",
    chooseClass: "Choose a class",
    contactPreference: "How would you like us to contact you?",
    directCall: "I want a direct call",
    whatsappMsg: "I want a WhatsApp message",
    yourMessage: "Your Message (Optional)",
    messagePlaceholder: "Write your question or details here...",
    submit: "Submit",
    searchCountry: "Search...",
    whatsappTitle: "About WhatsApp",
    whatsappDesc:
      "For a faster reply, you can message us on WhatsApp! Our support team is always ready to serve you.",
    startChat: "Start Chat",
    replyNote: "Usually replied within 24 hours.",
    ordinals: ["", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th"],
    waText: "Hello! I want to know more about Chalak Champs.",
  },
  bn: {
    titlePrefix: "কোর্স সম্পর্কিত",
    titleHighlight: "জিজ্ঞাসা",
    description:
      "আপনার নাম, ইমেইল, মোবাইল নাম্বার এবং কোন কোর্সে ডিসকাউন্ট চাচ্ছেন বা বিস্তারিত জানতে চাচ্ছেন তা সিলেক্ট করে নিচের ফর্মটি সাবমিট করুন। আমাদের টিম থেকে শীঘ্রই আপনাকে কল করা হবে ইনশাআল্লাহ! আপনি চাইলে দ্রুত রিপ্লাই পেতে ",
    whatsappLink: "WhatsApp",
    whatsappLinkSuffix: " এ মেসেজ দিতে পারেন!",
    studentName: "শিক্ষার্থীর নাম",
    guardianName: "অভিভাবকের নাম",
    phoneNumber: "ফোন নাম্বার",
    selectClass: "ক্লাস সিলেক্ট করুন",
    chooseClass: "ক্লাস বেছে নিন",
    contactPreference: "আপনার সঙ্গে কিভাবে যোগাযোগ করবো?",
    directCall: "ডিরেক্ট সিমে কল চাই",
    whatsappMsg: "WhatsApp এ মেসেজ চাই",
    yourMessage: "আপনার বার্তা (ঐচ্ছিক)",
    messagePlaceholder: "আপনার প্রশ্ন বা বিস্তারিত এখানে লিখুন...",
    submit: "সাবমিট করুন",
    searchCountry: "খুঁজুন...",
    whatsappTitle: "WhatsApp সম্পর্কে",
    whatsappDesc:
      "আপনি চাইলে দ্রুত রিপ্লাই পেতে WhatsApp এ মেসেজ দিতে পারেন! আমাদের সাপোর্ট টিম সবসময় আপনার সেবায় প্রস্তুত।",
    startChat: "চ্যাট শুরু করুন",
    replyNote: "সাধারণত ২৪ ঘন্টার মধ্যে উত্তর দেওয়া হয়।",
    ordinals: ["", "ম", "য়", "য়", "র্থ", "ম", "ষ্ঠ", "ম", "ম", "ম", "ম"],
    waText: "হ্যালো! চালাক চ্যাম্পস সম্পর্কে আমি আরও জানতে চাই।",
  },
} as const;

export default function ContactUsClient() {
  const { isBangla } = useLanguage();
  const t = isBangla ? translations.bn : translations.en;

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      studentName: "",
      guardianName: "",
      countryCode: "",
      phone: "",
      classLevel: "",
      message: "",
      contactMethod: "whatsapp",
    },
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Countries Data via local proxy (Fixes CORS issue)
  // useEffect(() => {
  //   fetch("/api/countries") // <-- CHANGED TO LOCAL PROXY
  //     .then((res) => res.json())
  //     .then((data) => {
  //       let countriesArray: any[] = [];

  //       if (Array.isArray(data)) {
  //         countriesArray = data;
  //       } else if (data && typeof data === "object") {
  //         countriesArray =
  //           data.data ||
  //           data.results ||
  //           data.countries ||
  //           data.items ||
  //           data.records ||
  //           [];
  //       }

  //       if (!Array.isArray(countriesArray) || countriesArray.length === 0) {
  //         console.error(
  //           "Could not extract countries array. API Response:",
  //           data,
  //         );
  //         return;
  //       }

  //       const mappedCountries: Country[] = countriesArray
  //         .map((country: any) => {
  //           const iddRoot = country.idd?.root || "";
  //           const iddSuffix = country.idd?.suffixes?.[0] || "";
  //           const v5Code = country.phoneCode || country.dialCode || "";
  //           const code = iddRoot ? `${iddRoot}${iddSuffix}` : v5Code;

  //           if (!code) return null;

  //           return {
  //             name: country.name?.common || country.name || "Unknown",
  //             flag:
  //               country.flags?.svg ||
  //               country.flags?.png ||
  //               country.flag ||
  //               country.flagUrl ||
  //               "",
  //             code: code,
  //             cca2: country.cca2 || country.iso2 || country.code || "",
  //           };
  //         })
  //         .filter((c): c is Country => c !== null && c.flag !== "");

  //       mappedCountries.sort((a: Country, b: Country) =>
  //         a.name.localeCompare(b.name),
  //       );
  //       setCountries(mappedCountries);

  //       const bangladesh = mappedCountries.find(
  //         (c: Country) => c.cca2 === "BD",
  //       );
  //       if (bangladesh) {
  //         setSelectedCountry(bangladesh);
  //         setValue("countryCode", bangladesh.code);
  //       } else if (mappedCountries.length > 0) {
  //         setSelectedCountry(mappedCountries[0]);
  //         setValue("countryCode", mappedCountries[0].code);
  //       }
  //     })
  //     .catch((err) => console.error("Failed to fetch countries", err));
  // }, [setValue]);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm),
  );

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

    const onSubmit = async (data: any) => {
      const fullPhoneNumber = `${data.countryCode}${data.phone}`;

      try {
        // Replace with your actual backend URL if not using a proxy
        const BACKEND_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

        const response = await fetch(`${BACKEND_URL}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            phone: fullPhoneNumber, // Send the combined phone number
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Something went wrong");
        }

        // Success logic here (e.g., show a success toast, reset form)
        alert(isBangla ? "সফলভাবে সাবমিট হয়েছে!" : "Submitted successfully!");

        // Optional: Reset form fields
        setValue("studentName", "");
        setValue("guardianName", "");
        setValue("phone", "");
        setValue("message", "");
      } catch (error: any) {
        console.error("Form Submission Error:", error);
        alert(error.message || "Failed to submit form. Please try again.");
      }
    };

  const waUrl = `https://wa.me/8801740176774?text=${encodeURIComponent(t.waText)}`;

  return (
    <section className="container mx-auto py-12 px-4">
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-[#00477C] pointer-events-none tracking-tight mb-4">
          {t.titlePrefix}{" "}
          <span className="relative inline-block px-3 py-3 group">
            <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="relative bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </span>
        </h1>
        <p className="text-[#2D2D2D] leading-relaxed text-base md:text-lg opacity-90">
          {t.description}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={waUrl}
            className="hover:text-primary font-bold"
          >
            {t.whatsappLink}
          </a>{" "}
          {t.whatsappLinkSuffix}
        </p>
      </section>

      <section className=" mx-auto grid grid-cols-1 gap-8">
        <div className="lg:col-span-2 ">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                  {t.studentName} <span className="text-primary">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 opacity-50 pointer-events-none text-gray-500">
                    <User size={18} />
                  </span>
                  <input
                    {...register("studentName", { required: true })}
                    type="text"
                    placeholder={t.studentName}
                    className="w-full pl-10 pr-4 py-3 placeholder:text-gray-500 text-[#020817] rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                  {t.guardianName} <span className="text-primary">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 opacity-50 pointer-events-none text-gray-500">
                    <User size={18} />
                  </span>
                  <input
                    {...register("guardianName", { required: true })}
                    type="text"
                    placeholder={t.guardianName}
                    className="w-full pl-10 pr-4 py-3 placeholder:text-gray-500 text-[#020817] rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                {t.phoneNumber} <span className="text-primary">*</span>
              </label>
              <div className="relative" ref={dropdownRef}>
                <div className="flex rounded-lg border focus-within:ring-2 focus-within:ring-primary transition-all">
                  <div className="relative w-full md:w-48 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full h-full flex items-center justify-between px-3 border-r bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 transition-colors rounded-l-lg"
                    >
                      <div className="flex items-center text-[#111827] gap-2">
                        <img
                          src={"/about/bdflag.webp"}
                          alt="flag"
                          className="w-6 h-4 object-cover rounded-sm"
                        />
                        <span className="text-sm font-medium whitespace-nowrap">
                         +880
                        </span>
                      </div>
                    </button>
                    {/* {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg max-h-80 overflow-y-auto z-50">
                        <div className="sticky top-0 bg-white dark:bg-gray-900 p-3 border-b border-gray-100 dark:border-gray-800 z-10">
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <Search size={14} className="text-gray-400" />
                            <input
                              type="text"
                              placeholder={t.searchCountry}
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
                    )} */}
                  </div>
                  <input
                    {...register("phone", { required: true })}
                    type="tel"
                    placeholder="1XXXXXXXXXX"
                    className="flex-1 px-4 placeholder:text-gray-500 text-[#111817] py-3 outline-none bg-transparent rounded-r-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                {t.selectClass} <span className="text-primary">*</span>
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
                    {t.chooseClass}
                  </option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {t.ordinals[num]}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 text-gray-500 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70 block">
                {t.contactPreference}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <span
                    className={`block text-sm font-semibold ${watch("contactMethod") === "call" ? "text-[#00477C]" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {t.directCall}
                  </span>
                </label>
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
                  <span
                    className={`block text-sm font-semibold ${watch("contactMethod") === "whatsapp" ? "text-green-600" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {t.whatsappMsg}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-[#111827] uppercase tracking-wider opacity-70">
                {t.yourMessage}
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 opacity-50 pointer-events-none">
                  <FileText size={18} />
                </span>
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder={t.messagePlaceholder}
                  className="w-full pl-10 pr-4 py-3 placeholder:text-gray-500 text-[#020817] rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="group mb-12 cursor-pointer w-full relative overflow-hidden rounded-lg bg-primary py-4 px-16 text-lg font-bold text-white transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,143,202,0.5)] active:scale-95"
              style={{ animation: "pulseScale 2.5s infinite ease-in-out" }}
            >
              <span
                className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent"
                style={{
                  transform: "translateX(-100%)",
                  animation: "shimmer 2.5s infinite ease-in-out",
                }}
              ></span>
              <span className="relative tracking-[-2%] px-24 z-10 text-white transition-transform duration-300 group-hover:translate-y-[-1px] flex items-center justify-center">
                {t.submit} <Check size={18} className="ms-2" />
              </span>
              <style
                dangerouslySetInnerHTML={{
                  __html: `@keyframes shimmer { 0% { transform: translateX(-100%) skewX(-45deg); } 40%, 100% { transform: translateX(150%) skewX(-45deg); } } @keyframes pulseScale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }`,
                }}
              />
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 border-2 border-[#25D366] rounded-xl p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg text-center h-full flex flex-col justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-[#25D366]" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              {t.whatsappTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {t.whatsappDesc}
            </p>
            <a target="_blank" rel="noopener noreferrer" href={waUrl}>
              <button
                type="button"
                className="w-full cursor-pointer bg-[#25D366] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle size={20} /> {t.startChat}
              </button>
            </a>
            <p className="text-xs text-gray-400 mt-4">{t.replyNote}</p>
          </div>
        </div>
      </section>
    </section>
  );
}
