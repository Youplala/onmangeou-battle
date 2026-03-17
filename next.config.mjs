/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/onmangeou-battle',
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;