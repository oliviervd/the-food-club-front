import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    reactCompiler: false,
    optimizePackageImports: ['@mui/material', '@mui/icons-material']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd3nidktcupd88v.cloudfront.net',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  productionBrowserSourceMaps: false,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add the @payload-config alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@payload-config': path.resolve(__dirname, 'payload.config.ts'),
    }

    // Handle node: protocol imports
    config.resolve.fallback = {
      ...config.resolve.fallback,
      assert: false,
    }

    return config
  },

}

export default withPayload(nextConfig)