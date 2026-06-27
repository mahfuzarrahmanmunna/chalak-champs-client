// src/app/products/types.ts

export interface Product {
  id: number;
  title: string;
  category: string; // for filtering: "বই"/"Book", "পোশাক"/"Apparel", etc.
  subtitle: string; // display: "বই + ই-বুক"
  description: string;
  image: string;
  fee: string;
  badge?: string;
  highlights: string[];
  // Book-specific
  author?: string;
  pages?: string;
  publisher?: string;
  edition?: string;
  country?: string;
  language?: string;
  fullDescription?: string;
  fullDescriptionSecond?: string;
  features?: { icon: string; title: string; desc: string }[];
  whyPoints?: string[];
  specs?: { label: string; value: string }[];
}
