import React from "react";
import OurInstructors from "./OurInstructors";

export const metadata = {
  title: "Our Instructors - Chalak Champs",
  description:
    "Meet the dedicated team of instructors at Chalak Champs. Experts in English, Art, and child development ready to guide your child.",
  keywords:
    "instructors, teachers, Chalak Champs team, English experts, art teachers",
  openGraph: {
    title: "Our Instructors - Chalak Champs",
    description: "Meet the team dedicated to building your child's future.",
    url: "https://chalakchamps.com/our-instructor",
    images: [
      {
        url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Chalak Champs Instructors",
      },
    ],
  },
};

const InstructorPage = () => {
  return <OurInstructors />;
};

export default InstructorPage;
