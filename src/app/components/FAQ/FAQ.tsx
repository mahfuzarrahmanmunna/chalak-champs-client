// src/components/FAQ/FAQ.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useRouter } from "next/navigation";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  related: number[];
}

const FAQ: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const { colors } = useTheme();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [helpfulFeedback, setHelpfulFeedback] = useState<{
    [key: number]: boolean | null;
  }>({});
  const [showThankYou, setShowThankYou] = useState<{ [key: number]: boolean }>(
    {},
  );

  // Get FAQ data from translations
  const faqData = useMemo(() => {
    const faqs = (t.faqs as FAQItem[]) || [];
    const categories = (t.categories as { [key: string]: string }) || {};

    return {
      faqs,
      categories,
      title: (t.title as string) || "Frequently Asked Questions",
      subtitle: (t.subtitle as string) || "Find answers to common questions",
      searchPlaceholder:
        (t.searchPlaceholder as string) || "Search for questions...",
      noResults: (t.noResults as string) || "No results found",
      contactUs: (t.contactUs as string) || "Still have questions?",
      contactUsText: (t.contactUsText as string) || "Can't find the answer?",
      contactButton: (t.contactButton as string) || "Contact Support",
      helpful: (t.helpful as string) || "Was this helpful?",
      yes: (t.yes as string) || "Yes",
      no: (t.no as string) || "No",
      thankYou: (t.thankYou as string) || "Thank you!",
      relatedQuestions: (t.relatedQuestions as string) || "Related Questions",
    };
  }, [t]);

  // Filter FAQs based on search term and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqData.faqs;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [faqData.faqs, selectedCategory, searchTerm]);

  // Toggle expanded state for FAQ item
  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Handle helpful feedback
  const handleHelpful = (id: number, isHelpful: boolean) => {
    setHelpfulFeedback((prev) => ({ ...prev, [id]: isHelpful }));
    setShowThankYou((prev) => ({ ...prev, [id]: true }));

    // Hide thank you message after 3 seconds
    setTimeout(() => {
      setShowThankYou((prev) => ({ ...prev, [id]: false }));
    }, 3000);
  };

  // Get related questions
  const getRelatedQuestions = (currentId: number) => {
    const currentFAQ = faqData.faqs.find((faq) => faq.id === currentId);
    if (!currentFAQ) return [];

    return currentFAQ.related
      .map((id) => faqData.faqs.find((faq) => faq.id === id))
      .filter(Boolean) as FAQItem[];
  };

  // Expand all
  const expandAll = () => {
    setExpandedItems(filteredFAQs.map((faq) => faq.id));
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedItems([]);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            {faqData.title}
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            {faqData.subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5"
                style={{ color: "var(--color-muted-foreground)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={faqData.searchPlaceholder}
              className="block w-full pl-10 pr-3 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-background)",
                color: "var(--color-foreground)",
              }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(faqData.categories).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === key ? "text-white" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === key
                      ? "var(--color-primary)"
                      : "var(--color-secondary)",
                  color:
                    selectedCategory === key
                      ? "var(--color-primary-foreground)"
                      : "var(--color-secondary-foreground)",
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Expand/Collapse All */}
        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={expandAll}
            className="text-sm font-medium py-1 px-3 rounded transition-colors"
            style={{
              color: "var(--color-primary)",
              backgroundColor: "transparent",
            }}
          >
            {t.expand || "Expand All"}
          </button>
          <button
            onClick={collapseAll}
            className="text-sm font-medium py-1 px-3 rounded transition-colors"
            style={{
              color: "var(--color-primary)",
              backgroundColor: "transparent",
            }}
          >
            {t.collapse || "Collapse All"}
          </button>
        </div>

        {/* FAQ Items */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border rounded-lg overflow-hidden transition-all duration-200"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-card)",
                }}
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between transition-colors"
                  style={{
                    backgroundColor: expandedItems.includes(faq.id)
                      ? "var(--color-accent)"
                      : "transparent",
                  }}
                >
                  <h3
                    className="text-lg font-medium pr-4"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {faq.question}
                  </h3>
                  <svg
                    className={`h-5 w-5 transition-transform ${
                      expandedItems.includes(faq.id)
                        ? "transform rotate-180"
                        : ""
                    }`}
                    style={{ color: "var(--color-muted-foreground)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {expandedItems.includes(faq.id) && (
                  <div className="px-6 pb-4">
                    <div
                      className="prose max-w-none"
                      style={{ color: "var(--color-foreground)" }}
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />

                    {/* Helpful buttons */}
                    <div className="mt-4 flex items-center">
                      <span
                        className="mr-3 text-sm"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        {faqData.helpful}
                      </span>
                      <button
                        onClick={() => handleHelpful(faq.id, true)}
                        className={`mr-2 text-sm font-medium py-1 px-3 rounded transition-colors ${
                          helpfulFeedback[faq.id] === true
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            helpfulFeedback[faq.id] === true
                              ? "var(--color-primary)"
                              : "var(--color-secondary)",
                          color:
                            helpfulFeedback[faq.id] === true
                              ? "var(--color-primary-foreground)"
                              : "var(--color-secondary-foreground)",
                        }}
                      >
                        {faqData.yes}
                      </button>
                      <button
                        onClick={() => handleHelpful(faq.id, false)}
                        className={`text-sm font-medium py-1 px-3 rounded transition-colors ${
                          helpfulFeedback[faq.id] === false
                            ? "bg-red-100 text-red-800"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            helpfulFeedback[faq.id] === false
                              ? "#ef4444"
                              : "var(--color-secondary)",
                          color:
                            helpfulFeedback[faq.id] === false
                              ? "white"
                              : "var(--color-secondary-foreground)",
                        }}
                      >
                        {faqData.no}
                      </button>
                      {showThankYou[faq.id] && (
                        <span
                          className="ml-3 text-sm"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {faqData.thankYou}
                        </span>
                      )}
                    </div>

                    {/* Related questions */}
                    {getRelatedQuestions(faq.id).length > 0 && (
                      <div className="mt-6">
                        <h4
                          className="text-sm font-medium mb-2"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          {faqData.relatedQuestions}
                        </h4>
                        <ul className="space-y-2">
                          {getRelatedQuestions(faq.id).map((related) => (
                            <li key={related.id}>
                              <button
                                onClick={() => {
                                  // Collapse current item and expand related item
                                  setExpandedItems((prev) =>
                                    prev.filter((item) => item !== faq.id),
                                  );
                                  setTimeout(() => {
                                    setExpandedItems((prev) => [
                                      ...prev,
                                      related.id,
                                    ]);
                                  }, 100);
                                }}
                                className="text-left text-sm hover:underline transition-colors"
                                style={{ color: "var(--color-primary)" }}
                              >
                                {related.question}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                style={{ color: "var(--color-muted-foreground)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: "var(--color-foreground)" }}
            >
              {faqData.noResults}
            </h3>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
              }}
            >
              {String(t.close || "Reset Filters")}
            </button>
          </div>
        )}

        {/* Contact Support */}
        <div
          className="mt-16 p-8 rounded-lg text-center"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            {faqData.contactUs}
          </h2>
          <p
            className="mb-6 max-w-2xl mx-auto"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            {faqData.contactUsText}
          </p>
          <button
            onClick={() => router.push("/contact")}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            {faqData.contactButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
