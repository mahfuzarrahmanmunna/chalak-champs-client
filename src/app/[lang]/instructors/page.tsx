import React from "react";
import InstructorContentPage from "./InstructorContentPage";

export const metadata = {
  title: "Contact Us - Chalak Champs | Support & Inquiries",
  description:
    "Have questions about our English courses? Contact the Chalak Champs support team. We are here to help you with enrollment, technical issues, and general inquiries.",
  keywords:
    "contact Chalak Champs, instructor, teacher, Instructor, Teacher, English course inquiry, help desk, contact form",
  openGraph: {
    title: "Instructor - Chalak Champs",
    description:
      "Have questions? Contact the Chalak Champs support team. We are here to help you.",
    url: "https://chalakchamps.com/instructor",
    images: [
      {
        url: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Contact Chalak Champs",
      },
    ],
  },
};

const InstructorsPage = () => {
  return <InstructorContentPage />;
};

export default InstructorsPage;
