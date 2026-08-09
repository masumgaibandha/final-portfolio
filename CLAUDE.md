# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A premium, editorial-style personal portfolio for Masum — full-stack developer and cold email outreach specialist. Homepage sections in this order: **Navbar, Hero, About, Services, Outreach Stack, Projects, Testimonials, Pricing, Contact, Footer**, plus a `/resources` page.

The standalone CTA band that once sat between Pricing and Contact was removed — back to back, the two read as the same ask twice. Its copy now introduces the contact form. Don't reintroduce it.

**Affiliate content** (Outreach Stack section + `/resources`) is approved copy from `portfolio-content.md` § "Recommended Outreach Tools", mirrored into `src/data/resources.ts`. Rules that are not stylistic preferences:

- Affiliate tools are **recommendations, never a service**. They must not appear in the hero, About, Services, or the primary positioning.
- The disclosure renders directly beneath the tool cards on both surfaces — the footer disclosure does not satisfy this.
- Affiliate URLs are copied character for character; a mistyped `via` parameter silently drops attribution.
- Every affiliate link goes through `AffiliateLink`, which hardcodes `target="_blank"` and `rel="sponsored nofollow noopener noreferrer"` so no call site can ship a monetised link without them.

## Project status

Scaffolded and building. Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, HeroUI v3. The homepage and its ten sections are implemented; the sub-pages in the SEO structure table are not.

Environment: Node v22.17.0, npm 10.9.2, git 2.50.0. The repo is **not** under version control yet.

Contact delivery needs `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (see `.env.example`). The browser posts straight to `https://api.web3forms.com/submit`; there is no `/api/contact` route. The `NEXT_PUBLIC_` prefix is deliberate — Web3Forms' free plan expects a client-side submission, and a server-side proxy needs a paid plan with a safelisted IP. Without the key the form shows an error pointing at the direct email address.

The form posts a `FormData` body. Do **not** set `Content-Type` by hand — only the browser knows the multipart boundary token, and setting the header manually omits it and makes the body unparseable. `FormData` also avoids the CORS preflight that a JSON body triggers, so it is one round trip rather than two.

Two FormData quirks the form depends on:

- An unchecked `botcheck` is absent from `FormData` entirely, which is exactly what Web3Forms expects — leave it alone.
- A `<select>` whose placeholder option is `disabled` counts as having *no* selection, so it is omitted too. `service` and `budget` are defaulted to `""` before zod runs; without that, visitors see "expected string, received undefined" instead of "Please pick a service."

Two Cloudflare gotchas cost real debugging time here, so don't re-derive them:

- Requests to `api.web3forms.com` with no `User-Agent`, or with a `HeadlessChrome` one, get a **403 HTML challenge page instead of JSON**. This looks exactly like an invalid access key. Headless browser tests must override the UA or they measure bot detection rather than the form.
- Web3Forms returning `{"success":true}` means *accepted*, not *delivered*. Never report an email as delivered on the strength of the API response alone.

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Serve the build | `npm run start` |
| Lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` |

No test runner is configured. Don't reference one until it's actually installed. Before declaring work done, `npm run build` must pass — it catches Server/Client Component boundary errors that `dev` tolerates.

## Git attribution

Use the repository owner's configured Git identity for commits. Never add `Co-Authored-By`, `Generated-By`, or other AI attribution trailers to commit messages.

## Stack

- **Next.js** (App Router) + **TypeScript** — strict mode, no `any`
- **Tailwind CSS v4** — CSS-first config, **no `tailwind.config.ts`**
- **HeroUI v3** (`@heroui/react`) — note this is the v3 rewrite, not v2: there is no `HeroUIProvider`, no `@heroui/theme` package, and no Tailwind plugin. It is CSS-first (`@import "@heroui/react/styles"`) and is rethemed by overriding its plain custom properties. Components ship their own `"use client"`.
- **React Icons** (`react-icons`) — prefer one family site-wide (`react-icons/lu` or `/fi`); don't mix sets
- **zod** + **Web3Forms** — contact form only. zod validates in the browser before the form posts directly to Web3Forms.

## Design tokens

All colors and font stacks are declared once as `@theme` variables in `src/app/globals.css`. **Never hardcode a hex value in a component** — use the generated utilities (`bg-surface`, `text-muted`, `border-ink/10`).

HeroUI v3 already owns `--color-surface`, `--color-muted`, `--color-accent`, `--color-background` and friends, mapping each from a plain custom property via its own `@theme inline`. So `globals.css` splits in two:

1. A `@theme` block for tokens HeroUI has no counterpart for: `bg`, `cream`, `warm`, `peach`, `ink`, `line`, the font stacks, and the fluid `--text-display` / `--text-section` scale.
2. A `:root` override of HeroUI's raw variables (`--surface`, `--muted`, `--accent`, `--border`, `--focus`, `--field-*`) pointed at the same palette. This is what keeps HeroUI's own components on-brand *and* what defines `bg-surface` / `text-muted` / `text-accent`.

Do not add a `hero.ts` plugin or `@source` line for `@heroui/theme` — neither exists in v3.

| Token | Hex | Use |
|---|---|---|
| `bg` | `#FFFFFF` | Page base |
| `surface` | `#F8F2E7` | Alternating section bands |
| `cream` | `#FFF9D9` | Cards sitting on `surface` |
| `warm` | `#FFEEB8` | Hero wash, highlight marks |
| `peach` | `#FFE3C4` | Hero wash stop, badges, chips |
| `ink` | `#020000` | Headings, primary text, dark pill buttons |
| `muted` | `#625E5B` | Body copy, captions, labels |
| `accent` | `#FC7E07` | CTAs, links, status dot, underline accents |

