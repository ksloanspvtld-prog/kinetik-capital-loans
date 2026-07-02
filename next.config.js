/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 이미지 최적화
  images: {
    domains: ["images.unsplash.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // ✅ Compress responses
  compress: true,

  // ✅ 보안 – X-Powered-By header 제거
  poweredByHeader: false,

  // ✅ React Strict Mode
  reactStrictMode: true,

  // ✅ SWC Minify
  swcMinify: true,

  // ✅ Production에서 console.log 제거
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Experimental features
  experimental: {
    optimizeCss: true,
  },

  // ✅ Webpack fallbacks (서버사이드 모듈 방지)
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