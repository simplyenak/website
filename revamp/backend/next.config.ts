import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ['@payloadcms/plugin-cloud-storage'],
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // Disable static generation for admin routes to avoid React context issues
  serverExternalPackages: ['@swc/core', 'drizzle-kit', '@libsql/linux-x64-gnu', '@libsql/darwin-arm64', '@libsql/win32-x64-msvc'],
  experimental: {
    isrFlushToDisk: false,
  },
  // Skip prerendering system error pages that fail with React context
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
}

export default withPayload(nextConfig)
