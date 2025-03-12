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
};

export default nextConfig;
