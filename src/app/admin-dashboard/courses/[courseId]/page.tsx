// src/app/admin-dashboard/courses/[courseId]/page.tsx
import ManageCourseContent from "./ManageCourseContent";

// This is a Server Component wrapper
export default async function ManageCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <ManageCourseContent courseId={courseId} />;
}
