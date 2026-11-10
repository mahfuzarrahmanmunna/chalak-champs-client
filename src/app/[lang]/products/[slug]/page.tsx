// src/app/[lang]/products/[slug]/page.tsx
import { Metadata } from "next";
import ProductDetailsClient from "./ProductDetailsClient";
import { fetchStatic } from "@/lib/staticApi";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

// Server-rendered on every request so data is always live.
export const dynamic = "force-dynamic";

async function getProductDataForSEO(slug: string) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://chalakchampsbackend.vercel.app";

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    const endpoint = isObjectId
      ? `${apiUrl}/api/products/${slug}`
      : `${apiUrl}/api/products/slug/${slug}`;

    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = await getProductDataForSEO(slug);
  const isBangla = lang === "bn";

  if (!product) {
    return {
      title: isBangla ? "পণ্য পাওয়া যায়নি" : "Product Not Found",
      description: isBangla
        ? "এই পণ্যটি পাওয়া যায়নি।"
        : "The requested product was not found.",
    };
  }

  const getLang = (obj: any, l: string): string => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[l] || "";
  };

  const title = getLang(product.title, lang) || product.title || "Product";
  const description =
    getLang(product.description, lang) || product.description || "";

  return {
    title,
    description: description.substring(0, 160),
    openGraph: {
      title,
      description: description.substring(0, 160),
      type: "website",
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { lang, slug } = await params;
  return <ProductDetailsClient lang={lang} slug={slug} />;
}
