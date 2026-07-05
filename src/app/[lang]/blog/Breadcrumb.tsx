// src/app/blog/Breadcrumb.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  return (
    <nav
      className="flex items-center space-x-2 text-sm mb-6"
      aria-label="Breadcrumb"
    >
      <Link href="/" className="hover:underline">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-500">Blog</span>
    </nav>
  );
}
