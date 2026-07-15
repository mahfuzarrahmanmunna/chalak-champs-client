const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function fetchHeroData(lang: "en" | "bn") {
  try {
    const res = await fetch(`${API_BASE}/api/hero/${lang}`, {
      cache: "no-store",
    });
    const data = await res.json();
    if (data.success && data.data) return data.data;
    return null;
  } catch (error) {
    return null;
  }
}

// Old JSON function (Keep if used elsewhere, or delete)
export async function upsertHeroData(payload: any) {
  const res = await fetch(`${API_BASE}/api/hero`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// NEW: FormData function for File Uploads
export async function upsertHeroFormData(formData: FormData) {
  const res = await fetch(`${API_BASE}/api/hero`, {
    method: "POST",
    body: formData, // Do NOT set Content-Type header, browser sets it with boundary automatically
  });
  return res.json();
}
