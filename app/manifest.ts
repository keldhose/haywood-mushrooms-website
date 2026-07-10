import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Haywood Mushrooms — Spawn Laboratory",
    short_name: "Haywood Mushrooms",
    description: "Science-led mushroom spawn — order premium grain spawn directly from our lab in North Carolina.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f4f0",
    theme_color: "#16281d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
