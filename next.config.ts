import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin's auth module pulls in jwks-rsa -> jose, which ships as
  // pure ESM. Turbopack's bundling of that chain breaks with ERR_REQUIRE_ESM
  // in Vercel's serverless runtime. Leaving the package external (a native
  // Node require() at runtime instead of a bundled import) avoids it.
  serverExternalPackages: ["firebase-admin"],
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
