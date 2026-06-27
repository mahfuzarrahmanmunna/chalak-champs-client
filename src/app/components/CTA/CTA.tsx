"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import BirdIcon from "./BirdIcon";
import NeedCall from "./NeedCall";
import { useLanguage } from "@/app/context/LanguageContext";

// Types
interface Country {
  name: string;
  flag: string;
  code: string;
  cca2: string;
}

// --- FIXED: Static Data to replace unstable API ---
const STATIC_COUNTRIES: Country[] = [
  {
    name: "Bangladesh",
    flag: "https://flagcdn.com/bd.svg",
    code: "+880",
    cca2: "BD",
  },
  {
    name: "United States",
    flag: "https://flagcdn.com/us.svg",
    code: "+1",
    cca2: "US",
  },
  {
    name: "United Kingdom",
    flag: "https://flagcdn.com/gb.svg",
    code: "+44",
    cca2: "GB",
  },
  {
    name: "Canada",
    flag: "https://flagcdn.com/ca.svg",
    code: "+1",
    cca2: "CA",
  },
  {
    name: "Australia",
    flag: "https://flagcdn.com/au.svg",
    code: "+61",
    cca2: "AU",
  },
  {
    name: "India",
    flag: "https://flagcdn.com/in.svg",
    code: "+91",
    cca2: "IN",
  },
  {
    name: "Pakistan",
    flag: "https://flagcdn.com/pk.svg",
    code: "+92",
    cca2: "PK",
  },
  {
    name: "Saudi Arabia",
    flag: "https://flagcdn.com/sa.svg",
    code: "+966",
    cca2: "SA",
  },
  {
    name: "United Arab Emirates",
    flag: "https://flagcdn.com/ae.svg",
    code: "+971",
    cca2: "AE",
  },
  {
    name: "Malaysia",
    flag: "https://flagcdn.com/my.svg",
    code: "+60",
    cca2: "MY",
  },
  {
    name: "Singapore",
    flag: "https://flagcdn.com/sg.svg",
    code: "+65",
    cca2: "SG",
  },
  {
    name: "Germany",
    flag: "https://flagcdn.com/de.svg",
    code: "+49",
    cca2: "DE",
  },
  {
    name: "France",
    flag: "https://flagcdn.com/fr.svg",
    code: "+33",
    cca2: "FR",
  },
  {
    name: "Italy",
    flag: "https://flagcdn.com/it.svg",
    code: "+39",
    cca2: "IT",
  },
  {
    name: "Spain",
    flag: "https://flagcdn.com/es.svg",
    code: "+34",
    cca2: "ES",
  },
  {
    name: "Japan",
    flag: "https://flagcdn.com/jp.svg",
    code: "+81",
    cca2: "JP",
  },
  {
    name: "China",
    flag: "https://flagcdn.com/cn.svg",
    code: "+86",
    cca2: "CN",
  },
  {
    name: "South Korea",
    flag: "https://flagcdn.com/kr.svg",
    code: "+82",
    cca2: "KR",
  },
  {
    name: "Nepal",
    flag: "https://flagcdn.com/np.svg",
    code: "+977",
    cca2: "NP",
  },
  {
    name: "Sri Lanka",
    flag: "https://flagcdn.com/lk.svg",
    code: "+94",
    cca2: "LK",
  },
  {
    name: "Oman",
    flag: "https://flagcdn.com/om.svg",
    code: "+968",
    cca2: "OM",
  },
  {
    name: "Qatar",
    flag: "https://flagcdn.com/qa.svg",
    code: "+974",
    cca2: "QA",
  },
  {
    name: "Kuwait",
    flag: "https://flagcdn.com/kw.svg",
    code: "+965",
    cca2: "KW",
  },
  {
    name: "Bahrain",
    flag: "https://flagcdn.com/bh.svg",
    code: "+973",
    cca2: "BH",
  },
  {
    name: "Turkey",
    flag: "https://flagcdn.com/tr.svg",
    code: "+90",
    cca2: "TR",
  },
  { name: "Iran", flag: "https://flagcdn.com/ir.svg", code: "+98", cca2: "IR" },
  {
    name: "Thailand",
    flag: "https://flagcdn.com/th.svg",
    code: "+66",
    cca2: "TH",
  },
  {
    name: "Indonesia",
    flag: "https://flagcdn.com/id.svg",
    code: "+62",
    cca2: "ID",
  },
  {
    name: "Vietnam",
    flag: "https://flagcdn.com/vn.svg",
    code: "+84",
    cca2: "VN",
  },
  {
    name: "Philippines",
    flag: "https://flagcdn.com/ph.svg",
    code: "+63",
    cca2: "PH",
  },
  {
    name: "Russia",
    flag: "https://flagcdn.com/ru.svg",
    code: "+7",
    cca2: "RU",
  },
  {
    name: "Brazil",
    flag: "https://flagcdn.com/br.svg",
    code: "+55",
    cca2: "BR",
  },
  {
    name: "South Africa",
    flag: "https://flagcdn.com/za.svg",
    code: "+27",
    cca2: "ZA",
  },
  {
    name: "Nigeria",
    flag: "https://flagcdn.com/ng.svg",
    code: "+234",
    cca2: "NG",
  },
  {
    name: "Egypt",
    flag: "https://flagcdn.com/eg.svg",
    code: "+20",
    cca2: "EG",
  },
  {
    name: "Mexico",
    flag: "https://flagcdn.com/mx.svg",
    code: "+52",
    cca2: "MX",
  },
  {
    name: "Sweden",
    flag: "https://flagcdn.com/se.svg",
    code: "+46",
    cca2: "SE",
  },
  {
    name: "Norway",
    flag: "https://flagcdn.com/no.svg",
    code: "+47",
    cca2: "NO",
  },
  {
    name: "Denmark",
    flag: "https://flagcdn.com/dk.svg",
    code: "+45",
    cca2: "DK",
  },
  {
    name: "Netherlands",
    flag: "https://flagcdn.com/nl.svg",
    code: "+31",
    cca2: "NL",
  },
  {
    name: "Belgium",
    flag: "https://flagcdn.com/be.svg",
    code: "+32",
    cca2: "BE",
  },
  {
    name: "Switzerland",
    flag: "https://flagcdn.com/ch.svg",
    code: "+41",
    cca2: "CH",
  },
  {
    name: "Ireland",
    flag: "https://flagcdn.com/ie.svg",
    code: "+353",
    cca2: "IE",
  },
  {
    name: "New Zealand",
    flag: "https://flagcdn.com/nz.svg",
    code: "+64",
    cca2: "NZ",
  },
  {
    name: "Greece",
    flag: "https://flagcdn.com/gr.svg",
    code: "+30",
    cca2: "GR",
  },
  {
    name: "Portugal",
    flag: "https://flagcdn.com/pt.svg",
    code: "+351",
    cca2: "PT",
  },
  {
    name: "Poland",
    flag: "https://flagcdn.com/pl.svg",
    code: "+48",
    cca2: "PL",
  },
  {
    name: "Ukraine",
    flag: "https://flagcdn.com/ua.svg",
    code: "+380",
    cca2: "UA",
  },
  {
    name: "Argentina",
    flag: "https://flagcdn.com/ar.svg",
    code: "+54",
    cca2: "AR",
  },
  {
    name: "Israel",
    flag: "https://flagcdn.com/il.svg",
    code: "+972",
    cca2: "IL",
  },
];

