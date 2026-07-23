# Brückenherz — Website Implementation Brief
**For: coding agent / development team**
**Client: Brückenherz Ambulanter Pflegedienst (UG, haftungsbeschränkt)**

---

## 1. Project Summary

Build a production-grade marketing + operations website for a German home-care ("ambulanter Pflegedienst") provider. Priorities, in order: **Security → SEO → Responsiveness/Mobile → everything else.** No Docker. No unnecessary infrastructure — favor a stack that deploys with a single command and needs no server management.

---

## 2. Client & Business Data (already collected)

| Field | Value |
|---|---|
| Company | Brückenherz Ambulanter Pflegedienst (UG, haftungsbeschränkt) |
| Founded | 10.06.2026 |
| Address | Früchtstraße 1, 55130 Mainz |
| Phone | 0157-55977679 |
| Email | Brueckenherzteam@gmail.com |
| Target audience | Elderly people (Ältere Menschen) and their families |
| Services | Behandlungspflege, Grundpflege, Betreuung, Privatleistungen, medizinische Leistungen |
| Differentiator | Cultural competence, flexibility |
| Core values | Zuverlässigkeit, Offenheit, Professionalität, Empathie, Würde, Vertrauen |
| Logo | Exists — provided (bridge + two women silhouettes forming a heart; navy/gold/teal palette) |
| Domain | Already owned |
| Hosting | Not yet set up — needs a recommendation |
| Certificates | Available, to be displayed |
| Team photos, testimonials, videos, social links | Not yet available — build placeholders/CMS slots |
| Handelsregister / USt-ID | Not yet available — leave placeholders in Impressum, flag as TODO |

> Content status: **texts are not written yet.** The agent should build the full page structure and component layer with realistic German placeholder copy that the client can review and replace, rather than blocking on final copy.

---

## 3. Recommended Stack (no Docker, single deploy target)

