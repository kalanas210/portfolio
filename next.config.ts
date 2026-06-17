import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hosts allowed for next/image (hero images, etc.). Project thumbnails and
    // gallery media use plain <img>, so arbitrary URLs there always work.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Baseline security headers (defense-in-depth). Deliberately conservative — no
  // CSP yet, since the WebGL hero + inline styles would need careful allow-listing.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Force HTTPS for two years (incl. subdomains). The custom domain is
          // served over HTTPS via Cloudflare, so this is safe; it prevents
          // SSL-strip / protocol-downgrade attacks after the first visit.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
