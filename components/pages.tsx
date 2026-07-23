import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CalendarDays, Check, Clock, Heart, Mail, MapPin, Phone, Quote, ShieldCheck, Users, Languages } from "lucide-react";
import { ApplicationForm, BookingForm, ContactForm } from "@/components/forms";
import { MapConsent } from "@/components/map-consent";
import { Callout, PageHero, SectionHeading, ServiceCards } from "@/components/ui";
import type { Dictionary, Locale, PageSlug } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { site } from "@/lib/site";

export function HomePage({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <>
      <section className="home-hero">
        <div className="hero-pattern" />
        <div className="shell home-hero-grid">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light"><span />{d.common.eyebrow}</p>
            <h1>{d.home.title}</h1>
            <p className="hero-lead">{d.home.description}</p>
            <div className="button-row">
              <Link href={localePath(locale, "kontakt")} className="button button-gold">{d.home.primaryCta}<ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href={localePath(locale, "leistungen")} className="button button-ghost-light">{d.home.secondaryCta}</Link>
            </div>
            <div className="hero-meta">
              <span><Phone size={18} aria-hidden="true" /><strong>{d.home.availability}</strong><small>{site.phoneDisplay}</small></span>
              <span><MapPin size={18} aria-hidden="true" /><strong>{d.home.area}</strong><small>Mainz</small></span>
            </div>
          </div>
          <div className="hero-visual" aria-label={site.name}>
            <div className="logo-halo">
              <Image src="/logo.jpeg" alt={site.name} width={460} height={460} priority />
            </div>
            <div className="floating-card floating-one"><Heart aria-hidden="true" /><span>{d.home.languages}</span></div>
            <div className="floating-card floating-two"><ShieldCheck aria-hidden="true" /><span>{d.home.founded}</span></div>
          </div>
        </div>
        <div className="hero-wave" />
      </section>

      <section className="section intro-section">
        <div className="shell split">
          <div className="bridge-art" aria-hidden="true">
            <span className="bridge-sun" />
            <span className="bridge-line one" />
            <span className="bridge-line two" />
            <Quote className="bridge-quote" />
          </div>
          <div>
            <SectionHeading eyebrow={d.home.introEyebrow} title={d.home.introTitle} text={d.home.introText} />
            <blockquote>{d.about.missionText}</blockquote>
            <Link className="text-link" href={localePath(locale, "ueber-uns")}>{d.nav.about}<ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="shell">
          <SectionHeading title={d.home.servicesTitle} text={d.home.servicesText} align="center" />
          <ServiceCards d={d} locale={locale} limit={5} />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading title={d.home.valuesTitle} text={d.home.valuesText} align="center" />
          <div className="values-grid">
            {d.values.map((value, index) => <article key={value.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{value.title}</h3><p>{value.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section trust-section">
        <div className="shell trust-grid">
          <div>
            <SectionHeading title={d.home.trustTitle} text={d.home.trustText} />
            <div className="trust-points">
              <span><Award aria-hidden="true" />{d.home.founded}</span>
              <span><Users aria-hidden="true" />{d.home.local}</span>
              <span><Languages aria-hidden="true" />{d.home.languages}</span>
            </div>
          </div>
          <div className="certificate-grid">
            {[1, 2, 3].map((item) => <div className="certificate" key={item}><Award aria-hidden="true" /><strong>{d.common.placeholderNotice}</strong></div>)}
          </div>
        </div>
      </section>
      <Callout d={d} locale={locale} />
    </>
  );
}

export function AboutPage({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <>
      <PageHero eyebrow={d.common.eyebrow} title={d.about.title} description={d.about.description} />
      <section className="section">
        <div className="shell split story-split">
          <div>
            <SectionHeading eyebrow={d.about.storyEyebrow} title={d.about.storyTitle} />
            <p>{d.about.storyText1}</p><p>{d.about.storyText2}</p>
          </div>
          <div className="story-card">
            <span className="story-year">2026</span>
            <Quote aria-hidden="true" />
            <blockquote>{d.about.missionText}</blockquote>
          </div>
        </div>
      </section>
      <section className="section section-tint">
        <div className="shell">
          <SectionHeading title={d.home.valuesTitle} text={d.home.valuesText} align="center" />
          <div className="values-grid">{d.values.map((value, i) => <article key={value.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{value.title}</h3><p>{value.text}</p></article>)}</div>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <SectionHeading title={d.about.teamTitle} text={d.about.teamText} align="center" />
          <div className="team-grid">
            {[1, 2, 3].map((person) => <article key={person}><div className="team-placeholder"><Users aria-hidden="true" /></div><h3>{d.about.teamPlaceholder}</h3><p>{d.common.placeholderNotice}</p></article>)}
          </div>
        </div>
      </section>
      <Callout d={d} locale={locale} />
    </>
  );
}

export function ServicesPage({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <>
      <PageHero eyebrow={d.common.eyebrow} title={d.services.title} description={d.services.description} />
      <section className="section">
        <div className="shell services-list">
          {d.services.items.map((service, index) => (
            <article id={service.id} className="service-detail" key={service.id}>
              <div className="service-number">{String(index + 1).padStart(2, "0")}</div>
              <div><h2>{service.title}</h2><p>{service.text}</p></div>
              <ul>{service.details.map((detail) => <li key={detail}><Check aria-hidden="true" />{detail}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-tint">
        <div className="shell">
          <SectionHeading title={d.services.processTitle} align="center" />
          <div className="process-grid">{d.services.process.map((step, index) => <article key={step.title}><span>{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
        </div>
      </section>
      <Callout d={d} locale={locale} />
    </>
  );
}

export function ContactPage({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <>
      <PageHero eyebrow={d.common.eyebrow} title={d.contact.title} description={d.contact.description} />
      <section className="section">
        <div className="shell contact-grid">
          <ContactForm locale={locale} d={d} />
          <aside className="contact-aside">
            <h2>{d.contact.detailsTitle}</h2>
            <a href={`tel:${site.phone}`}><span><Phone aria-hidden="true" /></span><div><small>{d.common.phoneLabel}</small><strong>{site.phoneDisplay}</strong></div></a>
            <a href={`mailto:${site.email}`}><span><Mail aria-hidden="true" /></span><div><small>{d.common.emailLabel}</small><strong>{site.email}</strong></div></a>
            <div className="contact-line"><span><MapPin aria-hidden="true" /></span><div><small>{d.footer.contact}</small><strong>{d.contact.address}</strong></div></div>
            <a className="button button-whatsapp" href={site.whatsapp} target="_blank" rel="noopener noreferrer">{d.contact.whatsapp}</a>
            <MapConsent title={d.contact.mapTitle} buttonLabel={d.common.learnMore} />
          </aside>
        </div>
      </section>
      <section className="section section-tint"><div className="shell booking-wrap"><BookingForm locale={locale} d={d} /></div></section>
    </>
  );
}

export function CareerPage({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <>
      <PageHero eyebrow={d.common.eyebrow} title={d.career.title} description={d.career.description} />
      <section className="section">
        <div className="shell split">
          <div><SectionHeading title={d.career.introTitle} text={d.career.introText} /><ul className="benefit-list">{d.career.benefits.map((benefit) => <li key={benefit}><Check aria-hidden="true" />{benefit}</li>)}</ul></div>
          <div className="career-art"><Heart aria-hidden="true" /><span>Brückenherz</span></div>
        </div>
      </section>
      <section className="section section-tint">
        <div className="shell">
          <SectionHeading title={d.career.jobsTitle} align="center" />
          <div className="job-grid">{d.career.jobs.map((job) => <article key={job.title}><span>{job.type}</span><h3>{job.title}</h3><p>{job.text}</p><a href="#bewerbung">{d.career.formTitle}<ArrowRight size={17} aria-hidden="true" /></a></article>)}</div>
        </div>
      </section>
      <section className="section" id="bewerbung"><div className="shell form-narrow"><ApplicationForm locale={locale} d={d} /></div></section>
    </>
  );
}

export function BlogPage({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <>
      <PageHero eyebrow={d.common.eyebrow} title={d.blog.title} description={d.blog.description} />
      <section className="section">
        <div className="shell article-grid">
          {d.blog.articles.map((article, index) => (
            <article className="article-card" key={article.slug}>
              <div className={`article-art art-${index + 1}`}><span>{article.category}</span></div>
              <div className="article-body"><div className="article-meta"><span><CalendarDays aria-hidden="true" />{article.date}</span><span><Clock aria-hidden="true" />{article.readTime} {d.common.minutes}</span></div><h2>{article.title}</h2><p>{article.excerpt}</p><Link href={localePath(locale, `blog/${article.slug}`)}>{d.common.learnMore}<ArrowRight size={17} aria-hidden="true" /></Link></div>
            </article>
          ))}
        </div>
      </section>
      <Callout d={d} locale={locale} />
    </>
  );
}

export function BlogArticlePage({ locale, d, slug }: { locale: Locale; d: Dictionary; slug: string }) {
  const article = d.blog.articles.find((item) => item.slug === slug);
  if (!article) return null;
  return (
    <>
      <article>
        <PageHero eyebrow={article.category} title={article.title} description={article.excerpt}>
          <div className="hero-article-meta"><span><CalendarDays aria-hidden="true" />{article.date}</span><span><Clock aria-hidden="true" />{article.readTime} {d.common.minutes}</span></div>
        </PageHero>
        <div className="shell prose">
          {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="prose-note">{d.common.placeholderNotice}</div>
          <Link className="text-link" href={localePath(locale, "blog")}>{d.common.back}</Link>
        </div>
      </article>
      <Callout d={d} locale={locale} />
    </>
  );
}

export function FaqPage({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <>
      <PageHero eyebrow={d.common.eyebrow} title={d.faq.title} description={d.faq.description} />
      <section className="section"><div className="shell faq-list">{d.faq.items.map((item) => <details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div></section>
      <section className="faq-cta"><div className="shell"><h2>{d.faq.ctaTitle}</h2><p>{d.faq.ctaText}</p><Link className="button button-gold" href={localePath(locale, "kontakt")}>{d.nav.contact}</Link></div></section>
    </>
  );
}

export function LegalPage({ page, d }: { page: PageSlug; d: Dictionary }) {
  if (page === "impressum") {
    return <><PageHero eyebrow={d.footer.legal} title={d.legal.imprintTitle} description={d.legal.imprintIntro} /><div className="shell legal-copy"><h2>{d.legal.company}</h2><p>{d.contact.address}<br />{d.common.phoneLabel}: {site.phoneDisplay}<br />E-Mail: {site.email}</p><p>{d.legal.represented}</p><p>{d.legal.register}<br />{d.legal.vat}</p><p>{d.legal.responsible}</p><h2>{d.legal.disclaimerTitle}</h2><p>{d.legal.disclaimer}</p><small>{d.legal.updated}</small></div></>;
  }
  if (page === "datenschutz") {
    const sections = [["controllerTitle", d.legal.company + "\n" + d.contact.address],["dataTitle","dataText"],["basisTitle","basisText"],["processorsTitle","processorsText"],["rightsTitle","rightsText"],["cookiesTitle","cookiesText"]] as const;
    return <><PageHero eyebrow={d.footer.legal} title={d.legal.privacyTitle} description={d.legal.privacyIntro} /><div className="shell legal-copy">{sections.map(([title, text]) => <section key={title}><h2>{d.legal[title]}</h2><p>{text in d.legal ? d.legal[text as keyof typeof d.legal] : text}</p></section>)}<small>{d.legal.updated}</small></div></>;
  }
  return <><PageHero eyebrow={d.footer.legal} title={d.legal.accessibilityTitle} description={d.legal.accessibilityIntro} /><div className="shell legal-copy"><section><h2>{d.legal.statusTitle}</h2><p>{d.legal.statusText}</p></section><section><h2>{d.legal.limitationsTitle}</h2><p>{d.legal.limitationsText}</p></section><section><h2>{d.legal.feedbackTitle}</h2><p>{d.legal.feedbackText}</p><p><a href={`mailto:${site.email}`}>{site.email}</a><br /><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></p></section><small>{d.legal.updated}</small></div></>;
}

export function DynamicPage({ page, locale, d }: { page: PageSlug; locale: Locale; d: Dictionary }) {
  switch (page) {
    case "ueber-uns": return <AboutPage locale={locale} d={d} />;
    case "leistungen": return <ServicesPage locale={locale} d={d} />;
    case "kontakt": return <ContactPage locale={locale} d={d} />;
    case "karriere": return <CareerPage locale={locale} d={d} />;
    case "blog": return <BlogPage locale={locale} d={d} />;
    case "faq": return <FaqPage locale={locale} d={d} />;
    default: return <LegalPage page={page} d={d} />;
  }
}
