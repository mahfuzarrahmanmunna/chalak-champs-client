"use client";

import React from "react";
import Image from "next/image";
import { Layers, Tag } from "lucide-react";
import Button from "@/app/ui/button/Button";
import EyeIcon from "@/app/components/ChalakCourses/EyeIcon";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { Product } from "./types";

interface ProductCardProps {
  product: Product;
  ctaCardLabel: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, ctaCardLabel }) => {
  const context = useLanguage();
  const isBangla = context?.isBangla || false;
  const getLink = context?.getLink || ((path: string) => path);

  const isComingSoon =
    product.badge?.toLowerCase().includes("coming") ||
    product.badge?.includes("শীঘ্রই") ||
    product.badge?.includes("আসছে");

  // Badge 1: use first highlight or fallback to category
  const badge1 =
    (product.highlights && product.highlights[0]) || product.category || "";

  // Badge 2: use fee (price) as the pink tag, or second highlight
  const badge2 = product.fee
    ? product.fee
    : (product.highlights && product.highlights[1]) || "";

  return (
    <div className="w-[86vw] md:w-[304px]">
      {/* ── EXACT ChalakLibrary outer shell ── */}
      <div className="max-w-80 mx-auto h-132 shadow bg-linear-to-b from-[#FF8FCA] to-[#D9D9D9] rounded-[22px] p-0.5">
        <div className="w-full h-full rounded-[20px] p-2 bg-[#F9FAFC]">
          {/* ── Image container ── */}
          <div className="md:w-71 md:h-71 w-74 h-73 bg-[#001D3A0D] rounded-2xl relative overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover w-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F3056D] to-[#D6005C] rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl font-extrabold">CC</span>
                </div>
                <span className="text-gray-400 text-sm font-medium">
                  {product.category}
                </span>
              </div>
            )}
          </div>

          {/* ── Content below image ── */}
          <div className="flex flex-col justify-center items-center">
            {/* ── DOUBLE BADGE SECTION (same as ChalakLibrary) ── */}
            <div className="flex items-center flex-col justify-center gap-2 mt-2 w-full flex-wrap">
              {/* Badge 1: Blue-ish (type / first highlight) */}
              {badge1 && (
                <div className="flex items-center gap-1.5 text-black text-sm bg-[#1B386B26] rounded-full px-3 py-1.5 shadow-sm border border-white/50">
                  <Layers size={14} className="text-[#1B386B]" />
                  <p>{badge1}</p>
                </div>
              )}

              {/* Badge 2: Pink-ish (price / second highlight) */}
              {badge2 && (
                <div className="flex items-center gap-1.5 text-[#E2136E] text-xs bg-[#FCE7F3] rounded-full px-3 py-1.5 shadow-sm border border-white/50">
                  <Tag size={14} />
                  <p>{badge2}</p>
                </div>
              )}
            </div>
            {/* ── END DOUBLE BADGE SECTION ── */}

            <div className="flex flex-col items-center">
              <h3 className="text-[#3C4043] text-2xl leading-[140%] tracking-normal font-semibold mt-[15px] text-center px-2">
                {product.title}
              </h3>

              {/* ── CTA Button (same as ChalakLibrary) ── */}
              <div className="mt-3">
                {isComingSoon ? (
                  <div className="opacity-60 pointer-events-none">
                    <Button
                      bgColor="#9CA3AF"
                      highlightColor="#D1D5DB"
                      darkShadowColor="#6B7280"
                      textColor="white"
                      hoverTextColor="#9CA3AF"
                      textSize="lg"
                      iconPosition="right"
                      className="mt-3 flex items-center gap-2 px-4 py-2 cursor-pointer rounded-xl shadow-[inset_0_3px_0_rgba(255,255,255,0.5)] transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        {isBangla ? "শীঘ্রই আসছে" : "Coming Soon"} <EyeIcon />
                      </div>
                    </Button>
                  </div>
                ) : (
                  <Link href={getLink(`/products/details?id=${product.id}`)}>
                    <Button
                      bgColor="#E2136E"
                      highlightColor="#FC7CB4"
                      darkShadowColor="#B80E5C"
                      textColor="white"
                      hoverTextColor="#E2136E"
                      textSize="lg"
                      iconPosition="right"
                      className="mt-3 flex hover:text-primary text-white items-center gap-2 px-4 py-2 cursor-pointer rounded-xl shadow-[inset_0_3px_0_rgba(255,255,255,0.5)] transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        {ctaCardLabel} <EyeIcon />
                      </div>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
