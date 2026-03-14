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

// Country Interface
interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

// Form Inputs Interface - Added new fields
interface ContactFormInputs {
  fullName: string;
  email: string;
  phone: string;
  companyName: string; // NEW
  city: string; // NEW
  address: string; // NEW
  preferredLanguage: string;
  inquiryType: string;
  subject: string;
  message: string;
}

// Validation Schema - Added new fields
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
    .min(10, "Message must be at least 10 characters"),
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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2",
        );
        const data = await response.json();
        const formattedCountries: Country[] = data
          .map((country: any) => {
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
          })
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
      // CALLING THE NEW BACKEND ROUTE
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
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Contact Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-90"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get In Touch With Us
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Have questions about our courses or need assistance? Our team is
            ready to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Info */}
            <div className="lg:col-span-1 space-y-6">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: colors.foreground }}
              >
                Contact Information
              </h2>
              <ContactCard
                icon={<Phone className="h-6 w-6" />}
                title="Phone"
                content="+880 1700-000000"
                subContent="Sun-Thu 9am to 6pm"
              />
              <ContactCard
                icon={<Mail className="h-6 w-6" />}
                title="Email"
                content="support@chalakchamps.com"
                subContent="We reply within 24 hours"
              />
              <ContactCard
                icon={<MapPin className="h-6 w-6" />}
                title="Head Office"
                content="House 12, Road 5, Dhanmondi"
                subContent="Dhaka, Bangladesh"
              />
            </div>

            {/* Right Form */}
            <div className="lg:col-span-2">
              <div
                className="p-8 rounded-2xl shadow-lg border"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare
                    className="h-6 w-6"
                    style={{ color: colors.primary }}
                  />
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: colors.foreground }}
                  >
                    Send us a Message
                  </h2>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle
                      className="h-16 w-16 mx-auto mb-4"
                      style={{ color: colors.success || "#10b981" }}
                    />
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: colors.foreground }}
                    >
                      Message Sent Successfully!
                    </h3>
                    <p style={{ color: colors.muted }}>
                      We have sent a confirmation email to you.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Row 1: Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.foreground }}
                        >
                          Full Name{" "}
                          <span style={{ color: colors.primary }}>*</span>
                        </label>
                        <input
                          type="text"
                          {...register("fullName")}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                          style={inputStyle(!!errors.fullName)}
                        />
                        {errors.fullName && (
                          <p
                            className="mt-1 text-sm"
                            style={{ color: colors.destructive }}
                          >
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.foreground }}
                        >
                          Email Address{" "}
                          <span style={{ color: colors.primary }}>*</span>
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                          style={inputStyle(!!errors.email)}
                        />
                        {errors.email && (
                          <p
                            className="mt-1 text-sm"
                            style={{ color: colors.destructive }}
                          >
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Company & City (NEW) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.foreground }}
                        >
                          Company Name{" "}
                          <span style={{ color: colors.primary }}>*</span>
                        </label>
                        <div className="relative">
                          <Building
                            className="absolute left-3 top-3.5 h-5 w-5 opacity-50"
                            style={{ color: colors.muted }}
                          />
                          <input
                            type="text"
                            {...register("companyName")}
                            placeholder="e.g. Acme Corp"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                            style={inputStyle(!!errors.companyName)}
                          />
                        </div>
                        {errors.companyName && (
                          <p
                            className="mt-1 text-sm"
                            style={{ color: colors.destructive }}
                          >
                            {errors.companyName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.foreground }}
                        >
                          City <span style={{ color: colors.primary }}>*</span>
                        </label>
                        <input
                          type="text"
                          {...register("city")}
                          placeholder="Dhaka"
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                          style={inputStyle(!!errors.city)}
                        />
                        {errors.city && (
                          <p
                            className="mt-1 text-sm"
                            style={{ color: colors.destructive }}
                          >
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2.5: Address (NEW) */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: colors.foreground }}
                      >
                        Address <span style={{ color: colors.primary }}>*</span>
                      </label>
                      <div className="relative">
                        <Map
                          className="absolute left-3 top-3.5 h-5 w-5 opacity-50"
                          style={{ color: colors.muted }}
                        />
                        <input
                          type="text"
                          {...register("address")}
                          placeholder="House 12, Road 5..."
                          className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                          style={inputStyle(!!errors.address)}
                        />
                      </div>
                      {errors.address && (
                        <p
                          className="mt-1 text-sm"
                          style={{ color: colors.destructive }}
                        >
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    {/* Row 3: Phone & Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.foreground }}
                        >
                          Phone Number{" "}
                          <span style={{ color: colors.primary }}>*</span>
                        </label>
                        <div className="flex">
                          <div
                            ref={dropdownRef}
                            className="relative"
                            style={{ width: "130px" }}
                          >
                            <button
                              type="button"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className="flex items-center justify-between w-full h-full px-2 py-3 rounded-l-lg border-r-0 border focus:outline-none focus:ring-2"
                              style={{
                                backgroundColor: colors.background,
                                borderColor: errors.phone
                                  ? colors.destructive
                                  : colors.border,
                                color: colors.foreground,
                              }}
                            >
                              {selectedCountry ? (
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <img
                                    src={selectedCountry.flag}
                                    alt={selectedCountry.name}
                                    className="w-5 h-4 object-cover rounded-sm"
                                  />
                                  <span className="text-xs whitespace-nowrap">
                                    {selectedCountry.dial_code}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs">Select...</span>
                              )}
                              <ChevronDown className="h-4 w-4 opacity-70 ml-1" />
                            </button>
                            {isDropdownOpen && (
                              <div
                                className="absolute z-20 w-72 mt-1 rounded-lg shadow-lg border overflow-hidden"
                                style={{
                                  backgroundColor: colors.card,
                                  borderColor: colors.border,
                                }}
                              >
                                <div
                                  className="p-2 border-b"
                                  style={{ borderColor: colors.border }}
                                >
                                  <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-50" />
                                    <input
                                      type="text"
                                      placeholder="Search country..."
                                      value={searchQuery}
                                      onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                      }
                                      className="w-full pl-8 pr-2 py-2 text-sm rounded border focus:outline-none focus:ring-1"
                                      style={{
                                        backgroundColor: colors.background,
                                        borderColor: colors.border,
                                        color: colors.foreground,
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                  {filteredCountries.map((country) => (
                                    <button
                                      type="button"
                                      key={country.code}
                                      onClick={() => {
                                        setSelectedCountry(country);
                                        setIsDropdownOpen(false);
                                        setSearchQuery("");
                                      }}
                                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-opacity-50 transition-colors"
                                      style={{
                                        color: colors.foreground,
                                        backgroundColor:
                                          selectedCountry?.code === country.code
                                            ? colors.primary + "20"
                                            : "transparent",
                                      }}
                                    >
                                      <img
                                        src={country.flag}
                                        alt={country.name}
                                        className="w-5 h-4 object-cover rounded-sm"
                                      />
                                      <span className="flex-1 text-sm truncate">
                                        {country.name}
                                      </span>
                                      <span
                                        className="text-xs"
                                        style={{ opacity: 0.7 }}
                                      >
                                        {country.dial_code}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <input
                            type="tel"
                            {...register("phone")}
                            placeholder="171234567"
                            className="flex-1 px-4 py-3 rounded-r-lg border focus:outline-none focus:ring-2"
                            style={inputStyle(!!errors.phone)}
                          />
                        </div>
                        {errors.phone && (
                          <p
                            className="mt-1 text-sm"
                            style={{ color: colors.destructive }}
                          >
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.foreground }}
                        >
                          Preferred Language{" "}
                          <span style={{ color: colors.primary }}>*</span>
                        </label>
                        <select
                          {...register("preferredLanguage")}
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                          style={inputStyle(!!errors.preferredLanguage)}
                        >
                          <option value="">Select Language</option>
                          <option value="English">English</option>
                          <option value="Bangla">Bangla</option>
                        </select>
                        {errors.preferredLanguage && (
                          <p
                            className="mt-1 text-sm"
                            style={{ color: colors.destructive }}
                          >
                            {errors.preferredLanguage.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Inquiry Type & Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.foreground }}
                        >
                          Inquiry Type{" "}
                          <span style={{ color: colors.primary }}>*</span>
                        </label>
                        <select
                          {...register("inquiryType")}
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                          style={inputStyle(!!errors.inquiryType)}
                        >
                          <option value="">Select Type</option>
                          <option value="General Inquiry">
                            General Inquiry
                          </option>
                          <option value="Course Information">
                            Course Information
                          </option>
                          <option value="Technical Support">
                            Technical Support
                          </option>
                          <option value="Feedback">Feedback</option>
                        </select>
                        {errors.inquiryType && (
                          <p
                            className="mt-1 text-sm"
                            style={{ color: colors.destructive }}
                          >
                            {errors.inquiryType.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.foreground }}
                        >
                          Subject{" "}
                          <span style={{ color: colors.primary }}>*</span>
                        </label>
                        <input
                          type="text"
                          {...register("subject")}
                          placeholder="How can we help?"
                          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                          style={inputStyle(!!errors.subject)}
                        />
                        {errors.subject && (
                          <p
                            className="mt-1 text-sm"
                            style={{ color: colors.destructive }}
                          >
                            {errors.subject.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 5: Message */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: colors.foreground }}
                      >
                        Message <span style={{ color: colors.primary }}>*</span>
                      </label>
                      <textarea
                        rows={5}
                        {...register("message")}
                        placeholder="Write your message here..."
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                        style={inputStyle(!!errors.message)}
                      />
                      {errors.message && (
                        <p
                          className="mt-1 text-sm"
                          style={{ color: colors.destructive }}
                        >
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-right">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
