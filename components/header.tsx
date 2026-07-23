"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { locales, localePath } from "@/lib/i18n";
import { site } from "@/lib/site";

const navItems = [
  ["home", ""],
  ["about", "ueber-uns"],
  ["services", "leistungen"],
  ["contact", "kontakt"],
  ["career", "karriere"],
  ["blog", "blog"],
  ["faq", "faq"],
] as const;

export function Header({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">{d.skip}</a>
      <div className="topbar">
        <div className="shell topbar-inner">
          <span>{d.common.eyebrow}</span>
          <a href={`tel:${site.phone}`}><Phone size={15} aria-hidden="true" /> {site.phoneDisplay}</a>
        </div>
      </div>
      <div className="shell nav-wrap">
        <Link href={localePath(locale)} className="brand" aria-label={`${site.name} – ${d.nav.home}`}>
          <Image src="/logo.jpeg" alt="" width={82} height={82} priority />
          <span><strong>Brückenherz</strong><small>Ambulanter Pflegedienst</small></span>
        </Link>

        <nav className="desktop-nav" aria-label="Hauptnavigation">
          {navItems.map(([key, path]) => (
            <Link key={key} href={localePath(locale, path)} className={pathname === localePath(locale, path) ? "active" : ""}>
              {d.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <label className="sr-only" htmlFor="language-desktop">{d.nav.language}</label>
          <select
            id="language-desktop"
            className="language-select"
            value={locale}
            onChange={(event) => { window.location.href = localePath(event.target.value as Locale, rest); }}
            aria-label={d.nav.language}
          >
            {locales.map((value) => <option key={value} value={value}>{value.toUpperCase()}</option>)}
          </select>
          <Link className="button button-primary nav-cta" href={localePath(locale, "kontakt#termin")}>{d.nav.book}</Link>
          <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? d.nav.close : d.nav.menu}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`}>
        <nav className="shell" aria-label="Mobile Navigation">
          {navItems.map(([key, path]) => (
            <Link key={key} href={localePath(locale, path)} onClick={() => setOpen(false)}>{d.nav[key]}</Link>
          ))}
          <Link className="button button-primary" href={localePath(locale, "kontakt#termin")} onClick={() => setOpen(false)}>{d.nav.book}</Link>
        </nav>
      </div>
    </header>
  );
}
