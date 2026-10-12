// app/components/Tracking/TrackingAndConsent.tsx

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  pushTrackingEvent,
  readTrackingConsent,
  TRACKING_CONSENT_KEY,
  type TrackingConsent,
  type TrackingSettings,
} from "@/lib/trackingSettings";

// ═══════════════════════════════════════════════════════════════
//  VALIDATION (unchanged — preserves existing script-gating logic)
// ═══════════════════════════════════════════════════════════════

const GTM_ID = /^GTM-[A-Z0-9]+$/;
const GA4_ID = /^G-[A-Z0-9]+$/;
const META_PIXEL_ID = /^\d{5,20}$/;
const GOOGLE_ADS_ID = /^AW-\d{6,20}$/;

function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.includes(".") &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      (url.pathname === "/" || url.pathname === "")
    );
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function ConsentToggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-[#F3056D]" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function TrackingAndConsent({
  settings,
}: {
  settings: TrackingSettings;
}) {
  const pathname = usePathname();

  // ── Consent state ──────────────────────────────────────────
  const [consent, setConsent] = useState<TrackingConsent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftConsent, setDraftConsent] = useState<TrackingConsent>({
    analytics: false,
    marketing: false,
  });

  // ── Animation state ────────────────────────────────────────
  const [bannerVisible, setBannerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // ── Refs ───────────────────────────────────────────────────
  const lastPageView = useRef<string | null>(null);
  const pendingPixelPageViews = useRef(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ── Load consent from localStorage ─────────────────────────
  useEffect(() => {
    setConsent(readTrackingConsent());
    setLoaded(true);
  }, []);

  // ── Banner entrance animation ──────────────────────────────
  useEffect(() => {
    if (loaded && !consent && !modalOpen) {
      const raf = requestAnimationFrame(() => setBannerVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setBannerVisible(false);
  }, [loaded, consent, modalOpen]);

  // ── Modal entrance animation ───────────────────────────────
  useEffect(() => {
    if (modalOpen) {
      const raf = requestAnimationFrame(() => setModalVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setModalVisible(false);
  }, [modalOpen]);

  // ── Save consent (preserves existing logic) ────────────────
  const saveConsent = useCallback(
    (value: TrackingConsent) => {
      try {
        window.localStorage.setItem(
          TRACKING_CONSENT_KEY,
          JSON.stringify(value),
        );
        const preferencesChanged =
          consent !== null &&
          (consent.analytics !== value.analytics ||
            consent.marketing !== value.marketing);
        setConsent(value);
        setModalOpen(false);
        if (preferencesChanged) window.location.reload();
      } catch (error) {
        console.error("Unable to save cookie preferences:", error);
      }
    },
    [consent],
  );

  // ── Modal open/close ───────────────────────────────────────
  const openModal = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setDraftConsent(
      consent ?? { analytics: false, marketing: false },
    );
    setModalOpen(true);
  }, [consent]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // ── Focus trap & keyboard handling ─────────────────────────
  useEffect(() => {
    if (!modalOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelector =
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    // Focus first interactive element
    const focusable = modal.querySelectorAll<HTMLElement>(focusableSelector);
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        return;
      }

      if (e.key === "Tab") {
        const elements = Array.from(
          modal.querySelectorAll<HTMLElement>(focusableSelector),
        );
        if (elements.length === 0) return;

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [modalOpen]);

  // ── Backdrop click handler ─────────────────────────────────
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  TRACKING SCRIPT LOGIC (unchanged — preserves all behavior)
  // ═══════════════════════════════════════════════════════════

  const gtmEnabled =
    settings.gtm.enabled &&
    GTM_ID.test(settings.gtm.containerId) &&
    consent?.analytics === true &&
    consent?.marketing === true;
  const ga4Enabled =
    settings.ga4.enabled &&
    GA4_ID.test(settings.ga4.measurementId) &&
    consent?.analytics === true;
  const adsEnabled =
    settings.googleAds.enabled &&
    GOOGLE_ADS_ID.test(settings.googleAds.conversionId) &&
    consent?.marketing === true;
  const pixelEnabled =
    settings.metaPixel.enabled &&
    META_PIXEL_ID.test(settings.metaPixel.pixelId) &&
    consent?.marketing === true;
  const stapeUrl =
    settings.serverSide.enabled &&
    isValidHttpsUrl(settings.serverSide.stapeContainerUrl)
      ? settings.serverSide.stapeContainerUrl
      : "";
  const googleIds = [
    ga4Enabled ? settings.ga4.measurementId : "",
    adsEnabled ? settings.googleAds.conversionId : "",
  ].filter(Boolean);
  const googleLoaderId = googleIds[0];

  // ── SPA page-view tracking (unchanged) ─────────────────────
  useEffect(() => {
    if (!consent || (!consent.analytics && !pixelEnabled)) {
      lastPageView.current = null;
      return;
    }
    if (!pathname || pathname === lastPageView.current) return;
    if (consent.analytics) {
      pushTrackingEvent(
        "page_view",
        {
          page_path: pathname,
          page_location: `${window.location.origin}${pathname}`,
          page_title: document.title,
        },
        "analytics",
      );
    }
    if (pixelEnabled) {
      if (window.fbq) window.fbq("track", "PageView");
      else pendingPixelPageViews.current += 1;
    }
    lastPageView.current = pathname;
  }, [consent, pathname, pixelEnabled]);

  const flushPixelPageViews = () => {
    if (!window.fbq) return;
    while (pendingPixelPageViews.current > 0) {
      window.fbq("track", "PageView");
      pendingPixelPageViews.current -= 1;
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  RENDER — TRACKING SCRIPTS (unchanged)
  // ═══════════════════════════════════════════════════════════

  return (
    <>
      {gtmEnabled && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer',${JSON.stringify(settings.gtm.containerId)});`}
          </Script>
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(settings.gtm.containerId)}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {googleLoaderId && (
        <>
          <Script
            id="google-tag-bootstrap"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleLoaderId)}`}
          />
          <Script id="google-tag-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());${googleIds
              .map(
                (id) =>
                  `gtag('config',${JSON.stringify(id)},{send_page_view:false${stapeUrl ? `,server_container_url:${JSON.stringify(stapeUrl)}` : ""}});`,
              )
              .join("")}`}
          </Script>
        </>
      )}

      {pixelEnabled && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          onReady={flushPixelPageViews}
        >
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init',${JSON.stringify(settings.metaPixel.pixelId)});`}
        </Script>
      )}

      {/* ══════════════════════════════════════════════════════════
          BANNER — shows when no consent saved yet
          Compact floating card, bottom-right on desktop
          Bottom-aligned near-full-width on mobile
      ══════════════════════════════════════════════════════════ */}
      {loaded && !consent && !modalOpen && (
        <div
          className={`fixed bottom-3 left-3 right-3 z-[100] mx-auto max-w-[420px] transition-all duration-300 ease-out motion-reduce:transition-none sm:bottom-6 sm:left-auto sm:right-6 sm:w-[420px] ${
            bannerVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            {/* Header row */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F3056D]/10">
                <svg
                  className="h-5 w-5 text-[#F3056D]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  />
                  <circle cx="8.5" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="13" r="0.5" fill="currentColor" stroke="none" />
                  <circle cx="10" cy="14.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-[#1F2937]">
                  Your Privacy Matters
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  We use cookies to improve your learning experience, understand
                  website usage, and personalize relevant content. You can choose
                  which cookies to allow.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={openModal}
                className="text-sm font-medium text-slate-500 underline-offset-2 transition-colors hover:text-[#214187] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30 focus-visible:ring-offset-2 sm:mr-auto"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={() => saveConsent({ analytics: false, marketing: false })}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30 focus-visible:ring-offset-2"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={() => saveConsent({ analytics: true, marketing: true })}
                className="rounded-lg bg-[#F3056D] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d90461] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30 focus-visible:ring-offset-2"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PREFERENCES MODAL — accessible dialog with focus trap
      ══════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          className={`fixed inset-0 z-[200] flex items-end justify-center p-0 transition-opacity duration-200 ease-out motion-reduce:transition-none sm:items-center sm:p-4 ${
            modalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Cookie preferences"
            className={`relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl transition-all duration-200 ease-out motion-reduce:transition-none sm:rounded-2xl sm:p-6 ${
              modalVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0 sm:translate-y-0 sm:scale-95"
            }`}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30"
              aria-label="Close cookie preferences"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal header */}
            <div className="mb-5 pr-8">
              <h2 className="text-lg font-bold text-[#1F2937]">
                Cookie Preferences
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Manage which cookies you allow. Strictly necessary cookies cannot
                be disabled — they are required for the website to function.
              </p>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              {/* Strictly Necessary */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-[#214187]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152A11.94 11.94 0 0112 2.25z"
                        />
                      </svg>
                      <h3 className="text-sm font-semibold text-[#1F2937]">
                        Strictly Necessary
                      </h3>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Required for the website to function. These cookies enable
                      core features like navigation and security. They cannot be
                      disabled.
                    </p>
                  </div>
                  <ConsentToggle
                    checked={true}
                    onChange={() => {}}
                    disabled={true}
                    label="Strictly necessary cookies — always enabled"
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-400">
                  Always enabled
                </p>
              </div>

              {/* Analytics */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-[#214187]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                        />
                      </svg>
                      <h3 className="text-sm font-semibold text-[#1F2937]">
                        Analytics Cookies
                      </h3>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Help us understand website traffic and usage patterns. This
                      data is used to improve performance and user experience.
                    </p>
                  </div>
                  <ConsentToggle
                    checked={draftConsent.analytics}
                    onChange={(v) =>
                      setDraftConsent((prev) => ({ ...prev, analytics: v }))
                    }
                    label="Analytics cookies"
                  />
                </div>
              </div>

              {/* Marketing */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-[#214187]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6H3.75m13.5 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h3.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0"
                        />
                      </svg>
                      <h3 className="text-sm font-semibold text-[#1F2937]">
                        Marketing Cookies
                      </h3>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Used for advertising measurement and personalization. These
                      cookies help measure the effectiveness of marketing campaigns.
                    </p>
                  </div>
                  <ConsentToggle
                    checked={draftConsent.marketing}
                    onChange={(v) =>
                      setDraftConsent((prev) => ({ ...prev, marketing: v }))
                    }
                    label="Marketing cookies"
                  />
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  saveConsent({ analytics: false, marketing: false })
                }
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30 focus-visible:ring-offset-2"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={() =>
                  saveConsent({ analytics: true, marketing: true })
                }
                className="rounded-lg border border-[#F3056D]/30 bg-[#F3056D]/5 px-4 py-2 text-sm font-semibold text-[#F3056D] transition-colors hover:bg-[#F3056D]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30 focus-visible:ring-offset-2"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => saveConsent(draftConsent)}
                className="rounded-lg bg-[#F3056D] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d90461] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30 focus-visible:ring-offset-2"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          FLOATING BUTTON — shows when consent already given
          Allows reopening preferences modal
      ══════════════════════════════════════════════════════════ */}
      {loaded && consent && !modalOpen && (
        <button
          type="button"
          onClick={openModal}
          className="fixed bottom-3 left-3 z-[99] flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-lg transition-all hover:bg-slate-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30 focus-visible:ring-offset-2 motion-reduce:transition-none sm:bottom-5 sm:left-5"
          aria-label="Open cookie preferences"
        >
          <svg
            className="h-3.5 w-3.5 text-[#F3056D]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            />
          </svg>
          Cookie preferences
        </button>
      )}
    </>
  );
}