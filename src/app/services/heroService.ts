const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

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

export async function upsertHeroData(payload: any) {
  const res = await fetch(`${API_BASE}/api/hero`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
