"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPhone } from "react-icons/fa6";
import { Mail } from "lucide-react";
import { FaFacebookF, FaFacebookMessenger, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";

const Footer = () => {
  const { isBangla, getLink, footerData } = useLanguage();

  return (
    <footer className="bg-white pt-16 pb-16 md:pb-8 text-black dark:text-white">
      <div className="container mx-auto px-6 text-base font-inter">
        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[3fr_2fr_2fr_3fr] gap-12 mb-12">
          
          {/* --- COLUMN 1: BRAND & INTRO --- */}
          <div className="space-y-6">
            <Link href={getLink("/")} className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Chalak Champs Logo"
                width={177.7851104736328}
                height={106.328125}
                className="rounded-lg"
              />
            </Link>
            <p className="text-xs leading-5 tracking-normal text-[#2D2D2D] dark:text-white">
              {footerData?.about?.tagline || "Chalak Champs একটি আধুনিক Skill-Based EdTech Platform, যেখানে ৩–১৫ বয়সী শিশুদের Spoken English, Abacus, Programming সহ বিভিন্ন কোর্সে “Learning by Doing” পদ্ধতিতে আত্মবিশ্বাসী ও দক্ষ করে গড়ে তোলা হয়।"}
            </p>

            <div className="dark:text-white text-[#2D2D2D]">
              <h4 className="font-medium text-xl leading-6">
                {footerData?.links?.[2]?.title || "আমাদের সাথে কানেক্টেড থাকো"}
              </h4>
              <div className="flex gap-3 mt-3">
                <div className="text-[#1777F2] bg-[#1777F21A]  h-10 w-10.5 flex items-center justify-center rounded-lg">
                  <a href="https://www.facebook.com/chalakchamps" target="_blank">
                    <FaFacebookF size={18} />
                  </a>
                </div>
                <div className="text-[#FE0000] bg-[#FE00001A]  h-10 w-10.5 flex items-center justify-center rounded-lg">
                  <a href="https://www.youtube.com/@chalakchamps" target="_blank">
                    <FaYoutube size={18} />
                  </a>
                </div>
                <div className="text-[#1777F2] bg-[#448AFF1A]  h-10 w-10.5 flex items-center justify-center rounded-lg">
                  <Link href="https://m.me/chalakchamps" target="_blank">
                    <FaFacebookMessenger size={18} />
                  </Link>
                </div>
                <div className="text-[#25D366] bg-[#25D3661A]  h-10 w-10.5 flex items-center justify-center rounded-lg">
                  <Link
                    href="https://wa.me/8801740176774?text=Hello!%20I%20want%20to%20know%20more%20about%20Chalak%20Champs."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="md:flex hidden col-span-2 justify-around">
            {/* --- Explore 1st --- */}
            <div className="space-y-6 dark:text-white text-[#2D2D2D] font-medium">
              <h3 className="text-lg font-semibold mb-6 inline-block">
                {isBangla ? "এক্সপ্লোর" : "Explore"}
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href={getLink("/aboutus")} className="hover:text-[#F3066E] transition-colors font-medium">
                    {isBangla ? "আমাদের সম্পর্কে" : "About Us"}
                  </Link>
                </li>
                <li>
                  <Link href={getLink("/contact")} className="hover:text-[#F3066E] transition-colors font-medium">
                    {isBangla ? "যোগাযোগ করুন" : "Contact Us"}
                  </Link>
                </li>
                <li>
                  <Link href={getLink("/courses")} className="hover:text-[#F3066E] transition-colors font-medium flex items-center gap-3">
                    {isBangla ? "স্কিলস" : "Skills"} 
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  </Link>
                </li>
                <li>
                  <Link href={getLink("/ebooks")} className="hover:text-[#F3066E] transition-colors font-medium flex items-center gap-3">
                    {isBangla ? "ই-বুক" : "E-Books"}
                  </Link>
                </li>
                {/* <li>
                  <Link href={getLink("/notes")} className="hover:text-[#F3066E] transition-colors">
                    {isBangla ? "ফ্রি নোটস ও গাইড" : "Free Notes & Guides"}
                  </Link>
                </li>
                <li>
                  <Link href={getLink("/courses?filter=free")} className="hover:text-[#F3066E] transition-colors font-medium">
                    {footerData?.links?.[0]?.items?.[0] || (isBangla ? "ফ্রি কোর্স" : "Free Courses")}
                  </Link>
                </li> */}
                <li>
                  <Link href={getLink("/offers")} className="relative bg-linear-to-r from-[#C6005F] to-[#00477C] bg-clip-text text-transparent hover:text-[#F3066E] transition-colors">
                    {isBangla ? "চালাক Champs অফার" : "Chalak Champs Offer"}
                    <div className="absolute -top-1.25 -left-3">
                      <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-0.000462056 5.24779L2.86619 6.42807C3.62939 6.74287 4.21282 7.36455 4.46394 8.13164L5.40613 11.0123L6.62381 8.23025C6.94821 7.48965 7.58747 6.92376 8.37795 6.68007L11.3462 5.76442L8.47958 4.58414C8.10259 4.42893 7.76466 4.19645 7.48893 3.90264C7.2132 3.60883 7.00619 3.26063 6.88211 2.88193L5.93964 -0.000103482L4.72224 2.78331C4.39756 3.52256 3.75718 4.09008 2.9681 4.33349L-0.000462056 5.24779ZM27.5179 6.48759L28.1755 5.88433C28.4734 5.6115 28.8285 5.40442 29.2166 5.2773C29.6047 5.15017 30.0166 5.10601 30.4239 5.14783L31.3233 5.23889L30.7016 4.60077C30.4207 4.31182 30.2075 3.96737 30.0765 3.591C29.9456 3.21464 29.9 2.81525 29.9429 2.4202L30.0368 1.54748L29.3792 2.15074C28.7775 2.70222 27.9562 2.97167 27.1321 2.88696L26.2328 2.79591L26.8544 3.43403C27.4227 4.01787 27.7004 4.81493 27.6131 5.61459L27.5179 6.48759ZM12.6441 30.4951L14.6522 30.4152C15.4807 30.3822 16.2824 30.7007 16.8474 31.2894L18.2179 32.7166L18.1341 30.7683C18.1173 30.371 18.1892 29.9749 18.345 29.6072C18.5007 29.2394 18.7366 28.9087 19.0364 28.6378L20.5058 27.3081L18.498 27.3894C18.089 27.4057 17.6811 27.336 17.3025 27.1851C16.9238 27.0341 16.5833 26.8055 16.3042 26.5149L14.9337 25.0876L15.016 27.0363C15.0331 27.4334 14.9614 27.8294 14.8059 28.1971C14.6504 28.5648 14.4148 28.8955 14.1151 29.1665L12.6441 30.4951Z" fill="#F3066E" />
                      </svg>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* OTHER LINKS 2nd */}
            <div className="space-y-6 dark:text-white text-[#2D2D2D] font-medium">
              <div>
                <h3 className="text-lg font-semibold mb-6 inline-block">
                  {footerData?.links?.[0]?.title || (isBangla ? "অন্যান্য" : "Others")}
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href={getLink("/coming-soon")} className="hover:text-[#F3066E] transition-colors">
                      {isBangla ? "শিক্ষক হিসাবে যোগ দিন" : "Join as Teacher"}
                    </Link>
                  </li>
                  <li>
                    <Link href={getLink("/coming-soon")} className="hover:text-[#F3066E] transition-colors flex items-center gap-2">
                      {isBangla ? "ক্যারিয়ার / নিয়োগ বিজ্ঞপ্তি" : "Career / Jobs"}
                      <span className="h-2 w-2 bg-[#06F341] hover:bg-[#F3066E] rounded-full" />
                    </Link>
                  </li>
                  <li>
                    <Link href={getLink("/coming-soon")} className="hover:text-[#F3066E] transition-colors">
                      {footerData?.links?.[0]?.items?.[3] || (isBangla ? "অ্যাফিলিয়েট রেজিস্ট্রেশন" : "Affiliate Registration")}
                    </Link>
                  </li>
                  <li>
                    <Link href={getLink("/coming-soon")} className="hover:text-[#F3066E] transition-colors">
                      {footerData?.links?.[1]?.items?.[0] || (isBangla ? "প্রাইভেসি পলিসি" : "Privacy Policy")}
                    </Link>
                  </li>
                  <li>
                    <Link href={getLink("/coming-soon")} className="hover:text-[#F3066E] transition-colors">
                      {footerData?.links?.[1]?.items?.[1] || (isBangla ? "ব্যবহারকারীর শর্তাবলি" : "Terms of Use")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* --- contact us 3rd --- */}
          <div className="space-y-6 dark:text-white text-[#2D2D2D] font-medium">
            <h3 className="text-lg font-semibold mb-6 inline-block">
              {footerData?.links?.[2]?.title || (isBangla ? "যোগাযোগ" : "Contact")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-4 text-[#C6005F]">
                <div className="bg-[#F3066E4D] p-2 rounded-lg">
                  <FaPhone size={18} />
                </div>
                <a href={`tel:${footerData?.contact?.phone || "+8801740176774"}`} className="hover:text-[#F3066E] transition-colors duration-300">
                  <p>
                    {footerData?.contact?.phone || "+88 01740176774"}{" "}
                    <span className="text-[#2D2D2D66] dark:text-gray-500">(24x7)</span>
                  </p>
                </a>
              </li>
              <li className="flex items-center gap-4 text-[#C6005F]">
                <div className="bg-[#F3066E4D] p-2 rounded-lg">
                  <Mail size={18} />
                </div>
                <a href={`mailto:${footerData?.contact?.email || "support@chalakchamps.com"}`} className="hover:underline transition-all duration-300">
                  <p>{footerData?.contact?.email || "support@chalakchamps.com"}</p>
                </a>
              </li>
              <li className="flex items-center gap-4 text-[#C6005F]">
                <div className="bg-[#F3066E4D] p-2 rounded-lg">
                  <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.4538 0C2.89517 0 0 2.89518 0 6.4538C0 10.8702 5.77556 17.3537 6.02139 17.6275C6.25234 17.8847 6.65561 17.8843 6.88621 17.6275C7.13213 17.3537 12.9076 10.8702 12.9076 6.4538C12.9076 2.89518 10.0124 0 6.4538 0ZM6.4538 9.70093C4.6633 9.70093 3.20676 8.24429 3.20676 6.4538C3.20676 4.66339 4.66339 3.20676 6.4538 3.20676C8.2442 3.20676 9.70084 4.66339 9.70084 6.4538C9.70084 8.24429 8.2442 9.70093 6.4538 9.70093Z" fill="#F3066E" />
                  </svg>
                </div>
                <a href="https://maps.app.goo.gl/y91UcDooycaHRaWE9" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer">
                  <p>
                    {footerData?.contact?.address || "Amin Tower, House - 4 (4th Floor), Rd 1, Sector 9, Uttara, Dhaka 1230"}
                  </p>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM COPYRIGHT --- */}
        <div className="flex flex-col items-center text-sm text-[#2D2D2D]/70">
          <p className="text-xs font-semibold leading-7 text-center">
            {footerData?.copyright || `স্বত্ব © ${new Date().getFullYear()} লিগুয়াল একাডেমি এবং চালাক Champs কর্তৃক সংরক্ষিত - সর্বস্বত্ব অধিকার সংরক্ষিত।`}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;