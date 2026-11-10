// Server-side data helpers.
// Fetches are `no-store`, so pages always render with live data from the API
// (the page is rendered on every request on Cloudflare Workers).

export const LANGS = ["en", "bn"] as const;

export function getApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://chalakchampsbackend.vercel.app"
  )
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

export async function fetchStatic<T = any>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getApiBase()}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Cross product of languages x slugs for generateStaticParams. */
export function withLangs(slugs: (string | undefined | null)[]) {
  const unique = Array.from(new Set(slugs.filter(Boolean) as string[]));
  return LANGS.flatMap((lang) => unique.map((slug) => ({ lang, slug })));
}
