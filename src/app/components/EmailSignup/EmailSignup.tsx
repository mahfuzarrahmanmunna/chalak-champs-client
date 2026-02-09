// src/components/EmailSignup/EmailSignup.tsx
"use client";
import React, { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";

const EmailSignup: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage(String(t.emailRequired || "Email is required"));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage(
        String(t.invalidEmail || "Please enter a valid email address"),
      );
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(
          data.message || t.subscriptionSuccess || "Subscribed successfully!",
        );
        setEmail("");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error.message ||
          t.subscriptionError ||
          "Failed to subscribe. Please try again.",
      );
    }
  };

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            {String(t.newsletterTitle || "Join Our Newsletter")}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto mb-8"
            style={{ color: "var(--color-mutedForeground)" }}
          >
            {String(
              t.newsletterSubtitle ||
                "Subscribe to our newsletter for updates and offers",
            )}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {status === "success" ? (
            <div
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              <div className="mb-4">
                <svg
                  className="h-16 w-16 mx-auto"
                  style={{ color: "#10b981" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--color-foreground)" }}
              >
                {String(t.thankYou || "Thank you for subscribing!")}
              </h3>
              <p
                className="mb-4"
                style={{ color: "var(--color-mutedForeground)" }}
              >
                {message}
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                }}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primaryForeground)",
                }}
              >
                {String(t.subscribeAnother || "Subscribe another email")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={String(
                      t.emailPlaceholder || "Enter your email",
                    )}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor:
                        status === "error" ? "#ef4444" : "var(--color-border)",
                      backgroundColor: "var(--color-background)",
                      color: "var(--color-foreground)",
                      ringColor:
                        status === "error" ? "#ef4444" : "var(--color-primary)",
                    }}
                    disabled={status === "loading"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primaryForeground)",
                  }}
                >
                  {Boolean(
                    status === "loading" ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t.subscribing || "Subscribing..."}
                      </>
                    ) : (
                      t.subscribe || "Subscribe"
                    ),
                  )}
                </button>
              </div>

              {status === "error" && (
                <div className="p-3 rounded-lg flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                    style={{ color: "#ef4444" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p style={{ color: "#ef4444" }}>{message}</p>
                </div>
              )}

              <p
                className="text-xs mt-2"
                style={{ color: "var(--color-mutedForeground)" }}
              >
                {String(
                  t.newsletterDisclaimer ||
                    "We respect your privacy. Unsubscribe at any time.",
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmailSignup;
