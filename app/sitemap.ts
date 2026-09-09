import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Add every new route here as it is created.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/projects/patient-placement`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/projects/transfer-assistant`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
