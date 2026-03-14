// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "randomuser.me",
      "images.unsplash.com",
      "plus.unsplash.com",
      // You can also add it here if you prefer, but remotePatterns is preferred:
      // "i.ibb.co.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.firebasestorage.app",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // --- ADD THE CONFIGURATION BELOW ---
      {
        protocol: "https",
        hostname: "i.ibb.co.com", // Added based on the exact error message
      },
      // Standard ImgBB domain (in case the URL is actually a typo for i.ibb.co)
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
};

module.exports = nextConfig;
