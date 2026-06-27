// src/app/[lang]/dashboard/products/page.tsx

import ProductsClient from "./ProductsClient";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "bn" }];
}

export default function ProductsPage() {
  return <ProductsClient />;
}
