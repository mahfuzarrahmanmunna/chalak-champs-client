import React from "react";
import ProductDetailsContent from "./ProductDetailsContent";

// ✅ Define the return type
export async function generateStaticParams(): Promise<
  { lang: string; id: string }[]
> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const products: any[] = data?.data || data || [];

    // ✅ Explicitly typed array
    const params: { lang: string; id: string }[] = [];

    products.forEach((product: any) => {
      if (product._id) {
        params.push({ lang: "en", id: String(product._id) });
        params.push({ lang: "bn", id: String(product._id) });
      }
    });

    return params;
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export const metadata = {
  title: "Product Details - Chalak Champs",
  description: "View product details from Chalak Champs.",
};

const ProductDetailsPage = () => {
  return <ProductDetailsContent />;
};

export default ProductDetailsPage;
