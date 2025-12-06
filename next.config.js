/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Reduce development server polling and requests
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Reduce webpack polling frequency
      config.watchOptions = {
        poll: 1000, // Check for changes every 1 second instead of default
        aggregateTimeout: 300, // Delay before rebuilding after changes
      }
    }
    return config
  },
  // Optimize development experience
  experimental: {
    // Reduce hot reload sensitivity
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
  // Reduce unnecessary recompilations
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  }
}

module.exports = nextConfig
