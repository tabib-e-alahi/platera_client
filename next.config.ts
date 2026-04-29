import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**"
      }
    ],
  },
  async rewrites() {
    return [
      {
        // Explicitly map auth requests
        source: "/api/auth/:path*",
        destination: process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/auth/:path*",
      },
      {
        // Explicitly map v1 API requests
        source: "/api/v1/:path*",
        destination: "https://platera-server-side.vercel.app/api/v1/:path*",
      },
    ];
  },
=======
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"res.cloudinary.com",
      },
      {
        protocol:"https",
        hostname:"plus.unsplash.com",
      },
      {
        protocol:"https",
        hostname:"**"
      }
    ],
  }
>>>>>>> dc5656236feee959b1e0e891718009336b905842
};

export default nextConfig;
