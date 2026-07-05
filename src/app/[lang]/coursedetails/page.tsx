import CourseDetails from "./CourseDetails";
import CoursesDetails from "./CoursesDetails";

export const metadata = {
  title: "Course Details - Kids Fluent English Course",
  description:
    "Fluent English speaking with correct pronunciation and Basic Grammar, starting from absolute zero, online Kids Fluent English Course in Bangladesh.",
  openGraph: {
    title: "Course Details - Kids Fluent English Course",
    description:
      "Fluent English speaking with correct pronunciation and Basic Grammar, starting from absolute zero, online Kids Fluent English Course in Bangladesh.",
    url: "https://chalakchamps.com/coursedetails",
    siteName: "Chalak Champs",
    images: [
      {
        url: "https://chalakchamps.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Course Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Course Details - Kids Learning",
    description: "Join our amazing courses for kids.",
    images: ["https://chalakchamps.com/og-image.jpg"],
  },
};

export default function Page() {
  return <CoursesDetails />;
}
