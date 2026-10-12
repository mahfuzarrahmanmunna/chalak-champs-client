export interface TrackingSettings {
  gtm: {
    enabled: boolean;
    containerId: string;
  };
  ga4: {
    enabled: boolean;
    measurementId: string;
  };
  metaPixel: {
    enabled: boolean;
    pixelId: string;
  };
  googleAds: {
    enabled: boolean;
    conversionId: string;
    purchaseLabel: string;
  };
  serverSide: {
    enabled: boolean;
    stapeContainerUrl: string;
  };
}

export interface TrackingConsent {
  analytics: boolean;
  marketing: boolean;
}

export const TRACKING_CONSENT_KEY = "chalak-tracking-consent";

export const DEFAULT_TRACKING_SETTINGS: TrackingSettings = {
  gtm: { enabled: false, containerId: "" },
  ga4: { enabled: false, measurementId: "" },
  metaPixel: { enabled: false, pixelId: "" },
  googleAds: { enabled: false, conversionId: "", purchaseLabel: "" },
  serverSide: { enabled: false, stapeContainerUrl: "" },
};

export function normalizeTrackingSettings(value: unknown): TrackingSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return DEFAULT_TRACKING_SETTINGS;
  }
  const source = value as Record<string, unknown>;
  const section = (key: keyof TrackingSettings) => {
    const value = source[key];
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  };
  const text = (value: unknown) => (typeof value === "string" ? value : "");

  const gtm = section("gtm");
  const ga4 = section("ga4");
  const metaPixel = section("metaPixel");
  const googleAds = section("googleAds");
  const serverSide = section("serverSide");
  return {
    gtm: { enabled: gtm.enabled === true, containerId: text(gtm.containerId) },
    ga4: {
      enabled: ga4.enabled === true,
      measurementId: text(ga4.measurementId),
    },
    metaPixel: {
      enabled: metaPixel.enabled === true,
      pixelId: text(metaPixel.pixelId),
    },
    googleAds: {
      enabled: googleAds.enabled === true,
      conversionId: text(googleAds.conversionId),
      purchaseLabel: text(googleAds.purchaseLabel),
    },
    serverSide: {
      enabled: serverSide.enabled === true,
      stapeContainerUrl: text(serverSide.stapeContainerUrl),
    },
  };
}

export function readTrackingConsent(): TrackingConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(TRACKING_CONSENT_KEY);
    if (!stored) return null;
    const value: unknown = JSON.parse(stored);
    if (
      !value ||
      typeof value !== "object" ||
      typeof (value as TrackingConsent).analytics !== "boolean" ||
      typeof (value as TrackingConsent).marketing !== "boolean"
    ) {
      return null;
    }
    return value as TrackingConsent;
  } catch {
    return null;
  }
}

export function hasTrackingConsent(category: keyof TrackingConsent): boolean {
  return readTrackingConsent()?.[category] === true;
}

export function pushTrackingEvent(
  event: string,
  parameters: Record<string, unknown> = {},
  category: keyof TrackingConsent = "analytics",
): boolean {
  const hasMarketingConsent = hasTrackingConsent("marketing");
  if (
    typeof window === "undefined" ||
    (!hasTrackingConsent(category) &&
      !(
        (event === "begin_checkout" || event === "sign_up") &&
        hasMarketingConsent
      ))
  ) {
    return false;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag ??= function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("event", event, parameters);

  if (event === "generate_lead" && category === "marketing") {
    window.fbq?.("track", "Lead");
  } else if (event === "begin_checkout" && hasMarketingConsent) {
    window.fbq?.("track", "InitiateCheckout");
  } else if (event === "sign_up" && hasMarketingConsent) {
    window.fbq?.("track", "CompleteRegistration");
  }
  return true;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}
