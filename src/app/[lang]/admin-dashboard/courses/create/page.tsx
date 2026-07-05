import CoursesClient from "./CoursesClient";

// This function runs at BUILD TIME (Server Side)
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "bn" }];
}

// This component renders the Client Component
export default function CoursesPage() {
  return <CoursesClient />;
}
