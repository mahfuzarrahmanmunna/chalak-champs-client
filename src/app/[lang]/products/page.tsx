// src/app/[lang]/products/page.tsx

import React from "react";
import ProductsContent from "./ProductsContent";

export const metadata = {
  title: "Products - Chalak Champs | Books & Merchandise",
  description:
    "Get KIDS' অনর্গল ENGLISH book, eBook, T-shirts, school bags and stationary from Chalak Champs.",
  keywords: "Chalak Champs products, Kids English book, অনর্গল English",
  openGraph: {
    title: "Products - Chalak Champs",
    description:
      "Get KIDS' অনর্গল ENGLISH book, eBook, T-shirts, bags and stationary from Chalak Champs.",
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

// Required for output: export
export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "bn" }];
}

const ProductsPage = () => {
  return <ProductsContent />;
};

export default ProductsPage;
