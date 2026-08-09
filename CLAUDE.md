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

Not yet implemented (later phases): SSLCommerz, Meta Pixel/CAPI, confirmation email. The registration form is a static, non-functional preview — see below. MongoDB persistence exists (Phase 2, below) but is not wired to the form and cannot be reached publicly yet.

- **Bengali font is route-scoped.** `src/app/masterclass/lead-generation-cold-email/layout.tsx` loads `Hind_Siliguri` via `next/font/google` as `--font-hind-siliguri`, applied only through a wrapper `<div lang="bn">` in that layout — the root layout's `<html>` (Playfair Display / Poppins) is untouched, so the portfolio, blog, and resources routes render exactly as before. `globals.css` gained one additive `--font-bengali` token and one additive `font-bengali` `@utility` (mapped to `--font-hind-siliguri`) — nothing existing was changed. Because the global `h1,h2,h3,h4 { font-family: var(--font-heading) }` base rule (Playfair, which has no Bengali glyphs) still applies inside the wrapper by specificity, every heading in `src/components/masterclass/` explicitly carries the `font-bengali` class rather than relying on inheritance.
- **Checkout is intentionally disabled.** `masterclassConfig.checkoutEnabled` in `src/data/masterclass-content.ts` is `false`. `Registration.tsx` reads it to disable the submit button (label: "পেমেন্ট সেটআপ চলছে") and render a development-only notice explaining payment integration is pending — both driven by that one constant, not a separate build flag, so flipping it to `true` once SSLCommerz lands is a one-line change plus wiring the actual submit handler. The form has no `onSubmit` and needs no client JS in this phase, so `Registration.tsx` stays a Server Component.
- **Route metadata sets `robots: { index: false, follow: false }`** and the page is deliberately **not** added to `src/app/sitemap.ts` — it isn't ready for public discovery until checkout is functional.
- **Proof assets**: raw screenshots stay in `resources/master_class_assets/` and are never served directly. Sanitized derivatives live in `public/masterclass/` — cropped with PowerShell/`System.Drawing` (no WebP encoder was available in this environment, so derivatives are `.png`; revisit if `sharp`/ImageMagick/a WebP encoder is ever added). Used: `upwork-profile-proof.png` (uncropped — no client identifiers), `campaign-total-sent.png` and `campaign-chart.png` (cropped from `Latest_Campaign.png` to remove the Windows taskbar, timestamp, and org-menu, and to exclude the `$100,435` figure), `inbox-placement-result.png` (cropped from `inbox-placement-test.png` to remove the client/campaign name and sidebar), `feedback-five-star.png` (cropped from `upwork_Feedback_2.png` to exclude the 4.4★ row). Excluded entirely: `upwork_catalog.png` (corrupted metrics area), `fiverr_review.png` (exposes a findable client username), the PDF (copy reference only, never published).

### Phase 2 — MongoDB persistence (registration disabled)

A registration/draft-order data layer exists (`src/lib/mongodb.ts`, `src/lib/masterclass/`), but nothing public can reach it yet — `POST /api/masterclass/registrations` returns `503 REGISTRATION_NOT_OPEN` before touching MongoDB unless **both** `MASTERCLASS_REGISTRATION_ENABLED === "true"` **and** `privacyPolicyVersion` (in `src/lib/masterclass/constants.ts`) has been bumped past its placeholder `"unpublished-draft"`. Both checks fail closed to the same generic response, deliberately — an accidentally-flipped enabled flag with no real privacy policy published must not behave any differently from the ordinary disabled state. The UI form (`Registration.tsx`) still isn't wired to call this route at all.

**No real MongoDB Atlas connection or write has ever been exercised against this code** — everything here is verified by `tsc`/build/lint and static review only. The indexes, transaction behavior, and duplicate/idempotency logic below are believed correct but unconfirmed against a live cluster.

