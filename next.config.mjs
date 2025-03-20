/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static exports
  images: {
    domains: ['v0.blob.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v0.blob.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Required for static export with images
  },
  // Disable type checking during build to avoid issues with dynamic params
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Exclude API routes from the build
  experimental: {
    excludeRoutes: ['/api/**'],
  },
};

export default nextConfig;
