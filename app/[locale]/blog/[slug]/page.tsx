import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticlePage } from "@/components/pages";
import { getDictionary, isLocale, locales, localePath } from "@/lib/i18n";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return locales.flatMap((locale) => getDictionary(locale).blog.articles.map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = getDictionary(locale).blog.articles.find((item) => item.slug === slug);
  if (!article) return {};
  const canonical = new URL(localePath(locale, `blog/${slug}`), site.url);
  return {
    title: `${article.title} | Brückenherz`,
    description: article.excerpt,
    alternates: { canonical },
    openGraph: { type: "article", title: article.title, description: article.excerpt, url: canonical, publishedTime: "2026-07-18" },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !getDictionary(locale).blog.articles.some((item) => item.slug === slug)) notFound();
  return <BlogArticlePage locale={locale} d={getDictionary(locale)} slug={slug} />;
}
