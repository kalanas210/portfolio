import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

// Generated at /robots.txt — allows crawling of public pages, blocks the API,
// and points crawlers at the sitemap. The admin panel is intentionally NOT
// listed here (that would advertise its obscure path); it is kept out of search
// by its own `robots: { index: false }` layout metadata plus auth.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