const CTA = () => {
  // 1. Get data from context
  const { ctaData } = useLanguage();

  // --- Form State ---
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    phone: "",
    class: "",
  });

  // --- Loading State ---
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- Phone & Country State ---
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Initialize Countries (Static Data) ---
  useEffect(() => {
    // Using static data ensures no network errors occur
    const sortedCountries = [...STATIC_COUNTRIES].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    setCountries(sortedCountries);

    // Set Default to Bangladesh
    const bd = sortedCountries.find((c: Country) => c.cca2 === "BD");
    setSelectedCountry(bd || sortedCountries[0]);
  }, []);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- UPDATED HANDLER WITH BACKEND LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation check
    if (!selectedCountry || !formData.phone.trim()) {
      alert("Please select a country and enter a valid phone number.");
      return;
    }

    // 2. Prepare Data
    const payload = {
      studentName: formData.studentName,
      fatherName: formData.fatherName,
      phone: formData.phone,
      class: formData.class,
      country: selectedCountry, // Sending the object so backend gets the code
    };

    // 3. Set Loading State
    setLoading(true);

    try {
      // 4. Send to Backend
      const response = await fetch("/api/cta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // 5. Success Action
        alert("Form Submitted Successfully! We will contact you soon.");

        // Reset form
        setFormData({
          studentName: "",
          fatherName: "",
          phone: "",
          class: "",
        });
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error. Please try again.");
    } finally {
      // 6. Reset Loading State
      setLoading(false);
    }
  };

  // --- Validation Logic ---
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== "",
  );

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.includes(searchTerm),
  );

  return (
    <div className="container mx-auto py-10">
      {/* MAIN SHELL (Your Pink Gradient Wrapper) */}
      <div className="w-full bg-linear-to-b from-[#F3066E] to-[#FF8FCA] rounded-4xl p-0.5 ">
        <div className="bg-[#F3066E] relative  md:p-16 md:space-y-0 space-y-6 p-4 rounded-[30px] md:flex gap-12 justify-between items-center">
          {/* REAL FORM COMPONENT (White Card) */}
          <div className="relative text-black md:w-140">
            <div className="absolute -top-24.5 -rotate-2 right-16">
              <BirdIcon />
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:max-w-100 bg-white h-full rounded-3xl p-6 text-sm "
            >
              <h4 className="text-xl font-semibold text-[#F3066E] leading-6">
                {ctaData.form.title}
              </h4>

              {/* Student Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold  text-gray-700">
                  {ctaData.form.studentName}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="studentName"
                    required
                    value={formData.studentName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-2.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F3066E] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Father's Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold  text-gray-700">
                  {ctaData.form.fatherName}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fatherName"
                    required
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-2.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F3066E] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number with Flag */}
              <div className="space-y-2">
                <label className="text-sm font-semibold pb-2 text-gray-700">
                  {ctaData.form.phone} <span className="text-red-500">*</span>
                </label>

                <div className="flex rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#F3066E] focus-within:border-transparent transition-all relative z-0">
                  {/* Country Selector */}
                  <div className="relative w-20 active:rounded-2xl hover:rounded-2xl rounded-2xl shrink-0 bg-white z-10">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-20 h-full flex items-center justify-between px-3 hover:bg-gray-50 hover:rounded-2xl transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {selectedCountry && (
                          <img
                            src={selectedCountry.flag}
                            alt="flag"
                            className="w-5 h-4 object-cover rounded-sm"
                          />
                        )}
                        <span className="text-sm font-semibold text-gray-700">
                          {selectedCountry?.code}
                        </span>
                      </div>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {/* Dropdown - Ensure z-index is high */}
                    {isDropdownOpen && (
                      <div className="absolute bottom-full   left-0 w-50 mt-1 bg-white shadow-xl border border-gray-100 rounded-xl max-h-60 overflow-y-auto z-50">
                        {/* Search Bar */}
                        <div className="sticky top-0 bg-white p-2 border-b border-gray-100 z-10">
                          <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-md">
                            <Search size={12} className="text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search country..."
                              className="bg-transparent border-none outline-none text-xs w-full"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="z-100">
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
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left transition-colors"
                            >
                              <img
                                src={country.flag}
                                alt="flag"
                                className="w-5 h-4 object-cover rounded-sm"
                              />
                              <span className="text-xs font-medium text-gray-700">
                                {country.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full py-3 bg-transparent outline-none px-2"
                    placeholder="1XXXXXXXXXX"
                  />
                </div>
              </div>

              {/* Class */}
              <div className="space-y-2 z-0">
                <label className="text-sm  font-semibold pb-2 text-gray-700">
                  {ctaData.form.class} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="class"
                    required
                    value={formData.class}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F3066E] focus:outline-none transition-all appearance-none"
                  >
                    <option value="">ক্লাস নির্বাচন করো</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full font-bold text-lg leading-7.5 py-2.25  rounded-xl  transform active:scale-[0.98] transition-all duration-300 ${
                  isFormValid && !loading
                    ? "bg-[#F3056D] text-white cursor-pointer shadow-[inset_0px_1.5px_0px_#FF8FCA,inset_0px_1.5px_1.5px_rgba(243,6,110,0.3),inset_0px_0px_0px_1.5px_#C6005F,inset_0px_3.01px_7.52px_0px_rgba(243,6,110,0.3)] "
                    : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-[inset_0px_1.5px_0px_#D9D9D9,inset_0px_1.5px_1.5px_rgba(217,217,217,0.3),inset_0px_0px_1.5px_#D9D9D9,inset_0px_3.01px_7.52px_rgba(217,217,217,0.3)]"
                }`}
              >
                {loading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  ctaData.form.cta
                )}
              </button>
            </form>
          </div>
          {/* right side content */}
          <NeedCall />

          <div className="absolute bottom-0 right-0 -z-1 opacity-50 md:opacity-100">
            <Image
              src={"/maskgroup.webp"}
              width={500}
              height={500}
              alt="group bird"
            />{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
