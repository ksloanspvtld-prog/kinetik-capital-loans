/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ images.remotePatterns (replaces deprecated domains)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // ✅ Compress responses
  compress: true,

  // ✅ Security – remove X-Powered-By header
  poweredByHeader: false,

  // ✅ React Strict Mode
  reactStrictMode: true,

  // ✅ Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Experimental features
  experimental: {
    optimizeCss: true,
  },

  // ✅ Empty turbopack config to silence the error
  turbopack: {},

  // ✅ Webpack fallbacks (this will only be used when --webpack flag is passed)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },

  // ✅ Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;