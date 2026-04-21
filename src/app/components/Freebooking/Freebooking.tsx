"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { Phone, User, ChevronDown, Search } from "lucide-react"; // Added Search and ChevronDown
import Link from "next/link";
import Image from "next/image";

interface FreebookingProps {
  isOpen: boolean;
  onClose: () => void;
}

// Type for Country Data
interface Country {
  name: string;
  flag: string;
  code: string;
  cca2: string;
}

const Freebooking: React.FC<FreebookingProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const phoneNumber = "01740176774";
  const message = encodeURIComponent(
    "Hello, I have a question about your service.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  // 1. Form State
  const [formData, setFormData] = useState({
    studentName: "",
    guardianName: "",
    phone: "",
    studentClass: "",
    course: "",
  });

  // 2. Country Code State
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Fetch Countries on Mount & Set Default to Bangladesh
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2")
      .then((res) => res.json())
      .then((data) => {
        const processed: Country[] = data
          .map((country: { name: { common: string }; flags: { svg: string }; idd?: { root: string; suffixes?: string[] }; cca2: string }) => {
            const root = country.idd?.root || "";
            const suffix = country.idd?.suffixes?.[0] || "";
            return {
              name: country.name.common,
              flag: country.flags.svg,
              code: root + suffix,
              cca2: country.cca2,
            };
          })
          .filter((c: Country) => c.code.length > 0)
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(processed);

        // Set Default to Bangladesh
        const bd = processed.find((c: Country) => c.cca2 === "BD");
        setSelectedCountry(bd || processed[0]);
      })
      .catch((err) => console.error("Failed to fetch countries", err));
  }, []);

  // 4. Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 5. Validation
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== "",
  );

  // Close modal logic
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      setIsDropdownOpen(false); // Close dropdown when clicking modal backdrop
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && selectedCountry) {
      const fullPhone = `${selectedCountry.code} ${formData.phone}`;
      console.log("Form Submitted:", { ...formData, fullPhone });
      alert(`Submitted with Phone: ${fullPhone}`);
      onClose();
      setFormData({
        studentName: "",
        guardianName: "",
        phone: "",
        studentClass: "",
        course: "",
      });
    }
  };

  // Filter countries
  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.includes(searchTerm),
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop Blur (Keeping your exact design) */}
      <div className="absolute inset-0 bg-[#490023]/15 backdrop-blur-sm transition-opacity" />

      {/* Modal Content (Keeping your exact design) */}
      <div
        className="relative w-full max-w-md rounded-2xl border-2 border-primary shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200"
        style={{
          backgroundColor: "var(--color-card)",
          border: `1px solid var(--color-border)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute bottom-0 -right-14">
          <Image
            src={"/liveicon.webp"}
            width={120}
            height={120}
            alt="live Icon"
          />
        </div>
        <div className="absolute top-12 -left-8">
          <Image
            src={"/bellicon.webp"}
            width={60}
            height={80}
            alt="live Icon"
          />
        </div>
        {/* Header / Close Button */}
        <div className="flex text-primary justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-1 text-primary">
              ফ্রি ডেমো ক্লাস বুক করতে রেজিস্ট্রেশন করো
            </h2>
          </div>
          <div className=" bg-radial from-[#FF8FCA] to-[#D9D9D9] p-px">
            <button
              onClick={() => {
                onClose();
                setIsDropdownOpen(false);
              }}
              className="p-1 absolute  -top-4 -right-4 bg-[#FF8FCA]/70 rounded-full  dark:hover:bg-white/10 transition-colors"
              style={{ color: "var(--color-foreground)" }}
            >
              <svg
                width="28"
                height="29"
                viewBox="0 0 28 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_462_31722)">
                  <path
                    d="M20.0918 7.51514L7.48448 20.5151"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M7.87695 7.51514L20.4843 20.5151"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_462_31722"
                    x="0"
                    y="0"
                    width="27.9688"
                    height="28.0303"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="3.25" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.129412 0 0 0 0 0.254902 0 0 0 0 0.529412 0 0 0 0.4 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_462_31722"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_462_31722"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            {/* Name Input */}
            <div className="space-y-1">
              <label
                className="text-xs font-semibold uppercase tracking-wider opacity-70"
                style={{ color: "var(--color-foreground)" }}
              >
                শিক্ষার্থীর নাম <span className="text-primary">*</span>
              </label>

              <div className="relative flex items-center">
                <span
                  className="absolute left-3 opacity-50"
                  style={{ color: "var(--color-foreground)" }}
                >
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                />
              </div>
            </div>

            {/* Family Name Input */}
            <div className="space-y-1">
              <label
                className="text-xs font-semibold uppercase tracking-wider opacity-70"
                style={{ color: "var(--color-foreground)" }}
              >
                শিক্ষার্থীর অভিভাবকের নাম{" "}
                <span className="text-primary">*</span>
              </label>

              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Phone Input (With API & Search) */}
          <div className="space-y-1">
            <label
              className="text-xs font-semibold uppercase tracking-wider opacity-70"
              style={{ color: "var(--color-foreground)" }}
            >
              ফোন নাম্বার <span className="text-primary">*</span>
            </label>

            <div
              className="flex rounded-lg border focus-within:ring-2 focus-within:ring-[var(--color-primary)] transition-all"
              style={{ borderColor: "var(--color-border)" }}
            >
              {/* Country Selector Wrapper */}
              <div className="relative w-32 md:w-40 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-full flex items-center justify-between px-2 border-r transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-background)",
                    borderTopLeftRadius: "0.5rem", // Add radius to left side
                    borderBottomLeftRadius: "0.5rem",
                  }}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {selectedCountry && (
                      <img
                        src={selectedCountry.flag}
                        alt="flag"
                        className="w-5 h-4 object-cover rounded-sm"
                      />
                    )}
                    <span
                      className="text-sm font-medium whitespace-nowrap"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {selectedCountry?.code}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-gray-500 ml-1" />
                </button>

                {/* Dropdown List */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto z-50">
                    {/* Search Input */}
                    <div className="sticky top-0 bg-white dark:bg-gray-900 p-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <Search size={12} className="text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          className="bg-transparent border-none outline-none text-xs w-full text-gray-800 dark:text-gray-200"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Country List */}
                    {filteredCountries.map((country) => (
                      <button
                        type="button"
                        key={country.cca2}
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsDropdownOpen(false);
                          setSearchTerm("");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
                      >
                        <img
                          src={country.flag}
                          alt="flag"
                          className="w-5 h-4 object-cover rounded-sm"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {country.name}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {country.code}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Number Input */}
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=""
                className="flex-1 px-4 py-2.5 outline-none bg-transparent rounded-r-lg" // Added rounded-r-lg for right side corners
                style={{ color: "var(--color-foreground)" }}
              />
            </div>
          </div>

          {/* Class Select */}
          <div className="space-y-1">
            <label
              className="text-xs font-semibold uppercase tracking-wider opacity-70"
              style={{ color: "var(--color-foreground)" }}
            >
              শিক্ষার্থীর ক্লাস
            </label>
            <select
              name="studentClass"
              value={formData.studentClass}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all"
              style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            >
              <option value="">ক্লাস সিলেক্ট করুন</option>
              <option value="playgroup">Playgroup</option>
              <option value="nursery">Nursery</option>
              <option value="kg">KG</option>
              <option value="class1">Class 1</option>
              <option value="class2">Class 2</option>
              <option value="class3">Class 3</option>
              <option value="class4">Class 4</option>
              <option value="class5">Class 5</option>
              <option value="class6">Class 6</option>
              <option value="class7">Class 7</option>
              <option value="class8">Class 8</option>
              <option value="class9">Class 9</option>
              <option value="class10">Class 10</option>
            </select>
          </div>

          {/* Course Select */}
          <div className="space-y-1">
            <label
              className="text-xs font-semibold uppercase tracking-wider opacity-70"
              style={{ color: "var(--color-foreground)" }}
            >
              শিক্ষার্থী কোন কোর্সটি করতে আগ্রহী
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all"
              style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            >
              <option className="text-gray-500" value="">
                পছন্দের কোর্স সিলেক্ট করো
              </option>
              <option value="playgroup">Playgroup</option>
              <option value="nursery">Nursery</option>
              <option value="kg">KG</option>
              <option value="class1">Class 1</option>
              <option value="class2">Class 2</option>
              <option value="class3">Class 3</option>
              <option value="class4">Class 4</option>
              <option value="class5">Class 5</option>
              <option value="class6">Class 6</option>
              <option value="class7">Class 7</option>
              <option value="class8">Class 8</option>
              <option value="class9">Class 9</option>
              <option value="class10">Class 10</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-lg shadow-lg transform active:scale-[0.98] transition-all ${
              isFormValid
                ? "hover:shadow-xl bg-[var(--color-primary)] cursor-pointer"
                : "bg-gray-400 opacity-50 cursor-not-allowed"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            সাবমিট করো
          </button>
        </form>

        <div className="flex flex-col items-center mt-6">
          <p className="text-sm md:text-base text-gray-600 text-center">
            আমাদের কল করে ডেমো ক্লাস বুক করুন এখনই (24/7)
          </p>
          <button
            onClick={() => window.open(whatsappUrl, "_blank")}
            className="mt-2 bg-gray-500 text-white py-2 px-6 rounded-lg transition-colors hover:bg-gray-600 cursor-pointer flex items-center gap-2 font-medium"
          >
            <Phone size={18} />
            +88 01740176774
          </button>
        </div>
      </div>
    </div>
  );
};

export default Freebooking;
