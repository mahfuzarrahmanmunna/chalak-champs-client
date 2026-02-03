// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "randomuser.me",
      "images.unsplash.com",
      "plus.unsplash.com", // Sometimes Unsplash uses this CDN
    ],
  },
};

module.exports = nextConfig;
