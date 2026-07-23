import Link from "next/link";
import { ArrowRight, Check, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="shell page-hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, text, align = "start" }: { eyebrow?: string; title: string; text?: string; align?: "start" | "center" }) {
  return (
    <div className={`section-heading ${align === "center" ? "center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function ServiceCards({ d, locale, limit }: { d: Dictionary; locale: Locale; limit?: number }) {
  const icons = [HeartHandshake, ShieldCheck, Sparkles, Check, HeartHandshake];
  return (
    <div className="card-grid service-grid">
      {d.services.items.slice(0, limit).map((item, index) => {
        const Icon = icons[index];
        return (
          <article className="service-card" key={item.id}>
            <div className="icon-box"><Icon aria-hidden="true" /></div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <Link href={`${localePath(locale, "leistungen")}#${item.id}`}>{d.common.learnMore} <ArrowRight size={17} aria-hidden="true" /></Link>
          </article>
        );
      })}
    </div>
  );
}

export function Callout({ d, locale }: { d: Dictionary; locale: Locale }) {
  return (
    <section className="callout shell">
      <div>
        <p className="eyebrow">{d.common.eyebrow}</p>
        <h2>{d.home.closingTitle}</h2>
        <p>{d.home.closingText}</p>
      </div>
      <div className="button-row">
        <Link className="button button-gold" href={localePath(locale, "kontakt")}>{d.home.primaryCta}<ArrowRight size={18} aria-hidden="true" /></Link>
        <a className="button button-ghost-light" href="tel:+4915755977679">{d.common.phoneLabel}</a>
      </div>
    </section>
  );
}
