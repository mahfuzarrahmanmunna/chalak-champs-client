"use client";

import React from "react";
import Image from "next/image";
import { BookOpen, ShoppingBag, Phone, CheckCircle, Tag } from "lucide-react";
import Button from "@/app/ui/button/Button";
import { Product } from "../products/types";

interface ProductOrderCardProps {
  product: Product;
  onOrder: () => void;
}

export default function ProductOrderCard({
  product,
  onOrder,
}: ProductOrderCardProps) {
  const isBook = product.category === "book";

  return (
    <div className="bg-white rounded-2xl border-2 border-[#FF8FCA] shadow-xl overflow-hidden">
      {/* Product Visual - Now shows real image! */}
      <div className="w-full aspect-video relative overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover w-full"
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center gap-2 ${
              isBook
                ? "bg-gradient-to-br from-[#F3056D] to-[#D6005C]"
                : "bg-gradient-to-br from-amber-500 to-orange-500"
            }`}
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              {isBook ? (
                <BookOpen className="w-6 h-6 text-white" />
              ) : (
                <ShoppingBag className="w-6 h-6 text-white" />
              )}
            </div>
            <span className="text-white/80 text-xs font-medium">
              Chalak Champs
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
            {product.title}
          </h3>
          <p className="text-sm text-[#F3056D] font-semibold">
            {product.subtitle}
          </p>
        </div>

        {/* Price */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">মূল্য</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-gray-900">
                {product.fee}
              </span>
              {product.originalFee && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalFee}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Highlights */}
        {product.highlights && product.highlights.length > 0 && (
          <div className="space-y-2">
            {product.highlights.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={onOrder}
            bgColor="#F3056D"
            highlightColor="#FF8FCA"
            darkShadowColor="#C6005F"
            className="w-full text-lg py-4"
            px="px-6"
          >
            এখনই অর্ডার করুন
          </Button>
          <a
            href="tel:01740176774"
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-600 hover:border-[#F3056D] hover:text-[#F3056D] font-bold rounded-xl text-sm transition-all"
          >
            <Phone className="w-4 h-4" />
            কল করুন: 01740176774
          </a>
        </div>
      </div>
    </div>
  );
}