Buttons are the one place HeroUI's variants are bypassed: the design calls for ink pills, which HeroUI has no variant for. `src/components/ui/Button.tsx` composes HeroUI's `buttonVariants()` geometry with brand tone classes — use `buttonClass()` / `<ButtonLink>` rather than styling buttons ad hoc.

## Typography

Loaded with `next/font/google` in `src/app/layout.tsx`, exposed as CSS variables, applied on `<html>`:

```ts
import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"], weight: ["700"],
  variable: "--font-playfair", display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"], weight: ["400", "500", "600"],
  variable: "--font-poppins", display: "swap",
});
```

- **Headings** — `font-heading` (Playfair Display 700). Headings only; never body copy.
- **Body** — `font-body` (Poppins 400). This is the `<body>` default.
- **Buttons / navigation** — Poppins 500–600 (`font-medium` / `font-semibold`).

Editorial scale: display type is large and tight — hero around `clamp(3rem, 8vw, 7rem)` with `leading-[0.95] tracking-tight`; section headings around `clamp(2rem, 4vw, 3.5rem)`. Body caps at `max-w-prose` in `text-muted`. Vertical rhythm is generous — sections breathe at `py-24 md:py-32`.

## Architecture

```
src/app/layout.tsx          fonts, HeroUIProvider, root metadata, JSON-LD
src/app/page.tsx            composes the ten sections in order
src/app/globals.css         @theme tokens, base layer
src/app/resources/page.tsx  affiliate tools page (own metadata + canonical)
src/components/sections/    one file per section (Hero.tsx, Services.tsx, …)
src/components/ui/          Container, Section, SectionHeading, button wrappers
src/data/                   typed content arrays
src/types/                  shared interfaces
public/                     portraits copied from resources/
```

Conventions:

- **Server Components by default.** Four client components exist today: `MobileNav`, `ContactForm`, `RevealOnScroll`, and `AffiliateLink` (its `onClick` analytics hook needs the browser). Keep client boundaries at the leaf, not the section — `Navbar` and `Contact` are both server components that render a client leaf. Testimonials are a static masonry grid, deliberately not a carousel. The masterclass sales page (below) adds none of its own — it stays fully server-rendered.
- **Content lives in `src/data/*.ts`**, typed against `src/types/`. Sections map over data and stay presentational — no inline copy arrays inside JSX.
- **`Section` owns vertical rhythm and banding.** It applies the `py-*` scale and alternates `bg-bg` / `bg-surface`. Individual sections must not set their own vertical padding, or spacing drifts.
- **Every section takes an `id`** matching its navbar anchor (`#about`, `#services`, …); scroll offset is handled once via `scroll-mt-*`, not per-link.
- Prefer composing HeroUI components over rebuilding them, but restyle them through the tokens above.

## Style constraints

The look is quiet and typographic — the interest comes from scale, whitespace, and warm color blocking, not effects.

- **No glassmorphism**, no frosted/blurred panels.
- **No multi-stop or rainbow gradients.** The single exception is the soft warm wash behind the hero (white → `warm`/`peach`), matching `resources/demo.png`.
- **Minimal motion** — short fades and small translates on entry only. No parallax, scroll-jacking, bouncing, or looping animation. Always honor `prefers-reduced-motion`.
  - Entry motion is one page-level mechanism: mark an element `data-reveal`, and `RevealOnScroll` flips `data-revealed` via IntersectionObserver. The CSS is gated on `(prefers-reduced-motion: no-preference) and (scripting: enabled)` — keep that `scripting` clause, or a failed JS bundle leaves the content permanently at `opacity: 0`.
- **Borders over shadows** — hairline `border-ink/10`; drop shadows only where HeroUI needs them for elevation.
- Avoid generic template signals: centered-everything layouts, icon-in-a-colored-circle grids, "Lorem ipsum" filler.

## Accessibility & SEO

