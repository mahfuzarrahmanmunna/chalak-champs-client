"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Heart,
  Send,
} from "lucide-react";

const Footer: React.FC = () => {
  const { theme, colors } = useTheme();
  const { isBangla } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to show/hide back to top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle back to top click
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => {
        setSubscribed(true);
        setTimeout(() => {
          setSubscribed(false);
          setEmail("");
        }, 3000);
      }, 1000);
    }
  };

  // Footer data
  const footerData = {
    company: {
      name: isBangla ? "চালাক চ্যাম্পস" : "Chalak Champs",
      description: isBangla
        ? "আমরা বিশ্বজ্ঞ ভাষা শিক্ষার প্ল্যাটফর্মের জন্য নিবেদিত কোর্স এবং সম্পদগুলি। আমাদের লক্ষ্য হল বিশ্বজ্ঞ ভাষায় দক্ষতা অর্জন করা এবং বিভিন্ন সংস্কৃতিতে সংযোগ করা।"
        : "We provide comprehensive courses and resources for learning different languages. Our goal is to help you achieve language proficiency and connect with different cultures through language learning.",
      logo: "https://i.ibb.co.com/4Z5b6Wm7/chalak-logo.jpg",
      address: isBangla
        ? "১২৩ বনগ্রাস রোড, ঢাকা ১২৩০, বাংলাদেশ"
        : "123 Education Street, Dhaka 1200, Bangladesh",
      phone: isBangla ? "+৮৮০১৭১১২৩৪৫৬৭" : "+880171234567",
      email: isBangla ? "info@chalakchamps.com" : "info@chalakchamps.com",
    },
    links: {
      learn: [
        { name: isBangla ? "সবকোর্স" : "Courses", href: "/courses" },
        { name: isBangla ? "ব্লগ" : "Blog", href: "/blog" },
        {
          name: isBangla ? "ইনস্ট্রাক্টর" : "Instructors",
          href: "/instructors",
        },
        { name: isBangla ? "সম্পদগুলি" : "Resources", href: "/resources" },
      ],
      company: [
        { name: isBangla ? "আমাদের সম্পর্কে" : "About Us", href: "/aboutus" },
        { name: isBangla ? "ক্যারিয়ার নীতি" : "Careers", href: "/careers" },
        { name: isBangla ? "যোগাযোগ" : "Contact", href: "/contact" },
        {
          name: isBangla ? "প্রেস বিজ্ঞপ্তি" : "Press Release",
          href: "/press",
        },
      ],
      support: [
        { name: isBangla ? "সাহায্য কেন্দ্র" : "Help Center", href: "/help" },
        { name: isBangla ? "প্রায়শ্নাল" : "FAQs", href: "/faqs" },
        { name: isBangla ? "শর্তামাপত্র" : "Terms of Service", href: "/terms" },
        { name: isBangla ? "গোপনীয়তা" : "Privacy Policy", href: "/privacy" },
      ],
    },
    social: [
      { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
      { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
      { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
      { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
      { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
    ],
    newsletter: {
      title: isBangla
        ? "নিউজলেটার সাবস্ক্রাইপ করুন"
        : "Subscribe to our newsletter",
      description: isBangla
        ? "নতুনতম কোর্স, প্রমোশন এবং বিশেষ অফার সরাসরি জানতে পান।"
        : "Get the latest courses, promotions and exclusive offers delivered to your inbox.",
      placeholder: isBangla ? "আপনার ইমেল লিখুন" : "Enter your email",
      buttonText: isBangla ? "সাবস্ক্রাইপ করুন" : "Subscribe",
    },
    copyright: {
      text: isBangla
        ? "© ২০২৩ চালাক চ্যাম্পস। সর্বধ স্বত্বাধিকার।"
        : "© 2023 Chalak Champs. All rights reserved.",
    },
  };

  return (
    <footer className="bg-primary dark:bg-gray-800 p-8 text-black dark:text-white">
      {/* Newsletter Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                {footerData.newsletter.title}
              </h3>
              <p className="mb-6 max-w-md text-gray-700 dark:text-gray-300 opacity-80">
                {footerData.newsletter.description}
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4 max-w-md"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={footerData.newsletter.placeholder}
                required
                className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="px-6 py-3 rounded-md font-medium text-white flex items-center justify-center disabled:opacity-50 bg-primary hover:bg-primary-focus"
              >
                {subscribed ? (
                  <span>
                    {isBangla ? "সাবস্ক্রাইপ করা হয়েছে!" : "Subscribed!"}
                  </span>
                ) : (
                  <>
                    {footerData.newsletter.buttonText}
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src={footerData.company.logo}
                alt={footerData.company.name}
                width={40}
                height={40}
                className="rounded-md mr-3"
              />
              <h3 className="text-xl font-bold text-black dark:text-white">
                {footerData.company.name}
              </h3>
            </div>
            <p className="mb-6 max-w-md text-gray-700 dark:text-gray-300 opacity-80">
              {footerData.company.description}
            </p>
            <div className="md:flex space-x-4 mb-6">
              <div className="flex items-center text-gray-700 dark:text-gray-300 opacity-80">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{footerData.company.address}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300 opacity-80">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{footerData.company.phone}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300 opacity-80">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{footerData.company.email}</span>
              </div>
            </div>
          </div>

          {/* Learn Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">
              {isBangla ? "শিখুন" : "Learn"}
            </h4>
            <ul className="space-y-2">
              {footerData.links.learn.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">
              {isBangla ? "কোম্পানি" : "Company"}
            </h4>
            <ul className="space-y-2">
              {footerData.links.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">
              {isBangla ? "সমর্থন" : "Support"}
            </h4>
            <ul className="space-y-2">
              {footerData.links.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            {footerData.social.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright and Back to Top */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-700 dark:text-gray-300 opacity-80">
            {footerData.copyright.text}
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-sm mr-2 text-gray-700 dark:text-gray-300 opacity-80">
              {isBangla ? "সঙ্গে তৈরি তৈরি করা" : "Made with"}
            </span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm ml-2 text-gray-700 dark:text-gray-300 opacity-80">
              {isBangla ? "চালাক চ্যাম্পসতে" : "by Chalak Champs"}
            </span>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all duration-300 z-10 bg-primary text-white hover:-translate-y-1"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
