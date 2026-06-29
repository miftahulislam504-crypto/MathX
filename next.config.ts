import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Turbopack config (Next.js 16 default)
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },

  transpilePackages: ['three'],
}

export default nextConfig
