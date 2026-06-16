import CourseModulesClient from "./CourseModulesClient";

// 1. Keep generateStaticParams as before
export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${apiUrl}/api/courses`);
    const data = await res.json();

    return data.data.map((course: any) => ({
      id: course._id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for courses:", error);
    return [];
  }
}

// 2. Make the component 'async'
// 3. Update the type to Promise<{ ... }>
export default async function CourseEditorPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  await params;

  return <CourseModulesClient />;
}
