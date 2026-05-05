/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed output: "export" because the app contains dynamic routes that cannot
  // be fully statically exported without complete generateStaticParams data.
  // For Vercel deployments, the default server-enabled output is preferred.

  images: {
    unoptimized: true, // Using default optimization
    remotePatterns: [
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },
};

export default nextConfig;
