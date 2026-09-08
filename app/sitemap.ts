import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Single-page site for now. As sections become their own routes, add them here.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
