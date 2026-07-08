import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/haywood-mushrooms-45ab5.firebasestorage.app/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Firebase Auth's signInWithPopup (Google sign-in) needs the popup
        // to call window.close() on the opener after auth completes.
        // Chrome's default Cross-Origin-Opener-Policy blocks that unless we
        // explicitly allow popups here.
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
