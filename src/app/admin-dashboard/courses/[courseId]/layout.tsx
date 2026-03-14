import { Metadata } from "next";
import ManageCourseClient from "./page"; // Renamed the client component above to this
import api from "@/lib/api";

// This function runs on the server to fetch initial data for SEO
async function getCourse(id: string) {
  try {
    const res = await api.get(`/api/courses/${id}`);
    return res.data.data;
  } catch (error) {
    return null;
  }
}

// Generate Metadata based on the course
export async function generateMetadata({
  params,
}: {
  params: { courseId: string };
}): Promise<Metadata> {
  const course = await getCourse(params.courseId);

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: `Manage: ${course.title} | Admin Dashboard`,
    description: `Manage modules and content for ${course.title}. Schedule publishing times and organize course structure.`,
    robots: {
      index: false, // Admin pages should not be indexed
      follow: false,
    },
  };
}

export default function ManageCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
