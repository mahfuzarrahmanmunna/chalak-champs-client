import React from "react";
import ProductDetailsContent from "./ProductDetailsContent";
import { getProducts } from "../productData";

export function generateStaticParams(): { lang: string; id: string }[] {
  const products = getProducts(false);

  return products.flatMap((product) => [
    { lang: "en", id: String(product.id) },
    { lang: "bn", id: String(product.id) },
  ]);
}

export const metadata = {
  title: "Product Details - Chalak Champs",
  description: "View product details from Chalak Champs.",
};

const ProductDetailsPage = () => {
  return <ProductDetailsContent />;
};

export default ProductDetailsPage;
