"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  ChevronDown,
  Search,
  Building,
  Map,
} from "lucide-react";
import BackSpace from "../components/Icon/BackSpace";
import Button from "../ui/button/Button";
import { useCurrentPath } from "../hooks/useCurrentPath";
import Link from "next/link";
import CTA from "../components/CTA/CTA";

// Country Interface
interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

// Form Inputs Interface
interface ContactFormInputs {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  city: string;
  address: string;
  preferredLanguage: string;
  inquiryType: string;
  subject: string;
  message: string;
}

// Validation Schema
const contactSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .min(8, "Phone number is too short"),
  companyName: yup.string().required("Company name is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  preferredLanguage: yup.string().required("Please select a language"),
  inquiryType: yup.string().required("Please select an inquiry type"),
  subject: yup.string().required("Subject is required"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .test(
      "is-not-empty",
      "Message cannot be empty",
      (value) => !!value && value.trim().length > 0,
    ),
});

// Contact Info Card Component
const ContactCard = ({
  icon,
  title,
  content,
  subContent,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  subContent?: string;
}) => {
  const { colors } = useTheme();
  return (
    <div
      className="p-6 rounded-xl border flex items-start gap-4 transition-shadow hover:shadow-lg"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ backgroundColor: colors.primary, color: "white" }}
      >
        {icon}
      </div>
      <div>
        <h3
          className="text-lg font-semibold mb-1"
          style={{ color: colors.foreground }}
        >
          {title}
        </h3>
        <p
          className="text-sm"
          style={{ color: colors.foreground, opacity: 0.8 }}
        >
          {content}
        </p>
        {subContent && (
          <p className="text-xs mt-1" style={{ color: colors.muted }}>
            {subContent}
          </p>
        )}
      </div>
    </div>
  );
};

export default function ContactUsClient() {
  const { colors } = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Country Logic
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use Custom Hook
  const pathname = useCurrentPath();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2",
        );
        const data = await response.json();
        const formattedCountries: Country[] = data
          .map(
            (country: {
              idd: { root: string; suffixes?: string[] };
              name: { common: string };
              cca2: string;
              flags: { svg?: string; png?: string };
            }) => {
              let dialCode = "";
              if (country.idd && country.idd.root) {
                dialCode = country.idd.root;
                if (country.idd.suffixes && country.idd.suffixes.length > 0)
                  dialCode += country.idd.suffixes[0];
              }
              return {
                name: country.name.common,
                code: country.cca2,
                dial_code: dialCode,
                flag: country.flags.svg || country.flags.png,
              };
            },
          )
          .filter((c: Country) => c.dial_code)
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(formattedCountries);
        const bd = formattedCountries.find((c) => c.code === "BD");
        if (bd) setSelectedCountry(bd);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      city: "",
      address: "",
      preferredLanguage: "",
      inquiryType: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    const fullPhoneNumber = selectedCountry
      ? `${selectedCountry.dial_code}${data.phone}`
      : data.phone;
    const finalData = { ...data, phone: fullPhoneNumber };

    try {
      const response = await fetch(
        "http://localhost:5000/api/contact/submit-sheet",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        },
      );

      if (!response.ok) throw new Error("Network response was not ok");

      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const inputStyle = (hasError: boolean) => ({
    backgroundColor: colors.background,
    borderColor: hasError ? colors.destructive : colors.border,
    color: colors.foreground,
  });

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial_code.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <section className="relative w-full min-h-[60vh] overflow-hidden">
        {/* --- BACKGROUND MAP LAYER --- */}
        <div className="absolute inset-0 z-0">
          {/* Google Maps Iframe */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.4130676384407!2d90.39479788263974!3d23.874967028785555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7e2811c6fa9%3A0x26e930dd6cd19c39!2sLingual%20Academy!5e0!3m2!1sen!2sus!4v1776978476223!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, height: "100%" }}
            // allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {/* Overlay: Ensures text readability */}
          {/* FIX: Changed inset-100 to inset-0 to cover the full map */}
          {/* <div className="absolute "></div> */}
        </div>

        {/* --- CONTENT LAYER --- */}
        <div className="relative z-10 px-6 max-w-7xl mx-auto min-h-[60vh] flex flex-col justify-center py-20 md:py-0">
          {/* Back Button Area */}
          <div className="mb-8 flex items-center gap-4 text-sm animate-fade-in-up">
            {/* Back Button */}
            <Link
              href="/"
              className="group flex items-center gap-2 font-medium text-gray-600 hover:text-black transition-colors duration-200"
            >
              <div className="p-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/20 group-hover:bg-white group-hover:shadow-md transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="bg-white/40 px-2 py-1 rounded backdrop-blur-sm">
                Back
              </span>
            </Link>

            {/* Vertical Divider */}
            <div className="h-4 w-[1px] bg-gray-400 mx-1"></div>

            {/* Pathname Display */}
            <nav aria-label="Breadcrumb">
              <span className="flex items-center">
                <span className="text-xs font-bold tracking-widest uppercase text-white bg-pink-500/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-pink-400/50">
                  {pathname.replace("/", "") || "Home"}
                </span>
              </span>
            </nav>
          </div>

          {/* Main Content */}
          <div className="text-center">
            <h1 className="text-4xl md:text-7xl font-bold text-secondary flex flex-wrap items-center justify-center gap-4 drop-shadow-sm tracking-tight">
              <span>Let&apos;s Get In</span>

              {/* Frosted Glass Container for "Touch" */}
              <div className="relative px-6 py-2 mt-2 md:mt-0">
                {/* Dashed Border Overlay */}
                <span className="absolute inset-0 border-2 border-dashed border-pink-600 pointer-events-none rounded-lg"></span>

                {/* Corner Dots */}
                <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-pink-700 rounded-full shadow-sm"></span>
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-pink-700 rounded-full shadow-sm"></span>
                <span className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-pink-700 rounded-full shadow-sm"></span>
                <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-pink-700 rounded-full shadow-sm"></span>

                {/* Gradient Text */}
                <span className="relative bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                  Touch
                </span>
              </div>
            </h1>

            {/* Optional Description */}
            <p className="mt-6 text-lg text-gray-700 max-w-2xl leading-relaxed mx-auto font-medium drop-shadow-sm bg-white/30 backdrop-blur-sm p-4 rounded-xl border border-white/40 inline-block">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <CTA />
      </section>
    </div>
  );
}
