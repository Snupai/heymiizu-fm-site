/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["snupais-mac-mini.tail26dbaa.ts.net"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/attachments/**",
      },
      {
        protocol: "https",
        hostname: "cdn-prod-ccv.adobe.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rlawubu0ke.ufs.sh",
        pathname: "/**",
      },
      // UploadThing/UTFS common hosts
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tmimqoublwvlnywfigww.supabase.co",
        pathname: "/**",
      },
    ],
  },
  // Vercel injects a build adapter and does not consume the standalone folder.
  // Next.js 16.3 currently fails when both features are enabled together.
  output: process.env.VERCEL ? undefined : "standalone",
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/#contact",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "/#work",
        permanent: true,
      },
      {
        source: "/projects/:path*",
        destination: "/#work",
        permanent: true,
      },
      {
        source: "/style-guide",
        destination: "/",
        permanent: true,
      },
    ];
  },
  // Add headers for video files to support range requests, CORS, and proper MIME types
  async headers() {
    return [
      {
        source: "/:path*\\.mp4",
        headers: [
          {
            key: "Content-Type",
            value: "video/mp4",
          },
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, HEAD, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Range",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.webm",
        headers: [
          {
            key: "Content-Type",
            value: "video/webm",
          },
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, HEAD, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Range",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.ogg",
        headers: [
          {
            key: "Content-Type",
            value: "video/ogg",
          },
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, HEAD, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Range",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
