// src/app/blog/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title:
    "Chalak Champs Blog - Tips, Resources, and Insights for English Learners",
  description:
    "Explore the Chalak Champs Blog for expert tips, resources, and insights to help you master the English language. From learning strategies to grammar advice, our blog is your go-to source for all things English learning.",
  keywords:
    "English learning, blog, tips, resources, grammar, vocabulary, speaking, IELTS, business English",
  openGraph: {
    title:
      "Chalak Champs Blog - Tips, Resources, and Insights for English Learners",
    description:
      "Explore the Chalak Champs Blog for expert tips, resources, and insights to help you master the English language.",
    type: "website",
    url: "https://yourdomain.com/blog",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Chalak Champs Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Chalak Champs Blog - Tips, Resources, and Insights for English Learners",
    description:
      "Explore the Chalak Champs Blog for expert tips, resources, and insights to help you master the English language.",
    images: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
