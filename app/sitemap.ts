import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.haywoodmushrooms.com",
      lastModified: new Date(),
    },
    {
      url: "https://www.haywoodmushrooms.com/strains",
      lastModified: new Date(),
    },
    {
      url: "https://www.haywoodmushrooms.com/blog/how-to-grow-lions-mane",
      lastModified: new Date(),
    },
  ];
}