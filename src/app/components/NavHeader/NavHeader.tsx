"use client";

import Button from "@/app/ui/button/Button";
import React, { useEffect, useState } from "react";
import NavLogo from "./logo";
import DropIcon from "./DropIcon";
import Link from "next/link";
import CallIcon from "../Icon/CallIcon";
import MulStar from "../Icon/MulStar";
import MenuIcon from "../Icon/MenuIcon";
import CloseIcon from "../Icon/CloseIcon";

const NavHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 px-2 transition-all duration-300 ${
        scrolled
          ? "bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "bg-white "
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-1">
        <Link href={"/"}>
          <NavLogo />
        </Link>

        {/* --- DESKTOP MIDDLE SECTION --- */}
        <div className="hidden md:flex items-center gap-7">
          <div>
            <button className="cursor-pointer leading-auto tracking-[-2%] relative px-3.75  py-3 w-full rounded-[50px] font-bold text-white transition-all duration-300 bg-[#F3056D] shadow-[inset_0_1.5px_0_0_#FF8FCA,0_1.5px_1.5px_0_rgba(243,6,110,0.3),0_0_0_1.5px_#C6005F,0_3.01px_7.52px_0_rgba(243,6,110,0.3)]  hover:bg-white hover:text-[#F3056D]  hover:shadow-[0_1.5px_1.5px_0_rgba(243,6,110,0.2),0_0_0_1.5px_#F3056D,0_3.01px_7.52px_0_rgba(243,6,110,0.1)]">
              <div className="absolute top-1.5 left-1.5 text-base  transition-colors duration-300">
                <svg
                  width="32"
                  height="33"
                  viewBox="0 0 32 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-0.000367234 5.24803L2.85291 6.42831C3.61254 6.74311 4.19326 7.3648 4.44321 8.13188L5.381 11.0126L6.593 8.2305C6.91588 7.48989 7.55216 6.924 8.33896 6.68032L11.2934 5.76467L8.44011 4.58439C8.06488 4.42917 7.72852 4.19669 7.45408 3.90288C7.17963 3.60907 6.9736 3.26088 6.85009 2.88217L5.91202 0.000140662L4.7003 2.78356C4.37713 3.52281 3.73975 4.09033 2.95434 4.33374L-0.000367234 5.24803ZM27.3896 6.48784L28.0441 5.88457C28.3406 5.61174 28.6941 5.40467 29.0804 5.27754C29.4667 5.15042 29.8766 5.10625 30.2821 5.14808L31.1772 5.23913L30.5585 4.60101C30.2789 4.31207 30.0666 3.96761 29.9363 3.59125C29.806 3.21488 29.7606 2.8155 29.8033 2.42045L29.8967 1.54772L29.2422 2.15099C28.6434 2.70247 27.8258 2.97191 27.0056 2.88721L26.1105 2.79615L26.7292 3.43427C27.2949 4.01811 27.5712 4.81517 27.4844 5.61484L27.3896 6.48784ZM12.5852 30.4953L14.5839 30.4154C15.4086 30.3824 16.2065 30.7009 16.7689 31.2897L18.133 32.7169L18.0496 30.7685C18.0329 30.3712 18.1044 29.9751 18.2595 29.6074C18.4145 29.2397 18.6493 28.909 18.9477 28.638L20.4102 27.3083L18.4118 27.3896C18.0047 27.406 17.5987 27.3363 17.2218 27.1853C16.8449 27.0344 16.506 26.8057 16.2282 26.5151L14.8641 25.0879L14.9461 27.0365C14.9631 27.4337 14.8917 27.8297 14.7369 28.1974C14.5822 28.5651 14.3476 28.8958 14.0494 29.1668L12.5852 30.4953Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              Book A Free Class
            </button>
          </div>
          <div className="relative ">
            <button className=" flex items-center leading-auto tracking-[-2%] text-sm gap-2.5 text-[#F3066E] hover:bg-white hover:border hover:border-primary  bg-[#F3066E]/20 cursor-pointer px-3.5 py-3 rounded-lg">
              <div className="flex">
                <p>All Courses </p>
                <div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F3066E] absolute "></div>
                </div>
              </div>{" "}
              <DropIcon />
            </button>
          </div>
          <div>
            <button className="flex items-center leading-auto tracking-[-2%] text-sm gap-2.5 text-[#F3066E] cursor-pointer">
              Skills <DropIcon />
            </button>
          </div>
          <button className="flex text-primary leading-auto tracking-[-2%] text-sm cursor-pointer">
            <span>Kids English</span>
            <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
          </button>
          <div>
            <button className="flex items-center leading-auto tracking-[-2%] text-sm gap-2.5 text-primary cursor-pointer">
              More
              <DropIcon />
            </button>
          </div>
        </div>

        {/* --- DESKTOP RIGHT SECTION --- */}
        <div className="hidden md:block">
          <div>
            <Button icon=<CallIcon /> px="px-2" hoverTextColor="#214187">
              Call Us
            </Button>
          </div>
        </div>

        {/* --- MOBILE TOGGLE BUTTON --- */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            // Close Icon
            <CloseIcon />
          ) : (
            // Menu Icon
            <MenuIcon />
          )}
        </button>
      </div>

      {/* --- MOBILE MENU CONTENT --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-6 px-4 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
          {/* Book A Free Class Button (Full width on mobile) */}
          <button className="cursor-pointer relative px-8 py-3 w-full rounded-[50px] font-bold text-white transition-all duration-300 bg-[#F3056D] shadow-[inset_0_1.5px_0_0_#FF8FCA,0_1.5px_1.5px_0_rgba(243,6,110,0.3),0_0_0_1.5px_#C6005F,0_3.01px_7.52px_0_rgba(243,6,110,0.3)] hover:bg-white hover:text-[#F3056D] hover:shadow-[0_1.5px_1.5px_0_rgba(243,6,110,0.2),0_0_0_1.5px_#F3056D,0_3.01px_7.52px_0_rgba(243,6,110,0.1)]">
            <div className="absolute top-1 transition-colors duration-300">
              <MulStar />
            </div>
            Book A Free Class
          </button>

          <div className="border-t border-gray-200"></div>

          <div className="flex flex-col gap-4 items-center">
            <button className="flex items-center justify-center gap-2 text-[#F3066E] hover:bg-white hover:border hover:border-primary bg-[#F3066E]/20 cursor-pointer px-6 py-3 rounded-lg w-full">
              All Courses{" "}
              <div className="w-1.5 h-1.5 rounded-full bg-[#F3066E] absolute right-6"></div>
              <DropIcon />
            </button>

            <button className="flex items-center justify-center gap-2 text-[#F3066E] w-full">
              Skills <DropIcon />
            </button>

            <div className="flex items-center justify-center gap-2 text-primary w-full">
              <span>Kids English</span>
              <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
            </div>

            <button className="flex items-center justify-center gap-2 text-primary w-full">
              More
              <DropIcon />
            </button>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Call Us Button (Full width on mobile) */}
          <Button
            icon=<CallIcon />
            px="px-2"
            hoverTextColor="#214187"
            className="w-full"
          >
            Call Us
          </Button>
        </div>
      )}
    </nav>
  );
};

export default NavHeader;
