import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getDictionary, isLocale, isRtl, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  category: "healthcare",
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#092b4c",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const d = getDictionary(value);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MedicalBusiness"],
    name: site.legalName,
    image: new URL("/logo.jpeg", site.url).toString(),
    url: new URL(`/${value}`, site.url).toString(),
    telephone: site.phone,
    email: site.email,
    foundingDate: site.foundingDate,
    address: { "@type": "PostalAddress", ...site.address },
    areaServed: { "@type": "City", name: "Mainz" },
    availableLanguage: ["de", "fr", "en", "tr", "ar"],
    medicalSpecialty: "Nursing",
    knowsAbout: d.services.items.map((item) => item.title),
  };

  return (
    <html lang={value} dir={isRtl(value) ? "rtl" : "ltr"}>
      <body>
        <Header locale={value} dictionary={d} />
        <main id="main">{children}</main>
        <Footer locale={value} dictionary={d} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
