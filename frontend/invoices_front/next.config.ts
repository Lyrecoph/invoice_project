import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.DJANGO_BASE_URL,
  },
};

export default nextConfig;
