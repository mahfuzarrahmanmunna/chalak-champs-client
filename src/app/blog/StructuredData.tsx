// src/app/blog/StructuredData.tsx
export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Chalak Champs Blog",
    description:
      "Tips, resources, and insights to help you master the English language",
    url: "https://yourdomain.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Chalak Champs",
      logo: {
        "@type": "ImageObject",
        url: "https://yourdomain.com/logo.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
