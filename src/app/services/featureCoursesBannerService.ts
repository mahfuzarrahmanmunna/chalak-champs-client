// services/featureCoursesBannerService.ts

const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const API_BASE = rawApiBaseUrl.replace(/\/+$/, "");
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

// ---------- Types ----------

export interface FeatureCoursesBannerData {
  _id: string;
  lang: "en" | "bn";
  image: string;
  key: string;
  link: string;
  altText: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  message: string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ---------- Public: Get active banner ----------

export async function fetchFeatureCoursesBanner(
  lang: "en" | "bn",
): Promise<FeatureCoursesBannerData | null> {
  try {
    const res = await fetch(
      `${API_URL}/feature-courses-banner?lang=${lang}`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) return null;

    const json: ApiResponse<FeatureCoursesBannerData | null> = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error("[featureCoursesBannerService] Fetch error:", err);
    return null;
  }
}

// ---------- Admin: List all ----------

export async function listFeatureCoursesBanners(): Promise<
  FeatureCoursesBannerData[]
> {
  const res = await fetch(`${API_URL}/feature-courses-banner/admin/list`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json: ApiResponse<FeatureCoursesBannerData[]> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// ---------- Admin: Create (FormData) ----------

export async function createFeatureCoursesBanner(payload: {
  lang: "en" | "bn";
  imageFile: File;
  link: string;
  altText?: string;
  active?: boolean;
}): Promise<FeatureCoursesBannerData> {
  const formData = new FormData();
  formData.append("lang", payload.lang);
  formData.append("image", payload.imageFile);
  formData.append("link", payload.link);
  if (payload.altText) formData.append("altText", payload.altText);
  if (payload.active !== undefined)
    formData.append("active", String(payload.active));

  const res = await fetch(`${API_URL}/feature-courses-banner/admin`, {
    method: "POST",
    body: formData, // No Content-Type header! Browser sets it with boundary automatically
  });

  const json: ApiResponse<FeatureCoursesBannerData> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// ---------- Admin: Update (FormData) ----------

export async function updateFeatureCoursesBanner(
  id: string,
  payload: {
    lang?: "en" | "bn";
    imageFile?: File; // Optional: only include if changing the image
    link?: string;
    altText?: string;
    active?: boolean;
  },
): Promise<FeatureCoursesBannerData> {
  const formData = new FormData();

  if (payload.lang) formData.append("lang", payload.lang);
  if (payload.imageFile) formData.append("image", payload.imageFile);
  if (payload.link) formData.append("link", payload.link);
  if (payload.altText) formData.append("altText", payload.altText);
  if (payload.active !== undefined)
    formData.append("active", String(payload.active));

  const res = await fetch(
    `${API_URL}/feature-courses-banner/admin/${id}`,
    {
      method: "PUT",
      body: formData,
    },
  );

  const json: ApiResponse<FeatureCoursesBannerData> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// ---------- Admin: Delete ----------

export async function deleteFeatureCoursesBanner(
  id: string,
): Promise<FeatureCoursesBannerData> {
  const res = await fetch(
    `${API_URL}/feature-courses-banner/admin/${id}`,
    {
      method: "DELETE",
    },
  );

  const json: ApiResponse<FeatureCoursesBannerData> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}
