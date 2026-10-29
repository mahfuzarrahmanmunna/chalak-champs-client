// app/[lang]/admin-dashboard/users/teachers/edit/page.tsx

"use client";

import { Suspense } from "react";
import TeacherForm from "../TeacherForm";

export default function EditTeacherPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <TeacherForm mode="edit" />
    </Suspense>
  );
}