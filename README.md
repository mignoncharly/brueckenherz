# Brückenherz Website

Production-oriented, multilingual website for Brückenherz Ambulanter Pflegedienst in Mainz.

## Included

- Next.js App Router with TypeScript and static rendering for public pages
- Five locale routes: German, French, English, Turkish and Arabic
- RTL document layout for Arabic
- Responsive, WCAG-oriented component and form system
- Contact, appointment and application APIs with strict validation, CSRF checks, honeypots and rate limiting
- Consent-gated Google Maps embed
- Per-page metadata, canonical/hreflang links, structured data, sitemap and robots rules
- Security headers, dependency audit and Dependabot
- Privacy, legal notice and accessibility statement in all locales

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The root path selects a supported browser language and falls back to German.

## Environment variables

| Variable | Required | Purpose |
|---|---:|---|
| `RESEND_API_KEY` | for live forms | Transactional form delivery |
| `FROM_EMAIL` | for live forms | Verified sender address |
| `TO_EMAIL` | recommended | Recipient; defaults to the client email |
| `NEXT_PUBLIC_SITE_URL` | production | Canonical public origin |

Forms fail closed with a service error when email is not configured. This prevents a successful-looking response from silently losing personal data.

## Content editing

Developer-managed content lives in `messages/{locale}.json`. Each locale has the same structure. Edit corresponding keys in all five files before publishing. Blog entries and job listings are arrays in those files, so no database or CMS is needed for this first release.

The supplied logo is stored at `public/logo.jpeg`. Certificate and team slots are intentionally placeholders until the final assets are supplied.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm audit
```

Test forms end-to-end only after adding a verified Resend sender. Never submit diagnoses or patient records through the public forms.

## Deployment

The source is configured for OpenNext/Cloudflare-compatible deployment through the connected Sites project in `.openai/hosting.json`. Runtime secrets belong in the hosting secret store, never in Git.

For a different host, Next.js can also deploy to Vercel using the same source after environment variables are configured.

## Client handover checklist

- [ ] Replace placeholder copy after client review
- [ ] Add team photos and approved profile text
- [ ] Add certificate scans with meaningful alternative text
- [ ] Add managing director, Handelsregister and USt-ID details
- [ ] Confirm whether booking remains request-based or moves to calendar sync
- [ ] Verify the final domain and set `NEXT_PUBLIC_SITE_URL`
- [ ] Verify the Resend domain, sender and form recipient
- [ ] Run real submissions for contact, appointment and application forms
- [ ] Review legal copy with qualified German counsel
- [ ] Run an independent accessibility audit and Lighthouse checks
- [ ] Confirm DNS, TLS and all locale URLs on the final domain