- `#FC7E07` on white is ~2.9:1 — **fails AA for body text.** Use `accent` for large bold type (≥18.66px bold / 24px regular), as a fill behind `ink` text, or for non-text marks like the status dot. Body links use `ink` with an `accent` underline.
- Semantic landmarks (`header`/`nav`/`main`/`section`/`footer`), exactly one `<h1>` (in Hero), no heading-level skips.
- Visible focus rings on every interactive element — do not remove outlines without a replacement.
- Descriptive `alt` on portraits; decorative shapes get `alt=""`.
- Root `metadata` export with `metadataBase`, `title.template`, description, OpenGraph + Twitter card, and a JSON-LD `Person` block in the layout.
- Portraits go through `next/image` with explicit dimensions and `priority` on the hero image.

## Masterclass sales page

`src/app/masterclass/lead-generation-cold-email/` is a standalone Bengali sales page for a paid 2-day live masterclass, built as **Phase 1 (UI-only)** of a larger funnel. It does not share the homepage's `Navbar`/`Footer`/`Section` — it has its own minimal header/footer (`src/components/masterclass/MasterclassHeader.tsx`, `MasterclassFooter.tsx`) and its own tighter-spacing `MasterclassSection` wrapper (`py-14 md:py-20` vs. the homepage's `py-24 md:py-32`). It is not linked from the main portfolio navigation yet.

Not yet implemented (later phases): MongoDB, API routes, SSLCommerz, Meta Pixel/CAPI, confirmation email. The registration form is a static, non-functional preview — see below.

- **Bengali font is route-scoped.** `src/app/masterclass/lead-generation-cold-email/layout.tsx` loads `Hind_Siliguri` via `next/font/google` as `--font-hind-siliguri`, applied only through a wrapper `<div lang="bn">` in that layout — the root layout's `<html>` (Playfair Display / Poppins) is untouched, so the portfolio, blog, and resources routes render exactly as before. `globals.css` gained one additive `--font-bengali` token and one additive `font-bengali` `@utility` (mapped to `--font-hind-siliguri`) — nothing existing was changed. Because the global `h1,h2,h3,h4 { font-family: var(--font-heading) }` base rule (Playfair, which has no Bengali glyphs) still applies inside the wrapper by specificity, every heading in `src/components/masterclass/` explicitly carries the `font-bengali` class rather than relying on inheritance.
- **Checkout is intentionally disabled.** `masterclassConfig.checkoutEnabled` in `src/data/masterclass-content.ts` is `false`. `Registration.tsx` reads it to disable the submit button (label: "পেমেন্ট সেটআপ চলছে") and render a development-only notice explaining payment integration is pending — both driven by that one constant, not a separate build flag, so flipping it to `true` once SSLCommerz lands is a one-line change plus wiring the actual submit handler. The form has no `onSubmit` and needs no client JS in this phase, so `Registration.tsx` stays a Server Component.
- **Route metadata sets `robots: { index: false, follow: false }`** and the page is deliberately **not** added to `src/app/sitemap.ts` — it isn't ready for public discovery until checkout is functional.
- **Proof assets**: raw screenshots stay in `resources/master_class_assets/` and are never served directly. Sanitized derivatives live in `public/masterclass/` — cropped with PowerShell/`System.Drawing` (no WebP encoder was available in this environment, so derivatives are `.png`; revisit if `sharp`/ImageMagick/a WebP encoder is ever added). Used: `upwork-profile-proof.png` (uncropped — no client identifiers), `campaign-total-sent.png` and `campaign-chart.png` (cropped from `Latest_Campaign.png` to remove the Windows taskbar, timestamp, and org-menu, and to exclude the `$100,435` figure), `inbox-placement-result.png` (cropped from `inbox-placement-test.png` to remove the client/campaign name and sidebar), `feedback-five-star.png` (cropped from `upwork_Feedback_2.png` to exclude the 4.4★ row). Excluded entirely: `upwork_catalog.png` (corrupted metrics area), `fiverr_review.png` (exposes a findable client username), the PDF (copy reference only, never published).

## Resources

`resources/` holds design input, not app assets — copy what's needed into `public/`, don't import from it.

- `demo.png` — visual reference for **color, spacing, and mood**: warm cream→peach wash, black pill nav CTA, oversized display headline, "available for new opportunities" chip with an orange dot, cut-out portrait bleeding into the type. Its typefaces are *not* the spec — Playfair Display / Poppins above govern.
- `masum.png` (4:3), `masum-2.png` (16:9) — portrait photos on the warm wash. Hero art. Both carry their own baked-in cream backdrop and are **not** cut out, so the hero frames `masum.png` in a rounded panel and crops it to a portrait ratio rather than floating it against the page.
- `upwork-client-feedback-*.png`, `fiverr-client-feedback-*.png` — the source of every quote in `src/data/testimonials.ts`, transcribed verbatim. Client names are redacted in the screenshots and must stay withheld. **Never write a testimonial that isn't in one of these files.**
