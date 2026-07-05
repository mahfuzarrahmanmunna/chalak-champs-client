import React, { Suspense } from "react";
import ProductDetailsContent from "../[id]/ProductDetailsContent";

export const metadata = {
  title: "Product Details - Chalak Champs",
  description:
    "View product details, order books, bags, t-shirts and stationary from Chalak Champs.",
  openGraph: {
    title: "Product Details - Chalak Champs",
    description: "View product details from Chalak Champs.",
    url: "https://chalakchamps.com/products",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Chalak Champs Product",
      },
    ],
  },
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "bn" }];
}

// useSearchParams() requires a Suspense boundary in Next.js 14+
const ProductDetailsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-4 border-[#F3056D] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
};

export default ProductDetailsPage;
