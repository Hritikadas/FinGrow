/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  // Optimize for Vercel deployment
  poweredByHeader: false,
  compress: true,
  // Handle static file serving
  trailingSlash: false
}

module.exports = nextConfig