Environment variables (see `.env.example` for placeholders — never real values in this file): `MONGODB_URI`, `MONGODB_DB`, `MASTERCLASS_REGISTRATION_ENABLED`. All server-only, no `NEXT_PUBLIC_` prefix.

Collections: `masterclass_registrations` (one document per student per batch, keyed by `(batchId, emailNormalized)`) and `payment_orders` (one document per checkout attempt, keyed by `(batchId, idempotencyKey)`). They are deliberately separate — a registration is a person's intent to attend; an order is one payment attempt. A student can retry payment (a new order) without ever duplicating their registration. See `src/types/masterclass-persistence.ts` for the exact document shapes and `src/lib/masterclass/{registrations,payment-orders}-repository.ts` for the unique indexes.

**Duplicate registration is immutable by design.** A repeat submission for a `(batchId, emailNormalized)` that already exists is only ever treated as the same student retrying — and only their `updatedAt`/`lastTouchAttribution` change — when the submitted phone number matches the one on file (`phoneE164`). A mismatched phone is rejected as `409 REGISTRATION_CONFLICT` without writing anything; name, email, phone, consent, and `firstTouchAttribution` are otherwise immutable after creation. **A legitimate correction to an existing registration's name or phone is not something this endpoint does — it requires owner support intervention directly against the database.** See `src/lib/masterclass/registrations-repository.ts`.

**Idempotency keys are bound to the request they were issued for.** A `(batchId, idempotencyKey)` match alone is not sufficient to replay an existing order — `src/lib/masterclass/fingerprint.ts` computes a SHA-256 fingerprint over `(batchId, registrationId, amount, currency)`, stored as `requestFingerprint` on the order. A reused key whose registration or fingerprint doesn't match is rejected as `409 IDEMPOTENCY_CONFLICT` rather than ever returning someone else's order. See `src/lib/masterclass/payment-orders-repository.ts`.

Payment status is **provider-independent by design**: `PaymentOrderDocument.provider` is `UNASSIGNED` until a gateway is actually chosen (`PORTPOS` | `SHURJOPAY` | `SSLCOMMERZ` are the only other values modeled). **Only a verified gateway response may ever set an order's status to `PAID`** — nothing in this phase does that; every order this code can create stays `CREATED`. When a gateway is wired up, the same rule from the earlier funnel audit applies: validate via the provider's own verification API before trusting any redirect or callback payload, never the payload alone.

**`confirmationEmail`/`purchaseCapi` are lease-based state machines, not yet driven by any worker.** Both start `NOT_READY` on every draft order. The full state model (`NOT_READY | READY | PROCESSING | SENT | FAILED`, plus `processingToken`/`processingStartedAt`/`leaseExpiresAt`/`lastErrorCode`) is documented on `DeliveryState` in `src/types/masterclass-persistence.ts`. A future worker may atomically claim: `READY` work (never attempted); `FAILED` work when `attempts` is still under the retry ceiling (retryable immediately, no lease involved); or `PROCESSING` work whose `leaseExpiresAt` has passed (a stalled/crashed previous claimant). **The expiring lease belongs to `PROCESSING`, not `FAILED`** — a `FAILED` record is retryable on its own terms, not because a lease ran out. `SENT` is terminal and matches none of the three claim cases, so it can never be claimed or resent. No email or Meta CAPI call exists yet; this phase only defines the shape the future worker will use.

**`REGISTRATION_CONFLICT` is not full email-enumeration resistance.** It protects an existing registration's data from being overwritten, but a caller who submits an email with a mismatched phone number receives a distinguishable `409` versus the `201` a new registration gets — so a persistent caller can use this endpoint to test whether a given email is already registered for the batch. This is a known, accepted limitation of the current design, not an oversight to silently patch; closing it (e.g. making both outcomes return an identical shape and confirming out-of-band) is future work. **Regardless, this endpoint must not be enabled for real traffic until at least: production rate limiting, same-origin request validation, bot/abuse protection (e.g. a challenge or honeypot), and a published privacy policy are all implemented and verified** — none of the four exist yet.

