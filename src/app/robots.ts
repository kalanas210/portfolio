import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

// Generated at /robots.txt — allows crawling of public pages, blocks the
// admin + API, and points crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
