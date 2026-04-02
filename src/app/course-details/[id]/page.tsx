// src/app/course-details/[id]/page.tsx

// import { coursesData } from "@/data/coursesData";
import { coursesData } from "../../../../data/coursesData";
import CourseDetails from "./CourseDetails";

// This function is REQUIRED for static exports (output: 'export')
// It tells Next.js which IDs exist so it can generate HTML for them.
export function generateStaticParams() {
  return coursesData.map((course) => ({
    id: course.id,
  }));
}

// This is the default export for the page route
export default function Page() {
  return <CourseDetails />;
}