Registration stays disabled — `MASTERCLASS_REGISTRATION_ENABLED` must stay `false` — until rate limiting, real gateway verification, bot/abuse protection, and a privacy review are all in place. The privacy-policy gate (`isPrivacyPolicyPublished()`) now passes as of Phase 3A (see below), but the flag itself is the one that actually keeps the route at `503` — don't flip it as a shortcut to test the form end-to-end; there is no abuse protection on this route yet. The UI form also isn't wired to this route, and no confirmation email or Meta CAPI sender exists.

### Phase 3A — Legal pages, policy versions, consent evidence

Three public Bengali pages exist: `/privacy-policy`, `/terms-and-conditions`, `/refund-policy` (route group `src/app/(legal)/`, shared chrome in `src/components/legal/LegalPage.tsx`, content in `src/data/legal-content.ts`). Unlike the masterclass sales page, these are **`index, follow`** (the metadata default — no `robots` override) and **are** in `src/app/sitemap.ts`. The masterclass sales page itself stays excluded from the sitemap and `noindex, nofollow` — unchanged.

**Policy versions are centralized and immutable per version**: `policyVersions` in `src/lib/masterclass/constants.ts` (`{ privacy, terms, refund }`, currently all `"2026-08-09"`). Bump the relevant date only when that document's content materially changes — a version bump never rewrites what an earlier student already agreed to, because each registration stamps the version in effect at the moment of acceptance. `isPrivacyPolicyPublished()` now checks `policyVersions.privacy`, and returns `true` as of this phase (`/privacy-policy` is real). Registration still returns `503` regardless, because `MASTERCLASS_REGISTRATION_ENABLED` is independently `false` in `.env`.

**`ConsentRecord`** (`src/types/masterclass-persistence.ts`) now records `accepted: true`, `privacyPolicyVersion`, `termsVersion`, `refundPolicyVersion`, `acceptedAt`, and the separate `marketingConsent`. All three version fields and `acceptedAt` are stamped server-side from `policyVersions` — never accepted from the client, and (like the rest of `consent`) never rewritten by `upsertRegistration`'s matched-retry path. **Schema addition, no migration** — there is no production registration data yet. Consent evidence is never returned by the API; the route's success response is still only `publicRegistrationRef`/`publicOrderRef`/`status`.

**Confirmed, implemented rules**: a successful payment is non-refundable for student-initiated cancellation (no cancellation deadline is stated, none exists); the 7-day recording access is not a refund; MasumDev-initiated cancellation, a MasumDev-initiated reschedule of both live dates (student may request a refund before the revised class begins), and verified duplicate payments all get a full refund with no fee deducted. See `src/data/legal-content.ts` → `refundPolicy` for the exact wording.

**The registration form preview** (`Registration.tsx`) now shows two checkboxes, both still `disabled` while `checkoutEnabled` is `false`: a required one whose label links to all three policies (same-tab, via `legalPageLinks`), and a separate, independently optional marketing-consent checkbox. Neither is wired to the API.

**Before enabling each of the following, review `/privacy-policy` again and update it if what it describes has changed**: the payment provider (once selected), Turnstile/bot protection, the email-delivery provider, and Meta Pixel/CAPI. The policy's "ভবিষ্যৎ analytics ও advertising tracking" section explicitly says Meta tracking is not active yet — that sentence must be revisited before it becomes false.

**This legal copy is an operational draft**, written to accurately describe the funnel as built — it is not a substitute for review by the site owner and, ideally, a professional familiar with Bangladeshi consumer/e-commerce law before real payments go live.

### Phase 3B — Abuse protection (Turnstile + rate limiting, both inactive)

