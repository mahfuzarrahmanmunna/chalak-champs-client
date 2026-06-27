// src/app/[lang]/admin-dashboard/courses/manage-lessons/[id]/page.tsx
// ⚠️ This file must ONLY contain the server component wrapper

import CourseModulesClient from "./CourseModulesClient";

export const dynamic = "force-dynamic";

export default function CourseEditorPage() {
  return <CourseModulesClient />;
}
