// components/ProductHighlightsCard.tsx
"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface ProductHighlightsCardProps {
  title?: string;
  items: string[];
}

const ProductHighlightsCard = ({
  title = "Highlights",
  items,
}: ProductHighlightsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        <p className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide opacity-80">
          {title}
        </p>
        <div className="space-y-0.5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="mt-0.5 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform bg-pink-50 text-pink-500">
                  <CheckCircle size={18} strokeWidth={2} />
                </div>
              </span>
              <span className="text-sm text-gray-700 leading-relaxed pt-1.5">
                {item}
              </span>
            </div>
          ))}
          {(!items || items.length === 0) && (
            <p className="text-sm text-gray-400 text-center py-4">
              No highlights added
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHighlightsCard;