Origin validation, rate limiting, and Cloudflare Turnstile verification are fully implemented but **cannot run yet** — `MASTERCLASS_REGISTRATION_ENABLED` is still `false`, and even if it were flipped, `getSecurityEnv()` (`src/lib/env.ts`) returns `null` while `TURNSTILE_SECRET_KEY`/`MASTERCLASS_RATE_LIMIT_SECRET`/`MASTERCLASS_ALLOWED_ORIGINS` are unset, which the route treats identically to the disabled state: a generic `503 REGISTRATION_NOT_OPEN`, before any body parsing, origin check, rate-limit lookup, or MongoDB access. No real Turnstile key exists anywhere in this repo — `.env.example` has empty placeholders only, and the code never falls back to Cloudflare's official always-passes test secret.

**Secure processing order** for the (currently unreachable) enabled path, in `src/app/api/masterclass/registrations/route.ts`:
1. Registration/privacy/security-config gate (`isRegistrationEnabled` + `isPrivacyPolicyPublished` + `getSecurityEnv`) → `503 REGISTRATION_NOT_OPEN`.
2. Same-origin validation (`origin-validation.ts`) → `403 REQUEST_NOT_ALLOWED`.
3. Trusted request-context extraction (`request-context.ts`) → `400 REQUEST_CONTEXT_UNAVAILABLE` if no valid IP.
4. IP rate-limit check (`rate-limit.ts`, scope `"ip"`) → `429 RATE_LIMITED`.
5. Content-Type + `Idempotency-Key` header checks, then body-size enforcement (unchanged from Phase 2).
6. JSON parsing + `registrationInputSchema` (now includes `turnstileToken`).
7. Turnstile Siteverify (`turnstile.ts`) → `403 BOT_VERIFICATION_FAILED` or `503 VERIFICATION_UNAVAILABLE`.
8. Email rate-limit check (scope `"email"`) → `429 RATE_LIMITED`. **An exact idempotent retry (same `Idempotency-Key`) still consumes rate-limit capacity at both this step and step 4** — intentional, documented in the route's own comment, since skipping accounting for "looks like a replay" requests would let an attacker probe the limiter for free.
9. The existing transactional `registerForMasterclass` call — Phase 2's duplicate-registration and idempotency-conflict semantics are completely unchanged by this phase.
10. Sanitized response — still only `publicRegistrationRef`/`publicOrderRef`/`status` on success.

**Origin validation** (`src/lib/masterclass/origin-validation.ts`) is not general CORS — it never reflects an origin or sets `Access-Control-*`, only answers true/false for the registration route specifically. Requires an exact match against `MASTERCLASS_ALLOWED_ORIGINS`; rejects missing, `null`, malformed, or unlisted origins; if `Sec-Fetch-Site` is present it must say `same-origin`/`same-site`. In production, any localhost entry in the allowlist is filtered out as a defense-in-depth safety net regardless of what's configured.

**Trusted IP** (`src/lib/masterclass/request-context.ts`) now prefers `x-vercel-forwarded-for` (set by Vercel's edge, not spoofable by the client) before falling back to `x-forwarded-for`/`x-real-ip`. Capped at 64 chars, only the first syntactically valid entry in a comma-separated chain is kept. **If a proxy or CDN is ever placed in front of Vercel, this trust chain needs re-evaluation** — see the doc comment on `extractClientIp`.

**Rate limiting** (`src/lib/masterclass/rate-limit.ts`) is MongoDB-backed, collection `masterclass_rate_limits`. Each document stores only `scope`, an HMAC-SHA256 `subjectHash` (keyed by `MASTERCLASS_RATE_LIMIT_SECRET`, `node:crypto`, never the raw IP/email), `windowStart`, `count`, `expiresAt`, `createdAt`/`updatedAt` — the raw subject is never persisted. Atomic fixed-window counting via one upserting `findOneAndUpdate` per check (unique index on `(scope, subjectHash, windowStart)`), so concurrent requests can't read a stale count. TTL index on `expiresAt` (`expireAfterSeconds: 0`) auto-deletes each window's document a 5-minute safety buffer after it closes. Limits: **IP — 30/10 min** (kept generous because Bangladeshi mobile/carrier NAT can place many unrelated legitimate students behind one shared public IP); **normalized email — 5/60 min**. A block returns `429 RATE_LIMITED` with an accurate `Retry-After` and `Cache-Control: no-store`; the key, count, email, and IP are never revealed in the response.

**Turnstile** (`src/lib/masterclass/turnstile.ts`) calls Cloudflare's Siteverify with an `AbortController` timeout, at most two attempts sharing one generated `idempotency_key` (Cloudflare's documented safe-retry mechanism), and defensively parses the response. Requires `success === true`, `action === "masterclass_registration"`, and `hostname` in the environment-appropriate allowlist (`masumdev.com`/`www.masumdev.com` only in production — localhost is never accepted there). Every failure mode (timeout, malformed response, action mismatch, hostname mismatch, expired/replayed token, Cloudflare-side failure) collapses to one of exactly two generic reasons — `BOT_VERIFICATION_FAILED` or `VERIFICATION_UNAVAILABLE` — never a raw Cloudflare error code or response body. The token itself is never logged or persisted.

