import CareerContent from "./CareerContent";

// SEO Metadata
export const metadata = {
  title: "Careers at Chalak Champs | Join Our Mission to Educate",
  description:
    "Explore career opportunities at Chalak Champs. We are hiring passionate educators, developers, and marketers to help students master new languages. Join our dynamic team in Dhaka or remote.",
  keywords:
    "Chalak Champs careers, teaching jobs Bangladesh, edtech jobs, remote education jobs, English instructor jobs, software developer jobs Dhaka",
  openGraph: {
    title: "Careers at Chalak Champs",
    description:
      "Join the Chalak Champs team and help shape the future of language education.",
    url: "https://chalakchamps.com/career",
    siteName: "Chalak Champs",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Team meeting at Chalak Champs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at Chalak Champs",
    description: "Find your next role at Chalak Champs. We are hiring!",
    images: [
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

const CareerPage = () => {
  return <CareerContent />;
};

export default CareerPage;
