import React from "react";
import AboutUsContent from "./AboutUsContent";

// --- SEO METADATA ---
export const metadata = {
  title: "About Us - Chalak Champs | Empowering Kids English",
  description:
    "Learn about Chalak Champs. We are an interactive platform making English learning fun for kids through games, stories, and expert guidance.",
  keywords: [
    "English for kids",
    "Learn English",
    "Chalak Champs About",
    "Kids Education",
    "Spoken English",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chalakchamps.vercel.app/about-us", // Update with your actual domain
    siteName: "Chalak Champs",
    title: "About Us - Chalak Champs | Empowering Kids English",
    description:
      "Learn about Chalak Champs. We are an interactive platform making English learning fun for kids through games, stories, and expert guidance.",
    images: [
      {
        url: "/icon.png", // Or your OG image
        width: 1200,
        height: 630,
        alt: "Chalak Champs About Us",
      },
    ],
  },
};

const AboutUs = () => {
  return (
<>
<AboutUsContent/>
</>
  );
};

export default AboutUs;
