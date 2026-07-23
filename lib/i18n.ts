import ar from "@/messages/ar.json";
import de from "@/messages/de.json";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import tr from "@/messages/tr.json";

export const locales = ["de", "fr", "en", "tr", "ar"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof de;

const dictionaries: Record<Locale, Dictionary> = { de, fr, en, tr, ar } as Record<Locale, Dictionary>;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function isRtl(locale: Locale) {
  return locale === "ar";
}

export const pageSlugs = [
  "ueber-uns",
  "leistungen",
  "kontakt",
  "karriere",
  "blog",
  "faq",
  "impressum",
  "datenschutz",
  "barrierefreiheit",
] as const;

export type PageSlug = (typeof pageSlugs)[number];

export function isPageSlug(value: string): value is PageSlug {
  return pageSlugs.includes(value as PageSlug);
}

export function localePath(locale: Locale, path = "") {
  return `/${locale}${path ? `/${path}` : ""}`;
}