- **Framework:** Next.js 14+ (App Router, TypeScript, React Server Components). Gives SSR/SSG for SEO, file-based routing, built-in image optimization, and an API layer without a separate backend service.
- **Styling/UI:** Tailwind CSS + shadcn/ui for accessible, consistent components.
- **i18n:** `next-intl` (or `next-i18next`) for locale routing (`/de`, `/fr`, `/en`, `/tr`, `/ar`), with `dir="rtl"` handled at the layout level for Arabic.
- **Forms/backend logic:** Next.js Route Handlers (`app/api/*`) — no separate backend service needed. If the team prefers a decoupled backend (e.g. because the client's dev works primarily in Python), a small **FastAPI** service can host the contact/booking/application endpoints instead; either is acceptable, but don't run both unless there's a clear reason.
- **Database:** PostgreSQL via a managed provider (Neon, Supabase, or Railway) — serverless-friendly, no Docker/self-hosting required. Use **Prisma** (or SQLAlchemy if FastAPI is chosen) as the ORM.
- **Email delivery:** Resend or Postmark for transactional email (contact form, booking confirmations, application receipts).
- **File uploads (job applications):** direct-to-storage upload (e.g. Cloudflare R2 or S3-compatible bucket) with signed URLs — never store uploaded files on the app server.
- **Booking (Terminbuchung):** either a lightweight custom booking form (date/time + service type → email + DB record) or embed a scheduling tool (Cal.com) if the client wants live calendar sync. Default to the custom form unless told otherwise.
- **Hosting:** Vercel (first choice — zero-config Next.js deploys, free TLS, edge network, no Docker) or Netlify as an alternative. Attach the client's existing domain via DNS.
- **CI:** GitHub Actions — lint, type-check, build on every PR before deploy.

---

## 4. Internationalization

- Locales: **de** (default), **fr**, **en**, **tr**, **ar**.
- Locale-prefixed routing: `/de/...`, `/fr/...`, etc. Redirect `/` to the browser's best-matching locale, falling back to `de`.
- Arabic: full RTL layout support (`dir="rtl"`, mirrored nav/icons, RTL-safe Tailwind logical properties — use `ms-`/`me-`/`ps-`/`pe-` instead of `ml-`/`mr-`/`pl-`/`pr-`).
- All UI strings, form labels, error messages, and legal pages (Impressum/Datenschutz) must be translated in all 5 locales.
- `hreflang` alternate tags on every page for SEO across locales.
- Store translation strings in structured JSON per locale (`/messages/de.json`, etc.) — never hardcode text in components.

---

## 5. Security (top priority)

- Enforce HTTPS everywhere (HSTS header).
- Strict CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` locking down camera/mic/geolocation unless needed.
- All forms: server-side validation (Zod or Pydantic) in addition to client-side; sanitize all inputs; reject unexpected fields.
- Rate limit public endpoints (contact form, booking, application upload) to prevent abuse/spam — e.g. Upstash Redis rate limiter or equivalent.
- CSRF protection on all mutating routes.
- File upload validation: strict MIME/type whitelist, size limits, virus scan if feasible (e.g. via a scanning API), never execute uploaded files.
- Since this is healthcare-adjacent (Pflegedienst) but the public site itself won't hold patient health records, still treat every form submission (name, contact details, job applications) as personal data under **GDPR/DSGVO**: encrypt in transit and at rest, minimize retention, and give the client an easy way to export/delete records.
- No secrets in the repo — all API keys and DB credentials via environment variables / the hosting provider's secret store.
- Dependency scanning (Dependabot or Renovate) enabled from day one.
- Cookie consent banner (see Legal, below) gating any non-essential cookies/analytics.

---

## 6. SEO (top priority)

- Full SSR/SSG rendering for every public page (no client-only rendering of primary content).
- Unique `<title>`, meta description, and Open Graph/Twitter card per page and per locale.
- `schema.org` structured data: `LocalBusiness` / `MedicalBusiness` (or the closest applicable type for Pflegedienste) with NAP (name, address, phone), opening hours, service list, and `hreflang` links between locale versions of each page.
- Auto-generated `sitemap.xml` (all locales) and `robots.txt`.
- Semantic HTML (proper heading hierarchy, `<nav>`, `<main>`, `<footer>`, landmark roles).
- Target Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms — achieved via image optimization (`next/image`), font subsetting, and minimal client JS.
- Blog section built for easy ongoing content (SEO growth channel) — MDX or a lightweight headless CMS (see Section 9).

---

## 7. Responsiveness & Accessibility

- Mobile-first design; test breakpoints at 375px, 768px, 1024px, 1440px.
- Touch-friendly tap targets (min 44×44px), no hover-only interactions.
- The client explicitly requested **Barrierefreiheit** (accessibility) — target **WCAG 2.1 AA**: color contrast, keyboard navigation, ARIA labels, focus states, alt text on all images, accessible forms with proper `<label>` associations.
- An "Barrierefreiheitserklärung" (accessibility statement) page should be included alongside Impressum/Datenschutz.

---

## 8. Site Structure (pages)

1. **Startseite** — hero, value proposition, service overview, trust signals (certificates, values), CTA to contact/book.
2. **Über uns** — company story, values, since when active, team (placeholder until photos arrive).
3. **Dienstleistungen** — Behandlungspflege, Grundpflege, Betreuung, Privatleistungen, medizinische Leistungen, each with its own section/anchor.
4. **Kontakt** — contact form, phone/email/address, embedded Google Maps, WhatsApp button.
5. **Karriere** — job listings + online application form (with file upload for CV/certificates).
6. **Blog** — article list + detail template, ready for ongoing SEO content.
7. **FAQ** — accordion-style Q&A.
8. **Impressum** — §5 TMG-compliant; placeholders flagged for missing Handelsregister/USt-ID.
9. **Datenschutz** — full DSGVO-compliant privacy policy covering the contact form, booking form, job applications, and any analytics/cookies used.
10. **Barrierefreiheitserklärung** — accessibility statement.

All pages exist in all 5 locales.

---

## 9. Content Management

Since texts, most images, and team photos aren't final yet, don't hardcode copy directly in components:

- Use a lightweight headless CMS (e.g. **Sanity** or **Payload CMS**, both deploy without Docker) for: blog posts, job listings, service descriptions, testimonials (once available), and team member entries.
- Alternatively, if the client doesn't want to manage a CMS, keep all copy in the locale JSON/MDX files so a developer can update it directly — pick this only if the client won't need to self-serve content updates.
- Certificates: build a dedicated component/gallery to display them (client confirmed these exist and should be shown).

---

## 10. Features Checklist

| Feature | Included? |
|---|---|
| Contact form | ✅ |
| Appointment booking (Terminbuchung) | ✅ |
| WhatsApp button | ✅ |
| Multilingual (de/fr/en/tr/ar) | ✅ |
| Online job application | ✅ |
| Google Maps embed | ✅ |
| Live chat | ❌ explicitly not wanted |
| Newsletter signup | ❌ explicitly not wanted |
| Customer portal/login | ❌ explicitly not wanted |

---

## 11. Design Direction

- Palette: navy blue, gold, teal — matching the existing logo.
- Tone: trustworthy, warm, professional, modern — avoid clinical/cold styling; this is a care service built on human connection.
- Use the existing logo as the visual anchor; derive a small supporting design system (type scale, spacing, button/card styles) from it rather than introducing an unrelated aesthetic.

---

## 12. Deliverables

1. Deployed, working website on the client's existing domain (Vercel or equivalent).
2. Source repository with README covering local setup, environment variables, and deployment steps.
3. CMS access (if used) with a short client-facing guide for editing content.
4. Basic analytics (privacy-respecting, e.g. Plausible or Umami — cookie-free, no consent banner required) so the client can see traffic without a heavier GDPR burden.
5. Handover checklist: DNS confirmed, SSL active, all 5 locales verified, forms tested end-to-end (submission → email/DB), Lighthouse scores (Performance/SEO/Accessibility/Best Practices) all ≥ 90.

---

## 13. Open Items to Flag Back to the Client

- Final copy for all pages (currently placeholder).
- Team photos, additional images, videos.
- Handelsregisternummer and USt-ID for the Impressum, once available.
- Whether booking should sync to a real calendar (Cal.com) or stay a simple request form.
- Whether the client wants a CMS they self-edit, or prefers developer-managed content.
