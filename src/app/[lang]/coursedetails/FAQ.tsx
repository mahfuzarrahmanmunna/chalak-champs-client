"use client";

import React, { useState } from "react";
import { HelpCircle, Minus, Plus } from "lucide-react";

// Define interface for FAQ props
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  faqs?: FAQItem[];
}

const FAQ = ({ faqs = [] }: FAQProps) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  return (
    <div className="bg-[#214187]/5 p-6 rounded-xl border border-[#214187]/20 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-5 w-5" />
        <h3 className="font-bold text-lg text-gray-900">সাধারণ জিজ্ঞাসা</h3>
      </div>

      <div className="space-y-3">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() =>
                  setActiveFaq(activeFaq === faq.id ? null : faq.id)
                }
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <span className="font-medium text-gray-800 text-sm md:text-base pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {activeFaq === faq.id ? (
                    <Minus className="h-4 w-4 text-[#F3056D]" />
                  ) : (
                    <Plus className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </button>
              {activeFaq === faq.id && (
                <div className="px-4 pb-4 pt-0 text-sm text-gray-600 border-t border-gray-100 mt-2">
                  <div className="pt-3 leading-relaxed">{faq.answer}</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm py-4">কোনো প্রশ্ন পাওয়া যায়নি।</p>
        )}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mt-6 pt-4 border-t border-[#214187]/10">
        এখনও আপনার প্রশ্নের উত্তর পাননি? আমাদের টিম থেকে শীঘ্রই কল পেতে নিচের
        ফর্মটি সাবমিট করুন ইনশাআল্লাহ!
      </p>
    </div>
  );
};

export default FAQ;
