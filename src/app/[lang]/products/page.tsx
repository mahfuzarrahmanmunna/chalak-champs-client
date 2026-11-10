// src/app/[lang]/products/page.tsx
import { Metadata } from "next";
import ProductsContent from "./ProductsContent";

type PageProps = {
  params: Promise<{ lang: string }>;
};

// Server-rendered on every request so data is always live.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isBangla = lang === "bn";

  return {
    title: isBangla
      ? "প্রোডাক্টস - চালাক চ্যাম্পস | বই ও মার্চেন্ডাইজ"
      : "Products - Chalak Champs | Books & Merchandise",
    description: isBangla
      ? "চালাক চ্যাম্পস থেকে KIDS' অনর্গল ENGLISH বই, ই-বুক, টি-শার্ট, স্কুল ব্যাগ ও স্টেশনারি সংগ্রহ করুন।"
      : "Get KIDS' অনর্গল ENGLISH book, eBook, T-shirts, school bags and stationery from Chalak Champs.",
    keywords: "Chalak Champs products, Kids English book, অনর্গল English",
    openGraph: {
      title: isBangla
        ? "প্রোডাক্টস - চালাক চ্যাম্পস"
        : "Products - Chalak Champs",
      description: isBangla
        ? "চালাক চ্যাম্পস থেকে বই, ই-বুক, টি-শার্ট, ব্যাগ ও স্টেশনারি সংগ্রহ করুন।"
        : "Get books, eBooks, T-shirts, bags and stationery from Chalak Champs.",
      url: "https://chalakchamps.com/products",
      images: [
        {
          url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "Chalak Champs Products",
        },
      ],
    },
  };
}

export default async function ProductsPage({ params }: PageProps) {
  const { lang } = await params;
  return <ProductsContent />;
}
