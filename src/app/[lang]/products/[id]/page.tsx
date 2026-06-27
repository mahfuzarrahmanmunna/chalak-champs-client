// src/app/[lang]/products/[id]/page.tsx

import React from "react";
import ProductDetailsContent from "./ProductDetailsContent";

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

// Required for output: export — generate all lang + id combinations
export function generateStaticParams() {
  const langs = ["en", "bn"];
  const ids = ["1", "2", "3", "4"];

  return langs.flatMap((lang) =>
    ids.map((id) => ({
      lang,
      id,
    })),
  );
}

const ProductDetailsPage = () => {
  return <ProductDetailsContent />;
};

export default ProductDetailsPage;
