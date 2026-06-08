import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Restrict server actions to your own origin only
      allowedOrigins: [
        'localhost:3000',
        // Add your production domain here, e.g. 'leadforge-ai.vercel.app'
      ],
    },
  },

  images: {
    // Restrict to specific trusted external image hosts
    remotePatterns: [
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  async headers() {
    return [
      // ── API routes: restrict CORS to same origin ────────────────────────
      {
        source: '/api/:path*',
        headers: [
          // Do NOT set Access-Control-Allow-Origin: * — that lets any site call your API
          // Only allow same-origin or explicit trusted origins
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
          // Prevent caching of API responses by default
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },

      // ── All pages: security hardening headers ───────────────────────────
      {
        source: '/:path*',
        headers: [
          // HTTP Strict Transport Security (forces HTTPS for 1 year)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Legacy XSS filter (belt-and-suspenders)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Control referrer information
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser features
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          // DNS prefetch control
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },

  // Disable powered-by header (info disclosure)
  poweredByHeader: false,

  // Compress responses
  compress: true,
};

export default nextConfig;
