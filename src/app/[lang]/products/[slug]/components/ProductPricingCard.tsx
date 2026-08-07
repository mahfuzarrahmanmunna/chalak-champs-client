// components/ProductPricingCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import Button from "@/app/ui/button/Button";

interface ProductPricingCardProps {
  data: {
    image?: string;
    hero: { title: string };
    quickInfo: {
      offerPrice: string;
      offerText: string;
      cta1: string;
      cta2: string;
    };
  };
  isVisible: boolean;
}

const ProductPricingCard = ({ data, isVisible }: ProductPricingCardProps) => {
  const pricingText = data?.quickInfo?.offerPrice || "";
  const parts = pricingText.split(" ").filter(Boolean);
  const originalPrice = parts.length > 2 ? `${parts[0]} ${parts[1]}` : null;
  const currentPrice =
    parts.length > 2 ? `${parts[2]} ${parts[3] || ""}`.trim() : pricingText;

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Image Section */}
        <div className="w-full aspect-video bg-gray-100 relative">
          {data?.image ? (
            <Image
              src={data.image}
              alt={data.hero.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Package className="h-16 w-16 text-gray-200" />
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {currentPrice}
            </span>
            {originalPrice && (
              <span className="text-lg text-gray-400 line-through mb-1.5">
                {originalPrice}
              </span>
            )}
          </div>
          {data?.quickInfo?.offerText && (
            <div className="text-sm text-[#F3056D] font-medium">
              {data.quickInfo.offerText}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white flex flex-col gap-2">
          <Button
            bgColor="#F3056D"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#F3056D"
            className="w-full py-2.5 rounded-lg text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95 bg-[#F3056D]"
          >
            {data?.quickInfo?.cta1 || "Order Now"}
          </Button>
          <Button
            bgColor="#ffffff"
            darkShadowColor="#F3066E"
            highlightColor="#FF8FCA"
            hoverTextColor="#ffffff"
            textColor="#F3056D"
            hoverBgColor="#F3056D"
            className="text-sm py-2"
          >
            {data?.quickInfo?.cta2 || "Inquire"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPricingCard;
