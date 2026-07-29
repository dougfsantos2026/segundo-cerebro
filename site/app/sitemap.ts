import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  return [
    {
      url: siteUrl,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/politica-de-privacidade`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/termos-de-uso`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
