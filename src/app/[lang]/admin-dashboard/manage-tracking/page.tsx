"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  DEFAULT_TRACKING_SETTINGS,
  normalizeTrackingSettings,
  type TrackingSettings,
} from "@/lib/trackingSettings";

// ═════════════════════════════════════════════════════════════
//  VALIDATION (mirrors backend + TrackingAndConsent patterns)
// ═════════════════════════════════════════════════════════════

const PATTERNS = {
  gtmContainerId: /^GTM-[A-Z0-9]+$/,
  ga4MeasurementId: /^G-[A-Z0-9]+$/,
  metaPixelId: /^\d{5,20}$/,
  googleAdsConversionId: /^AW-\d{6,20}$/,
  googleAdsPurchaseLabel: /^[A-Za-z0-9_-]{1,150}$/,
} as const;

function isValidHttpsUrl(value: string): boolean {
  if (!value) return false;
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

interface FieldErrors {
  "gtm.containerId"?: string;
  "ga4.measurementId"?: string;
  "metaPixel.pixelId"?: string;
  "googleAds.conversionId"?: string;
  "googleAds.purchaseLabel"?: string;
  "serverSide.stapeContainerUrl"?: string;
  [key: string]: string | undefined;
}

function validateAllSettings(s: TrackingSettings): FieldErrors {
  const errors: FieldErrors = {};

  if (s.gtm.enabled) {
    const v = s.gtm.containerId.trim();
    if (!v) errors["gtm.containerId"] = "Container ID is required when GTM is enabled.";
    else if (!PATTERNS.gtmContainerId.test(v))
      errors["gtm.containerId"] = "Format must be GTM-XXXXXXX (uppercase letters and numbers).";
  }

  if (s.ga4.enabled) {
    const v = s.ga4.measurementId.trim();
    if (!v) errors["ga4.measurementId"] = "Measurement ID is required when GA4 is enabled.";
    else if (!PATTERNS.ga4MeasurementId.test(v))
      errors["ga4.measurementId"] = "Format must be G-XXXXXXXXXX (uppercase letters and numbers).";
  }

  if (s.metaPixel.enabled) {
    const v = s.metaPixel.pixelId.trim();
    if (!v) errors["metaPixel.pixelId"] = "Pixel ID is required when Meta Pixel is enabled.";
    else if (!PATTERNS.metaPixelId.test(v))
      errors["metaPixel.pixelId"] = "Pixel ID must be 5–20 digits.";
  }

  if (s.googleAds.enabled) {
    const id = s.googleAds.conversionId.trim();
    if (!id) errors["googleAds.conversionId"] = "Conversion ID is required when Google Ads is enabled.";
    else if (!PATTERNS.googleAdsConversionId.test(id))
      errors["googleAds.conversionId"] = "Format must be AW-XXXXXXXXX (digits after AW-).";

    const label = s.googleAds.purchaseLabel.trim();
    if (!label)
      errors["googleAds.purchaseLabel"] = "Purchase conversion label is required when Google Ads is enabled.";
    else if (!PATTERNS.googleAdsPurchaseLabel.test(label))
      errors["googleAds.purchaseLabel"] = "Only letters, numbers, hyphens, and underscores (max 150).";
  }

  if (s.serverSide.enabled) {
    const v = s.serverSide.stapeContainerUrl.trim();
    if (!v) errors["serverSide.stapeContainerUrl"] = "Stape Container URL is required when server-side tracking is enabled.";
    else if (!isValidHttpsUrl(v))
      errors["serverSide.stapeContainerUrl"] = "Must be a valid HTTPS URL without query parameters, fragments, or paths.";
  }

  return errors;
}

// Strip to comparable shape so metadata fields don't trigger false unsaved-changes
function toComparable(s: TrackingSettings): TrackingSettings {
  return {
    gtm: { enabled: s.gtm.enabled, containerId: s.gtm.containerId },
    ga4: { enabled: s.ga4.enabled, measurementId: s.ga4.measurementId },
    metaPixel: { enabled: s.metaPixel.enabled, pixelId: s.metaPixel.pixelId },
    googleAds: {
      enabled: s.googleAds.enabled,
      conversionId: s.googleAds.conversionId,
      purchaseLabel: s.googleAds.purchaseLabel,
    },
    serverSide: {
      enabled: s.serverSide.enabled,
      stapeContainerUrl: s.serverSide.stapeContainerUrl,
    },
  };
}

// ═════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3056D]/30 focus-visible:ring-offset-2 ${
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

function TextField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  disabled,
  autoComplete = "off",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
}) {
  const errorId = error ? `${label.replace(/\s+/g, "-").toLowerCase()}-error` : undefined;
  return (
    <div>
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className={`mb-1.5 block text-sm font-medium ${disabled ? "text-slate-400" : "text-slate-700"}`}
      >
        {label}
      </label>
      <input
        id={label.replace(/\s+/g, "-").toLowerCase()}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
            : "border-slate-300 focus:border-[#F3056D] focus:ring-2 focus:ring-[#F3056D]/10"
        } bg-white text-slate-900`}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}

function IntegrationCard({
  title,
  description,
  enabled,
  onToggle,
  toggleLabel,
  icon,
  consentNote,
  children,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  toggleLabel: string;
  icon: React.ReactNode;
  consentNote?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-xl border bg-white transition-colors ${
        enabled ? "border-[#F3056D]/30 shadow-sm" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
              enabled ? "bg-[#F3056D]/10 text-[#F3056D]" : "bg-slate-100 text-slate-400"
            }`}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            <p className="truncate text-xs text-slate-400">{description}</p>
          </div>
        </div>
        <Toggle checked={enabled} onChange={onToggle} label={toggleLabel} />
      </div>
      <div className={`p-4 md:p-5 ${enabled ? "" : "pointer-events-none opacity-50"}`}>
        {children}
        {consentNote && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 p-2.5">
            <svg
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708.708a.75.75 0 01-1.063-.852l.707-.708z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25z" />
            </svg>
            <p className="text-xs leading-5 text-slate-500">{consentNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function OverviewCard({
  title,
  enabled,
  configured,
  icon,
  description,
}: {
  title: string;
  enabled: boolean;
  configured: boolean;
  icon: React.ReactNode;
  description: string;
}) {
  const status = enabled && configured ? "ready" : enabled && !configured ? "incomplete" : "off";
  const statusConfig = {
    ready: { label: "Ready", badge: "bg-green-50 text-green-600", dot: "bg-green-500" },
    incomplete: { label: "Incomplete", badge: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
    off: { label: "Off", badge: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
  }[status];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3.5">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            enabled ? "bg-[#F3056D]/10 text-[#F3056D]" : "bg-slate-100 text-slate-400"
          }`}
        >
          {icon}
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusConfig.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </span>
      </div>
      <h4 className="mt-2.5 text-sm font-semibold text-slate-800">{title}</h4>
      <p className="mt-0.5 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "configured" | "partial" | "not-configured" }) {
  const config = {
    configured: {
      label: "Configured",
      className: "border-green-200 bg-green-50 text-green-700",
      dot: "bg-green-500",
    },
    partial: {
      label: "Partially configured",
      className: "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    "not-configured": {
      label: "Not configured",
      className: "border-slate-200 bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
    },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function Toast({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed bottom-4 right-4 z-[200]">
      <div
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all ${
          isSuccess ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
        }`}
      >
        {isSuccess ? (
          <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="h-5 w-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        )}
        <p className={`text-sm font-medium ${isSuccess ? "text-green-800" : "text-red-800"}`}>{message}</p>
        <button onClick={onClose} className="ml-1 text-slate-400 transition-colors hover:text-slate-600" aria-label="Dismiss">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  ICONS (inline SVG — no extra dependency)
// ═════════════════════════════════════════════════════════════

const IconGTM = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-3 3m0 0l3 3m-3-3h15a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m1.123 8.58a48.424 48.424 0 00-1.123-.08" />
  </svg>
);

const IconGA4 = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const IconMeta = (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.53-.46-1.06-.93-1.06-.48 0-.72.56-1.04 1.06-.25.39-.59.65-1.23.65h-1.4c-.48 0-.87-.39-.87-.87v-.8c0-1.1.9-2 2-2h.34c1.1 0 2-.9 2-2v-.34c0-.6.35-1.14.88-1.38A7.963 7.963 0 0120 12c0 2.4-1.06 4.55-2.73 6.39z" />
  </svg>
);

const IconAds = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.007.006M12 4v16" />
  </svg>
);

const IconServer = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.437 5.35A7.001 7.001 0 0112 2.25a7 7 0 016.563 1.1l1.537 1.2a4.5 4.5 0 01.9 2.7m-19.5 0v4.5m19.5-4.5v4.5" />
  </svg>
);

// ═════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═════════════════════════════════════════════════════════════

export default function ManageTrackingPage() {
  const router = useRouter();

  const [settings, setSettings] = useState<TrackingSettings>(DEFAULT_TRACKING_SETTINGS);
  const [savedSettings, setSavedSettings] = useState<TrackingSettings>(DEFAULT_TRACKING_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const isMountedRef = useRef(true);

  // ── Fetch current settings ──────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setFetchFailed(false);
    setError(null);
    try {
      const res = await api.get("/api/admin/tracking-settings");
      const data = res.data?.data ?? res.data?.settings;
      if (res.data?.success && data) {
        const normalized = normalizeTrackingSettings(data);
        setSettings(normalized);
        setSavedSettings(normalized);
      } else {
        throw new Error(res.data?.error || "Invalid response from server.");
      }
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { error?: string; message?: string } };
      };
      if (axiosErr.response?.status === 401) {
        router.push("/login");
        return;
      }
      setFetchFailed(true);
      setError(
        axiosErr.response?.data?.error ||
          axiosErr.response?.data?.message ||
          "Failed to load tracking settings.",
      );
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchSettings();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchSettings]);

  // ── Unsaved changes ─────────────────────────────────────────
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(toComparable(settings)) !== JSON.stringify(toComparable(savedSettings));
  }, [settings, savedSettings]);

  // ── beforeunload warning ────────────────────────────────────
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  // ── Client-side validation (computed) ───────────────────────
  const clientValidationErrors = useMemo(() => validateAllSettings(settings), [settings]);

  // Merge: backend field errors override client errors for display
  const displayErrors = useMemo(
    () => ({ ...clientValidationErrors, ...fieldErrors }),
    [clientValidationErrors, fieldErrors]
  );

  const hasValidationErrors = Object.keys(clientValidationErrors).length > 0;

  // ── Configuration status ───────────────────────────────────
  const configStatus = useMemo(() => {
    const enabledFlags = [
      settings.gtm.enabled,
      settings.ga4.enabled,
      settings.metaPixel.enabled,
      settings.googleAds.enabled,
      settings.serverSide.enabled,
    ];
    const count = enabledFlags.filter(Boolean).length;
    if (count === 0) return "not-configured" as const;
    if (count === enabledFlags.length) return "configured" as const;
    return "partial" as const;
  }, [settings]);

  // ── Field update ───────────────────────────────────────────
  const updateField = useCallback((path: string, value: unknown) => {
    setSettings((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as TrackingSettings;
      const keys = path.split(".");
      let obj: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
    // Clear both client and backend errors for this field
    setFieldErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  // ── Save ───────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    // Validate before sending
    const errors = validateAllSettings(settings);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setToast({ type: "error", message: "Please fix the validation errors before saving." });
      return;
    }

    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await api.put("/api/admin/tracking-settings", { settings });
      const data = res.data?.data ?? res.data?.settings;
      if (res.data?.success && data) {
        const normalized = normalizeTrackingSettings(data);
        setSettings(normalized);
        setSavedSettings(normalized);
        setToast({ type: "success", message: "Tracking settings saved successfully." });
      } else {
        throw new Error(res.data?.error || "Failed to save settings.");
      }
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number;
          data?: { error?: string; message?: string; errors?: Record<string, string> };
        };
      };

      if (axiosErr.response?.status === 401) {
        router.push("/login");
        return;
      }

      // Handle field-specific backend validation errors
      const backendErrors = axiosErr.response?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        const mapped: FieldErrors = {};
        for (const [key, value] of Object.entries(backendErrors)) {
          mapped[key] = String(value);
        }
        setFieldErrors(mapped);
      }

      const message =
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Failed to save tracking settings. Please try again.";
      setError(message);
      setToast({ type: "error", message });
    } finally {
      if (isMountedRef.current) setSaving(false);
    }
  }, [settings, router]);

  // ── Reset ───────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setSettings(JSON.parse(JSON.stringify(savedSettings)));
    setFieldErrors({});
    setError(null);
  }, [savedSettings]);

  // ── Overview helpers ────────────────────────────────────────
  const isConfigured = useCallback(
    (key: keyof TrackingSettings): boolean => {
      switch (key) {
        case "gtm":
          return !!settings.gtm.containerId.trim();
        case "ga4":
          return !!settings.ga4.measurementId.trim();
        case "metaPixel":
          return !!settings.metaPixel.pixelId.trim();
        case "googleAds":
          return !!settings.googleAds.conversionId.trim();
        case "serverSide":
          return !!settings.serverSide.stapeContainerUrl.trim();
        default:
          return false;
      }
    },
    [settings]
  );

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════

  // ── Loading skeleton ────────────────────────────────────────
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <div className="mb-6">
          <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
          <div className="mt-2 h-7 w-56 rounded-lg bg-slate-100 animate-pulse" />
          <div className="mt-2 h-4 w-80 rounded bg-slate-100 animate-pulse" />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg border border-slate-100 bg-slate-50 animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl border border-slate-100 bg-white animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state (fetch failed) ─────────────────────────────
  if (fetchFailed) {
    return (
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Unable to load settings</h2>
          <p className="mt-1 max-w-md text-center text-sm text-slate-500">{error}</p>
          <button
            onClick={fetchSettings}
            className="mt-4 flex items-center gap-2 rounded-lg bg-[#F3056D] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d90461]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.375h0m2.985-.375V9m-3.75 0V6m0 3v3m0 0v0m0 0h0m3.75 0h-3.75m0 0h-3.75m0 0V9m0 0V6m0 3v0" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0 7.5 7.5 0 00-15 0z" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main content ────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <nav className="mb-2 flex items-center gap-1.5 text-xs text-slate-400" aria-label="Breadcrumb">
          <span>Dashboard</span>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="font-medium text-slate-600">Tracking &amp; Marketing</span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 md:text-2xl">Tracking &amp; Marketing</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Manage analytics, advertising pixels, conversion tracking, and server-side measurement
              for your website. These settings control website tracking integrations.
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <StatusBadge status={configStatus} />
          </div>
        </div>
      </div>

      {/* ── Sticky Action Bar ────────────────────────────────── */}
      <div className="sticky top-0 z-20 -mx-4 mb-6 flex items-center justify-between border-b border-slate-100 bg-white/80 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          ) : (
            <span className="text-xs text-slate-400">All changes saved</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={!hasUnsavedChanges || saving}
            className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving || hasValidationErrors}
            className="flex items-center gap-2 rounded-lg bg-[#F3056D] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d90461] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Save tracking settings"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Integration Overview ─────────────────────────────── */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Integration Overview</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <OverviewCard
            title="GTM"
            enabled={settings.gtm.enabled}
            configured={isConfigured("gtm")}
            icon={IconGTM}
            description="Tag management"
          />
          <OverviewCard
            title="Google Analytics 4"
            enabled={settings.ga4.enabled}
            configured={isConfigured("ga4")}
            icon={IconGA4}
            description="Website analytics"
          />
          <OverviewCard
            title="Meta Pixel"
            enabled={settings.metaPixel.enabled}
            configured={isConfigured("metaPixel")}
            icon={IconMeta}
            description="Ad attribution"
          />
          <OverviewCard
            title="Google Ads"
            enabled={settings.googleAds.enabled}
            configured={isConfigured("googleAds")}
            icon={IconAds}
            description="Conversion tracking"
          />
          <OverviewCard
            title="Server-Side"
            enabled={settings.serverSide.enabled}
            configured={isConfigured("serverSide")}
            icon={IconServer}
            description="Stape container"
          />
        </div>
      </div>

      {/* ── Backend Error Banner ─────────────────────────────── */}
      {error && !fetchFailed && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <svg className="h-4 w-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ── Configuration Cards ──────────────────────────────── */}
      <div className="space-y-4">
        {/* Google Tag Manager */}
        <IntegrationCard
          title="Google Tag Manager"
          description="Container-based tag management system"
          enabled={settings.gtm.enabled}
          onToggle={(v) => updateField("gtm.enabled", v)}
          toggleLabel="Toggle Google Tag Manager"
          icon={IconGTM}
          consentNote="Requires both analytics and marketing consent from visitors. GTM loads only after both are granted."
        >
          <TextField
            label="GTM Container ID"
            value={settings.gtm.containerId}
            onChange={(v) => updateField("gtm.containerId", v)}
            placeholder="GTM-XXXXXXX"
            helperText="Found in GTM → Admin → Container → Container ID"
            error={displayErrors["gtm.containerId"]}
            disabled={!settings.gtm.enabled}
          />
        </IntegrationCard>

        {/* Google Analytics 4 */}
        <IntegrationCard
          title="Google Analytics 4"
          description="Website analytics and visitor measurement"
          enabled={settings.ga4.enabled}
          onToggle={(v) => updateField("ga4.enabled", v)}
          toggleLabel="Toggle Google Analytics 4"
          icon={IconGA4}
          consentNote="Requires analytics consent. Visitors must opt in to analytics tracking before GA4 loads."
        >
          <TextField
            label="GA4 Measurement ID"
            value={settings.ga4.measurementId}
            onChange={(v) => updateField("ga4.measurementId", v)}
            placeholder="G-XXXXXXXXXX"
            helperText="Found in GA4 → Admin → Data Streams → Measurement ID"
            error={displayErrors["ga4.measurementId"]}
            disabled={!settings.ga4.enabled}
          />
        </IntegrationCard>

        {/* Meta Pixel */}
        <IntegrationCard
          title="Meta Pixel"
          description="Facebook advertising attribution and conversion measurement"
          enabled={settings.metaPixel.enabled}
          onToggle={(v) => updateField("metaPixel.enabled", v)}
          toggleLabel="Toggle Meta Pixel"
          icon={IconMeta}
          consentNote="Requires marketing consent. Visitors must opt in to marketing tracking before the pixel loads."
        >
          <TextField
            label="Meta Pixel ID"
            value={settings.metaPixel.pixelId}
            onChange={(v) => updateField("metaPixel.pixelId", v)}
            placeholder="123456789012345"
            helperText="Found in Meta Events Manager → Pixel → Settings → ID"
            error={displayErrors["metaPixel.pixelId"]}
            disabled={!settings.metaPixel.enabled}
          />
        </IntegrationCard>

        {/* Google Ads */}
        <IntegrationCard
          title="Google Ads Conversion Tracking"
          description="Track conversions for Google Ads campaigns"
          enabled={settings.googleAds.enabled}
          onToggle={(v) => updateField("googleAds.enabled", v)}
          toggleLabel="Toggle Google Ads"
          icon={IconAds}
          consentNote="Requires marketing consent. Conversion events fire only after confirmed actions."
        >
          <div className="space-y-4">
            <TextField
              label="Google Ads Conversion ID"
              value={settings.googleAds.conversionId}
              onChange={(v) => updateField("googleAds.conversionId", v)}
              placeholder="AW-XXXXXXXXX"
              helperText="Found in Google Ads → Tools → Conversions → Tag setup"
              error={displayErrors["googleAds.conversionId"]}
              disabled={!settings.googleAds.enabled}
            />
            <TextField
              label="Purchase Conversion Label"
              value={settings.googleAds.purchaseLabel}
              onChange={(v) => updateField("googleAds.purchaseLabel", v)}
              placeholder="abc123XYZ"
              helperText="The conversion label for purchase or sign-up actions (optional)"
              error={displayErrors["googleAds.purchaseLabel"]}
              disabled={!settings.googleAds.enabled}
            />
          </div>
        </IntegrationCard>

        {/* Server-Side Tracking */}
        <IntegrationCard
          title="Server-Side Tracking"
          description="Route tracking data through a server-side container"
          enabled={settings.serverSide.enabled}
          onToggle={(v) => updateField("serverSide.enabled", v)}
          toggleLabel="Toggle Server-Side Tracking"
          icon={IconServer}
          consentNote="Configures server-side Google tagging. Private CAPI credentials are managed separately on the server."
        >
          <TextField
            label="Stape Container URL"
            value={settings.serverSide.stapeContainerUrl}
            onChange={(v) => updateField("serverSide.stapeContainerUrl", v)}
            placeholder="https://track.example.com"
            helperText="HTTPS URL of your Stape server-side GTM container. No query parameters, fragments, or paths."
            error={displayErrors["serverSide.stapeContainerUrl"]}
            disabled={!settings.serverSide.enabled}
          />
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-xs leading-5 text-amber-700">
              <span className="font-semibold">Security note:</span> Private credentials for Meta
              Conversions API or other server-side services must never be entered here. They are
              managed exclusively through server-side environment variables.
            </p>
          </div>
        </IntegrationCard>
      </div>

      {/* ── Bottom Action Bar (mobile) ────────────────────────── */}
      <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          onClick={handleReset}
          disabled={!hasUnsavedChanges || saving}
          className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset Changes
        </button>
        <button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || saving || hasValidationErrors}
          className="flex items-center gap-2 rounded-lg bg-[#F3056D] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d90461] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* ── Toast ────────────────────────────────────────────── */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}