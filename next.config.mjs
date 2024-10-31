/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  // Add runtime configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    runtime: 'nodejs',
  },
};

export default nextConfig;
