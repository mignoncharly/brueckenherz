import type { Metadata } from "next";
import { getDictionary, type Locale, localePath } from "@/lib/i18n";
import { site } from "@/lib/site";

const titles: Record<string, (d: ReturnType<typeof getDictionary>) => string> = {
  home: (d) => d.home.title,
  "ueber-uns": (d) => d.about.title,
  leistungen: (d) => d.services.title,
  kontakt: (d) => d.contact.title,
  karriere: (d) => d.career.title,
  blog: (d) => d.blog.title,
  faq: (d) => d.faq.title,
  impressum: (d) => d.legal.imprintTitle,
  datenschutz: (d) => d.legal.privacyTitle,
  barrierefreiheit: (d) => d.legal.accessibilityTitle,
};

const descriptions: Record<string, (d: ReturnType<typeof getDictionary>) => string> = {
  home: (d) => d.home.description,
  "ueber-uns": (d) => d.about.description,
  leistungen: (d) => d.services.description,
  kontakt: (d) => d.contact.description,
  karriere: (d) => d.career.description,
  blog: (d) => d.blog.description,
  faq: (d) => d.faq.description,
  impressum: (d) => d.legal.imprintIntro,
  datenschutz: (d) => d.legal.privacyIntro,
  barrierefreiheit: (d) => d.legal.accessibilityIntro,
};

export function pageMetadata(locale: Locale, page = "home"): Metadata {
  const d = getDictionary(locale);
  const title = titles[page]?.(d) || d.home.title;
  const description = descriptions[page]?.(d) || d.home.description;
  const path = page === "home" ? "" : page;
  const canonical = new URL(localePath(locale, path), site.url);
  const languages = Object.fromEntries(
    (["de", "fr", "en", "tr", "ar"] as Locale[]).map((language) => [
      language,
      new URL(localePath(language, path), site.url).toString(),
    ]),
  );

  return {
    title: `${title} | Brückenherz`,
    description,
    alternates: { canonical, languages: { ...languages, "x-default": new URL("/de", site.url).toString() } },
    openGraph: {
      type: "website",
      locale,
      url: canonical,
      title,
      description,
      siteName: site.name,
      images: [{ url: "/logo.jpeg", width: 1200, height: 1200, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/logo.jpeg"] },
  };
}
