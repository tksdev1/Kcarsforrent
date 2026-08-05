import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Fleet photos may be hosted anywhere (Cloudinary, Imgur, your own CDN).
    // Add the hostnames you actually use here, or drop files into /public/fleet.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
