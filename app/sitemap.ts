import type { MetadataRoute } from "next";
import { getDictionary, locales, pageSlugs } from "@/lib/i18n";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = locales.flatMap((locale) => [
    { url: new URL(`/${locale}`, site.url).toString(), lastModified: new Date("2026-07-23"), changeFrequency: "weekly" as const, priority: locale === "de" ? 1 : 0.9 },
    ...pageSlugs.map((slug) => ({ url: new URL(`/${locale}/${slug}`, site.url).toString(), lastModified: new Date("2026-07-23"), changeFrequency: "monthly" as const, priority: slug === "leistungen" || slug === "kontakt" ? 0.9 : 0.7 })),
  ]);
  const articles = locales.flatMap((locale) => getDictionary(locale).blog.articles.map((article) => ({
    url: new URL(`/${locale}/blog/${article.slug}`, site.url).toString(),
    lastModified: new Date("2026-07-18"),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  })));
  return [...staticPages, ...articles];
}
