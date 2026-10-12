"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import {
  DEFAULT_TRACKING_SETTINGS,
  normalizeTrackingSettings,
  type TrackingSettings,
} from "@/lib/trackingSettings";

type TrackingFieldErrors = Record<string, string>;

const cloneSettings = (settings: TrackingSettings): TrackingSettings =>
  JSON.parse(JSON.stringify(settings)) as TrackingSettings;

function validateSettings(settings: TrackingSettings): TrackingFieldErrors {
  const errors: TrackingFieldErrors = {};
  const validateId = (
    enabled: boolean,
    value: string,
    pattern: RegExp,
    field: string,
  ) => {
    if (enabled && !value.trim()) {
      errors[field] = "Required when this integration is enabled.";
    } else if (value && !pattern.test(value.trim())) {
      errors[field] = "Enter a valid identifier.";
    }
  };

  validateId(settings.gtm.enabled, settings.gtm.containerId, /^GTM-[A-Z0-9]+$/, "gtm.containerId");
  validateId(settings.ga4.enabled, settings.ga4.measurementId, /^G-[A-Z0-9]+$/, "ga4.measurementId");
  validateId(settings.metaPixel.enabled, settings.metaPixel.pixelId, /^\d{5,20}$/, "metaPixel.pixelId");
  validateId(settings.googleAds.enabled, settings.googleAds.conversionId, /^AW-\d{6,20}$/, "googleAds.conversionId");
  if (settings.googleAds.enabled && !settings.googleAds.purchaseLabel.trim()) {
    errors["googleAds.purchaseLabel"] = "Required when Google Ads is enabled.";
  } else if (
    settings.googleAds.purchaseLabel &&
    !/^[A-Za-z0-9_-]{1,150}$/.test(settings.googleAds.purchaseLabel.trim())
  ) {
    errors["googleAds.purchaseLabel"] = "Use letters, numbers, hyphens, or underscores.";
  }
  if (settings.serverSide.enabled && !settings.serverSide.stapeContainerUrl.trim()) {
    errors["serverSide.stapeContainerUrl"] =
      "Required when server-side tracking is enabled.";
  } else if (settings.serverSide.stapeContainerUrl) {
    try {
      const url = new URL(settings.serverSide.stapeContainerUrl.trim());
      const hostname = url.hostname.toLowerCase();
      if (
        url.protocol !== "https:" ||
        !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(
          hostname,
        ) ||
        /^\d+(?:\.\d+){3}$/.test(hostname) ||
        hostname.endsWith(".localhost") ||
        hostname.endsWith(".local") ||
        url.username ||
        url.password ||
        url.port ||
        url.search ||
        url.hash ||
        (url.pathname !== "/" && url.pathname !== "")
      ) {
        throw new Error("Invalid URL.");
      }
    } catch {
      errors["serverSide.stapeContainerUrl"] =
        "Enter a secure HTTPS hostname without credentials, a port, path, or query string.";
    }
  }
  return errors;
}

