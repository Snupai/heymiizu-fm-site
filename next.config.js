/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import ReactComponentName from "react-scan/react-component-name/webpack"; 

/** @type {import('next').NextConfig} */
const nextConfig = {

  webpack: (config) => {
    config.plugins.push(ReactComponentName({}));
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/attachments/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-prod-ccv.adobe.com',
        pathname: '/**',
      },
    ],
  },
  // Configure output options
  output: 'standalone',
}

export default nextConfig
