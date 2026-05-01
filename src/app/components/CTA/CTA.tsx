"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import Button from "@/app/ui/button/Button";
import BirdIcon from "./BirdIcon";
import SpotlightWrapper from "../SpotlightWrapper/SpotlightWrapper";
import NeedCall from "./NeedCall";

// Types
interface Country {
  name: string;
  flag: string;
  code: string;
  cca2: string;
}

const CTA = () => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    phone: "",
    class: "", // Updated to match your HTML
    course: "", // Updated to match your HTML
  });

  // --- Phone & Country State ---
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Fetch Countries (Bangladesh Default) ---
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2")
      .then((res) => res.json())
      .then((data) => {
        const processed: Country[] = data
          .map((country: any) => {
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
        const bd = processed.find((c: Country) => c.cca2 === "BD");
        setSelectedCountry(bd || processed[0]);
      })
      .catch((err) => console.error("Failed to fetch countries", err));
  }, []);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry) {
      const fullPhone = `${selectedCountry.code} ${formData.phone}`;
      console.log("Form Submitted:", { ...formData, fullPhone });
      alert("Form Submitted Successfully!");
      // Reset form if needed
      setFormData({
        studentName: "",
        fatherName: "",
        phone: "",
        class: "",
        course: "",
      });
    }
  };

  // --- Validation Logic ---
  // Checks if every field in formData is not empty
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
        <div className="bg-[#F3066E] relative  md:p-16 md:space-y-0 space-y-6 p-4 rounded-[30px] md:flex justify-between items-center">
          {/* REAL FORM COMPONENT (White Card) */}
          <div className="relative text-black md:w-120">
            <div className="absolute -top-24.5 -rotate-2 right-16">
              <BirdIcon />
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:max-w-100 bg-white h-full rounded-3xl p-6 text-sm "
            >
              <h4 className="text-xl font-semibold text-[#F3066E] leading-6">
                ফ্রি ডেমো ক্লাস বুক করতে রেজিস্ট্রেশন করো
              </h4>

              {/* Student Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold  text-gray-700">
                  শিক্ষার্থীর নাম <span className="text-red-500">*</span>
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
                  শিক্ষার্থীর অভিভাবকের নাম{" "}
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
                  ফোন নাম্বার <span className="text-red-500">*</span>
                </label>

                {/* REMOVED 'overflow-hidden' from here */}
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
                  {/* Added 'pl-2' for spacing and removed rounded-tl/bl-xl because the flag has them */}
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
                  শিক্ষার্থীর ক্লাস <span className="text-red-500">*</span>
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

              {/* Course */}
              <div className="space-y-2">
                <label className="text-sm font-semibold pb-2 text-gray-700">
                  শিক্ষার্থী কোন কোর্সটি করতে আগ্রহী{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="course"
                    required
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F3066E] focus:outline-none transition-all appearance-none"
                  >
                    <option value="">পছন্দের কোর্স সিলেক্ট করো</option>
                    <option value="english">English for kids</option>
                    <option value="spoken">Spoken English</option>
                    <option value="writing">Creative Writing</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full font-bold text-lg leading-7.5 py-2.25  rounded-xl  transform active:scale-[0.98] transition-all duration-300 ${
                  isFormValid
                    ? "bg-[#F3056D] text-white cursor-pointer shadow-[inset_0px_1.5px_0px_#FF8FCA,inset_0px_1.5px_1.5px_rgba(243,6,110,0.3),inset_0px_0px_0px_1.5px_#C6005F,inset_0px_3.01px_7.52px_0px_rgba(243,6,110,0.3)] "
                    : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-[inset_0px_1.5px_0px_#D9D9D9,inset_0px_1.5px_1.5px_rgba(217,217,217,0.3),inset_0px_0px_1.5px_#D9D9D9,inset_0px_3.01px_7.52px_rgba(217,217,217,0.3)]"
                }`}
              >
                সাবমিট করো
              </button>
            </form>
          </div>
          {/* right side content */}
         <NeedCall/>

          <div className="absolute bottom-0 right-0 z-0 opacity-50 md:opacity-100">
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
