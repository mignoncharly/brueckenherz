import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { site } from "@/lib/site";

export function Footer({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link href={localePath(locale)} className="footer-brand">
            <Image src="/logo.jpeg" alt="" width={72} height={72} />
            <span><strong>Brückenherz</strong><small>{d.footer.tagline}</small></span>
          </Link>
          <p className="footer-copy">{d.home.description}</p>
        </div>
        <div>
          <h2>{d.footer.navigation}</h2>
          <Link href={localePath(locale, "ueber-uns")}>{d.nav.about}</Link>
          <Link href={localePath(locale, "leistungen")}>{d.nav.services}</Link>
          <Link href={localePath(locale, "karriere")}>{d.nav.career}</Link>
          <Link href={localePath(locale, "faq")}>{d.nav.faq}</Link>
        </div>
        <div>
          <h2>{d.footer.contact}</h2>
          <a href={`tel:${site.phone}`}><Phone size={17} aria-hidden="true" /> {site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}><Mail size={17} aria-hidden="true" /> {site.email}</a>
          <span><MapPin size={17} aria-hidden="true" /> {d.contact.address}</span>
        </div>
        <div>
          <h2>{d.footer.legal}</h2>
          <Link href={localePath(locale, "impressum")}>{d.footer.imprint}</Link>
          <Link href={localePath(locale, "datenschutz")}>{d.footer.privacy}</Link>
          <Link href={localePath(locale, "barrierefreiheit")}>{d.footer.accessibility}</Link>
        </div>
      </div>
      <div className="shell emergency">{d.footer.noEmergency}</div>
      <div className="footer-bottom">
        <div className="shell">© {new Date().getFullYear()} {d.footer.copyright}</div>
      </div>
    </footer>
  );
}
