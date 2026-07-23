import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DynamicPage } from "@/components/pages";
import { getDictionary, isLocale, isPageSlug, locales, pageSlugs } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return locales.flatMap((locale) => pageSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isPageSlug(slug)) return {};
  return pageMetadata(locale, slug);
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isPageSlug(slug)) notFound();
  return <DynamicPage page={slug} locale={locale} d={getDictionary(locale)} />;
}