**UI was untouched by Phase 3B.** The client widget and form wiring shipped in Phase 3C, below — but see that section for why the UI still renders nothing extra under the current configuration.

**Before Turnstile is activated for real users**: `/privacy-policy` must be updated to describe it (the policy currently says Meta tracking isn't active — Turnstile isn't mentioned there yet either and needs to be added), and `policyVersions.privacy` must be bumped at the same time so existing consent records stay historically accurate. Don't activate first and document later.

**Vercel's WAF/firewall may be added later as an additional edge layer** (e.g. an Attack Challenge Mode or rate-limiting rule in the Vercel dashboard), but application-level protection (this phase) must not depend on it being present — the app's own origin check, rate limiter, and Turnstile verification must hold up on their own regardless of what edge tooling is or isn't configured.

### Phase 3C — Client registration form + Turnstile widget (still inactive)

`Registration.tsx` (Server Component, unchanged in spirit) computes a single `formEnabled` boolean from **five independent, server-only signals** before deciding what to render: `masterclassConfig.checkoutEnabled` (content/config flag — stays `false`, untouched by this phase, since there's still no payment gateway); `MASTERCLASS_REGISTRATION_ENABLED`; a published privacy policy; complete Turnstile/rate-limit/origin security configuration; and a present `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. The middle three are bundled into one call, `isRegistrationOperationallyReady()` in `src/lib/env.ts` — `Registration.tsx` never calls `getSecurityEnv()` directly, and no `SecurityEnv` value or readiness *reason* ever crosses into a prop; only the final boolean does. `src/lib/env.ts` now carries `import "server-only"` (confirmed first that its only importers — `route.ts`, `mongodb.ts`, `Registration.tsx` — are all server-only already), so an accidental future Client Component import becomes a build error, not a silent runtime bug. There is deliberately no `NEXT_PUBLIC_MASTERCLASS_REGISTRATION_ENABLED` or any other client-visible mirror of a server-only value. Under the current configuration `formEnabled` is `false`, so `Registration.tsx` renders the exact same static, fully-`disabled` form it always has — the new interactive component isn't in the render tree at all in that branch, which is what actually guarantees no Turnstile script, no widget, no `fetch`, and no MongoDB access happen, rather than relying on internal `if` checks inside a mounted component.

**`MasterclassRegistrationForm.tsx`** (Client Component, only ever mounted when `formEnabled` is `true`) is the interactive form: controlled name/email/phone fields, the same required-policy-links + optional-marketing checkboxes as before (now interactive), a honeypot, and submission handling. It imports and reuses `registrationInputSchema`/`normalizeBangladeshPhone`/`attributionInputSchema` from `src/lib/masterclass/validation.ts` directly — the same schema the API route validates against — rather than re-implementing any rule; the two numeric attribution length caps (512/2048) are the only values duplicated, since they aren't exported as standalone constants today.

**`TurnstileWidget.tsx`** explicit-renders Cloudflare's widget (`api.js?render=explicit`, no third-party React wrapper) once its script is ready (checked both via `next/script`'s `onLoad` and a synchronous `window.turnstile` check on mount, since `onLoad` doesn't re-fire on a Strict-Mode remount after the script is already loaded) and the container exists. Strict Mode safe: the render effect's cleanup calls `turnstile.remove()` and clears the local ref, so mount→cleanup→remount ends with exactly one live widget. Exposes an imperative `reset()` (React 19's `ref`-as-a-prop, no `forwardRef`) that the form calls after **every** non-`201` response, since Turnstile tokens are single-use. `action` is hardcoded to `masterclass_registration`, `language: "auto"`. `TURNSTILE_SECRET_KEY` is never referenced anywhere in this file or any other Client Component — only `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, passed down as a prop from `Registration.tsx`.

**Idempotency**: one `crypto.randomUUID()` per logical submission, held in a `useRef` (component-instance memory only — no `localStorage`, nothing logged, gone on reload). Reused across a network-failure or 400/403/429/503 retry of an *unchanged* submission (compared via a JSON snapshot of name/email/phone/policy-acceptance/marketing-consent); regenerated the moment any of those five differ at the next submit.

**The two `409` codes are handled differently, not as one generic "conflict."** `IDEMPOTENCY_CONFLICT` means the previous key no longer maps to a safe replay, so the form clears both the key and its field snapshot — the next submit always mints a fresh UUID, even if nothing else changed — and shows a plain "try again" message. `REGISTRATION_CONFLICT` means the submitted email is already registered under a different phone: a data problem, not a request-key problem, so the idempotency key is deliberately left untouched (rotating it wouldn't fix anything) and the message asks the student to verify their email/phone or contact `masum@masumdev.com` directly, without revealing any detail about the existing registration.

**No payment redirect exists.** A `201` response only means a draft registration/order was created — the success state explicitly says the payment gateway isn't connected yet and never claims enrollment or payment success, never fires a Purchase event (none exists), and never redirects anywhere. The returned `publicRegistrationRef`/`publicOrderRef` are held in component state only, for a future payment-initiation step, and are never displayed.

**No CSP was added.** This project has no existing Content-Security-Policy (checked `next.config.ts` and confirmed no `middleware.ts`) — Cloudflare's script/frame/connect origins were not added anywhere, since there is no existing policy to extend. If a CSP is introduced later, it must allow `https://challenges.cloudflare.com` for `script-src`, `frame-src`, and `connect-src` per Cloudflare's Turnstile documentation.

**Before this form can go live**: `/privacy-policy` must describe Turnstile and its `policyVersions.privacy` bumped (not done in this phase, since the widget still never renders under the current config — see the Phase 3B note above), and `masterclassConfig.checkoutEnabled` still needs a real payment gateway behind it before it can ever become `true`.

## Resources

`resources/` holds design input, not app assets — copy what's needed into `public/`, don't import from it.

- `demo.png` — visual reference for **color, spacing, and mood**: warm cream→peach wash, black pill nav CTA, oversized display headline, "available for new opportunities" chip with an orange dot, cut-out portrait bleeding into the type. Its typefaces are *not* the spec — Playfair Display / Poppins above govern.
- `masum.png` (4:3), `masum-2.png` (16:9) — portrait photos on the warm wash. Hero art. Both carry their own baked-in cream backdrop and are **not** cut out, so the hero frames `masum.png` in a rounded panel and crops it to a portrait ratio rather than floating it against the page.
- `upwork-client-feedback-*.png`, `fiverr-client-feedback-*.png` — the source of every quote in `src/data/testimonials.ts`, transcribed verbatim. Client names are redacted in the screenshots and must stay withheld. **Never write a testimonial that isn't in one of these files.**