function IntegrationCard({
  title,
  description,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
          <span>{enabled ? "Enabled" : "Disabled"}</span>
          <input
            type="checkbox"
            role="switch"
            aria-label={`Enable ${title}`}
            checked={enabled}
            onChange={(event) => onToggle(event.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-[#F3056D] after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
        </label>
      </div>
      {enabled && <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>}
    </section>
  );
}

function TextField({
  label,
  help,
  placeholder,
  value,
  error,
  onChange,
}: {
  label: string;
  help: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        value={value}
        maxLength={300}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
        className={`mt-1.5 block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-[#F3056D] focus:ring-pink-100"
        }`}
      />
      <p id={`${id}-help`} className="mt-1.5 text-xs leading-5 text-slate-500">
        {help}
      </p>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function TrackingMarketingSettingsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const [draft, setDraft] = useState<TrackingSettings>(() =>
    cloneSettings(DEFAULT_TRACKING_SETTINGS),
  );
  const [saved, setSaved] = useState<TrackingSettings>(() =>
    cloneSettings(DEFAULT_TRACKING_SETTINGS),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [serverErrors, setServerErrors] = useState<TrackingFieldErrors>({});

  useEffect(() => {
    if (authLoading || !currentUser) return;

    let active = true;
    setLoading(true);
    api
      .get("/admin/tracking-settings")
      .then((response) => {
        const responseSettings = response.data?.settings;
        if (
          !responseSettings ||
          typeof responseSettings !== "object" ||
          Array.isArray(responseSettings)
        ) {
          throw new Error("The server returned invalid settings.");
        }
        const settings = normalizeTrackingSettings(responseSettings);
        if (active) {
          setDraft(cloneSettings(settings));
          setSaved(cloneSettings(settings));
          setLoadError("");
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message =
          error instanceof Error ? error.message : "Could not load settings.";
        setLoadError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, currentUser]);

  const clientErrors = useMemo(() => validateSettings(draft), [draft]);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const updateSection = <K extends keyof TrackingSettings>(
    section: K,
    value: Partial<TrackingSettings[K]>,
  ) => {
    setDraft((previous) => ({
      ...previous,
      [section]: { ...previous[section], ...value },
    }));
    setSaveMessage("");
    setSaveError("");
    setServerErrors({});
  };

  const resetChanges = () => {
    setDraft(cloneSettings(saved));
    setSaveMessage("");
    setSaveError("");
    setServerErrors({});
  };

  const saveChanges = async () => {
    const errors = validateSettings(draft);
    setServerErrors(errors);
    if (Object.keys(errors).length) {
      setSaveError("Please fix the highlighted fields before saving.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveMessage("");
    try {
      const response = await api.put("/admin/tracking-settings", {
        settings: draft,
      });
      const responseSettings = response.data?.settings;
      if (
        !responseSettings ||
        typeof responseSettings !== "object" ||
        Array.isArray(responseSettings)
      ) {
        throw new Error("The server returned invalid settings.");
      }
      const settings = normalizeTrackingSettings(responseSettings);
      setDraft(cloneSettings(settings));
      setSaved(cloneSettings(settings));
      setSaveMessage("Tracking settings saved successfully.");
    } catch (error: unknown) {
      const responseData = (
        error as {
          response?: {
            data?: { message?: string; errors?: TrackingFieldErrors };
          };
        }
      )?.response?.data;
      setServerErrors(responseData?.errors || {});
      setSaveError(
        responseData?.message || "Could not save settings. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-64 items-center justify-center" role="status">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#F3056D]" />
        <span className="sr-only">Loading tracking settings</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6" role="alert">
        <h1 className="text-2xl font-bold text-slate-900">Tracking / Marketing</h1>
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-[#F3056D] px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#F3056D]">
          System settings
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Tracking / Marketing
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Manage browser tracking integrations. Changes are applied after
          visitors have granted the matching cookie consent.
        </p>
      </header>

      <div className="space-y-4">
        <IntegrationCard
          title="Google Tag Manager"
          description="Load your GTM container after visitors accept both analytics and marketing cookies. Avoid configuring the same provider in GTM and in the direct integrations below to prevent duplicate events."
          enabled={draft.gtm.enabled}
          onToggle={(enabled) => updateSection("gtm", { enabled })}
        >
          <TextField
            label="GTM Container ID"
            help="Container IDs start with GTM- and contain letters or numbers."
            placeholder="GTM-XXXXXXX"
            value={draft.gtm.containerId}
            error={serverErrors["gtm.containerId"] || clientErrors["gtm.containerId"]}
            onChange={(containerId) => updateSection("gtm", { containerId })}
          />
        </IntegrationCard>

        <IntegrationCard
          title="Google Analytics 4"
          description="Browser-side GA4 page views and approved events load only after analytics consent."
          enabled={draft.ga4.enabled}
          onToggle={(enabled) => updateSection("ga4", { enabled })}
        >
          <TextField
            label="GA4 Measurement ID"
            help="Find this in your GA4 web data stream."
            placeholder="G-XXXXXXXXXX"
            value={draft.ga4.measurementId}
            error={serverErrors["ga4.measurementId"] || clientErrors["ga4.measurementId"]}
            onChange={(measurementId) => updateSection("ga4", { measurementId })}
          />
        </IntegrationCard>

        <IntegrationCard
          title="Meta Pixel"
          description="Meta Pixel loads only after marketing consent. Plain-text contact details are never sent."
          enabled={draft.metaPixel.enabled}
          onToggle={(enabled) => updateSection("metaPixel", { enabled })}
        >
          <TextField
            label="Meta Pixel ID"
            help="Use the numeric ID from Meta Events Manager."
            placeholder="123456789012345"
            value={draft.metaPixel.pixelId}
            error={serverErrors["metaPixel.pixelId"] || clientErrors["metaPixel.pixelId"]}
            onChange={(pixelId) => updateSection("metaPixel", { pixelId })}
          />
        </IntegrationCard>

        <IntegrationCard
          title="Google Ads"
          description="Google Ads loads only after marketing consent. The manual-payment form records a review request, not a confirmed purchase, so this app does not emit a purchase conversion from that form."
          enabled={draft.googleAds.enabled}
          onToggle={(enabled) => updateSection("googleAds", { enabled })}
        >
          <TextField
            label="Conversion ID"
            help="Google Ads conversion IDs start with AW-."
            placeholder="AW-XXXXXXXXX"
            value={draft.googleAds.conversionId}
            error={serverErrors["googleAds.conversionId"] || clientErrors["googleAds.conversionId"]}
            onChange={(conversionId) => updateSection("googleAds", { conversionId })}
          />
          <TextField
            label="Purchase Conversion Label"
            help="The label configured for your Google Ads purchase conversion."
            placeholder="AbCdEfGhIjKlMnOp"
            value={draft.googleAds.purchaseLabel}
            error={serverErrors["googleAds.purchaseLabel"] || clientErrors["googleAds.purchaseLabel"]}
            onChange={(purchaseLabel) => updateSection("googleAds", { purchaseLabel })}
          />
        </IntegrationCard>

        <IntegrationCard
          title="Server-side Tracking"
          description="When enabled, the Stape URL is configured as the Google tag server endpoint. Meta Conversions API events are not sent because the existing backend has no private CAPI credential/event endpoint."
          enabled={draft.serverSide.enabled}
          onToggle={(enabled) => updateSection("serverSide", { enabled })}
        >
          <TextField
            label="Stape Container URL"
            help="Use your custom HTTPS tagging subdomain, without a path or query string."
            placeholder="https://track.example.com"
            value={draft.serverSide.stapeContainerUrl}
            error={
              serverErrors["serverSide.stapeContainerUrl"] ||
              clientErrors["serverSide.stapeContainerUrl"]
            }
            onChange={(stapeContainerUrl) =>
              updateSection("serverSide", { stapeContainerUrl })
            }
          />
        </IntegrationCard>
      </div>

      <footer className="sticky bottom-0 z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/95 py-4 backdrop-blur">
        <div aria-live="polite" className="text-sm">
          {saveMessage && <span className="text-emerald-700">{saveMessage}</span>}
          {saveError && <span className="text-red-700">{saveError}</span>}
          {!saveMessage && !saveError && (
            <span className="text-slate-500">
              {isDirty ? "You have unsaved changes." : "All changes are saved."}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetChanges}
            disabled={!isDirty || saving}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Changes
          </button>
          <button
            type="button"
            onClick={saveChanges}
            disabled={!isDirty || saving}
            className="rounded-lg bg-[#F3056D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d90461] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </footer>
    </main>
  );
}
