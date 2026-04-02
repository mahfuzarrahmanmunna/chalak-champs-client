// src/app/blog/[slug]/page.tsx

import { blogPosts } from "../../../../data/blogData";
import BlogDetailsPage from "./BlogDetails";

// This function tells Next.js which paths to pre-render at build time.
// Required when using "output: export" with dynamic routes.
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// The Server Component entry point
export default function Page() {
  return <BlogDetailsPage />;
}
