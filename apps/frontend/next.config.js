/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vibeguide/shared-types'],
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig