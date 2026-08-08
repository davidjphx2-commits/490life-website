# 490.life Ecosystem — Design Spec

**Date:** 2026-08-07 · **Approved by:** David · **Status:** Phases 1-2 LIVE (2026-08-08 overnight); Phase 3 blocked on Printful store-attach (their side) + Stripe account; Phase 4 pending

## Vision

490.life becomes David's anchor ministry brand — teaching, blog, books, merch — "a resource for everything about life with God." davidslaysgoliath.com content folds in; DSG remains live as a satellite until redirects complete. The book funnel survives intact as one page of a larger ecosystem.

## Decisions made (2026-08-06/07 sessions)

| Decision | Choice |
|---|---|
| Anchor brand | 490.life (DSG = story/testimony inside the brand, keeps its social handles for now) |
| Merch stack | WooCommerce + official Printful plugin + Stripe, on `shop.490.life` (VPS container) |
| Blog workflow | Joint venture: Silas research → David drafts (Creative Studio Canvas) → automated publish via Studio scheduler |
| ESP | **Brevo** (revised from MailerLite — Studio full-send four, verified merge tags, powers approval-link mail). Free tier. Newsletter live from day one |
| DSG content | Port all five pages as-is, reskin only; banners now, 301s when live |
| Homepage #1 job | Email capture (newsletter + free prayer study guide PDF) |
| Email | Google Workspace on 490.life live 2026-08-07 (`david@490.life`), MX at Shopify DNS |
| Printful account | Created 2026-08-07 (Google login, davidjphx2@gmail.com). No designs yet — Phase 3 |

## Architecture

```
Shopify DNS (490.life)
├── @ / www  A → 2.25.204.242 ── Coolify: 490life-website (static, Eleventy build)
├── shop     A → 2.25.204.242 ── Coolify: WordPress + WooCommerce + Printful + Stripe
├── MX → smtp.google.com (Workspace)
└── TXT: SPF/DKIM/DMARC (Google), Brevo sender auth (added Phase 1)

Mission Control / Creative Studio (existing, VPS)
├── Canvas: post drafting (David + Silas)
├── Approval chain + scheduler (calendar scheduling of posts)
├── Brevo ESP connector: weekly newsletter full-send
└── BLOG_WEBHOOK_URL → NEW publishing bridge → GitHub commit → Coolify auto-deploy
```

### Components

1. **Main site — Eleventy static site** (rebuild of current repo `490life-website`)
   - Same Coolify hosting; build step added (Eleventy → static output). Auto-deploy on push unchanged.
   - Blog posts = markdown files in repo. Eleventy generates post pages, `/teachings` index, RSS, sitemap.
   - Design system: cathedral-light (cream `#FBF7EE`, antique gold `#C8A24C`, deep brown `#241a10`; Cormorant Garamond + EB Garamond; winged-lion mark) extended sitewide.

2. **Publishing bridge** (new, small)
   - Endpoint receiving Studio's blog-webhook JSON (`TITLE:` + markdown) → converts to Eleventy post file → commits to GitHub via API → auto-deploy. Runs as tiny Coolify service (or n8n route). Auth: shared secret header.
   - Enables: David writes several posts in Studio, schedules on calendar, they publish unattended.

3. **Shop — WordPress/WooCommerce container** (`shop.490.life`)
   - New Coolify app: WordPress + MariaDB. WooCommerce + official Printful integration plugin + Stripe gateway (cards, Apple/Google Pay).
   - Product flow: design in Printful → publish → auto-appears in shop (mockups, variants, prices). Orders auto-forward to Printful for fulfillment.
   - Theme: minimal Woo theme skinned to 490 palette/type.
   - Tax: David is merchant of record; configure AZ sales tax; revisit thresholds if volume grows.
   - Verify current Printful plugin status + Stripe fees from live docs during planning (facts from memory, must confirm).

4. **Email/newsletter — Brevo**
   - Free tier. Site signup forms → Brevo list. Lead magnet: prayer teaching doc restyled as branded 490 Life PDF study guide, auto-delivered on signup.
   - Weekly teaching → Brevo campaign, full-send scheduled from Studio.
   - Brevo sender authentication TXT records at Shopify DNS.
   - Replaces interim FormSubmit capture.

5. **Analytics — Umami** (self-hosted container, cookie-free) — traffic + popular-post dashboard.

## Site map

| URL | Content |
|---|---|
| `/` | Brand home. Hero: "What is the 490 Life?" (70×7, Matt 18:22). Primary CTA: newsletter + free study guide. Secondary: book, latest teachings, shop, about |
| `/seventy-times-seven` | Book funnel (current page ported, conversion-pure; Amazon CTA a.co/d/04EfFHKO) |
| `/teachings`, `/teachings/<slug>` | Weekly teaching posts. Launch post: The Necessities for Effective Prayer (Mark 11:22-25) |
| `/gospel`, `/bible`, `/studying-the-bible`, `/christian-life`, `/finding-a-church` | DSG ports, content as-is, reskinned |
| `/about` | David's story incl. David-slays-Goliath testimony |
| shop.490.life | Merch |

DSG: banner per page → matching 490 URL now; 301 redirects (nginx config in DSG container) once equivalents live; DSG domain retained.

## Weekly content pipeline

1. David names passage/topic → Silas researches (yt-transcript/biblical-research pipeline) → research summary + teaching doc to Canvas.
2. David drafts post in Canvas (AI rail assists; edits are accept/reject).
3. Approval chain → schedule on calendar.
4. Scheduler fires → bridge publishes to site + Brevo campaign sends.
5. Silas: SEO pass per post, vault filing. One study session yields: post + newsletter + PDF/lead-magnet updates + future shorts.

## Phases

1. **Foundation** — Eleventy rebuild, home, book page port, `/teachings` + prayer post, about, Brevo wiring + lead-magnet PDF, launch. Site swap is atomic (same container, new build).
2. **DSG fold-in** — five pages ported + banners; 301s.
3. **Shop** — WP/Woo container, Printful plugin, Stripe (David creates account + enters keys), theme skin, AZ tax, test order end-to-end. First shirt-design session (Magnific concepts → Printful).

   **Merch brand direction (David, 2026-08-07):**
   - Brand mark: gold crowned winged lion + wordmark (as on book back cover, MINUS "Publishing" line). Source asset: `Downloads\Brand Logo with Powerful Lion Emblem.png` (lion + "490LIFE", no publishing text) — strip background to transparent for print; resolution fine at sleeve/neck size, upscale if large placements needed.
   - Mark placement: sleeve OR center back-neck (small, by the collar). Consistent across the line.
   - Front of shirts: creative/witty Christian sayings (design sessions produce these; mockups via image gen before Printful upload).
   - Open micro-decision at design session: wordmark "490LIFE" (as in asset) vs "490.LIFE".
4. **Automation + polish** — publishing bridge, Studio tenant setup for 490 Life, Umami, sitemap/RSS/SEO verification.

Phases 1–2 have no external dependencies. Phase 3 blocks on Stripe account. Phase 4 blocks on nothing but ordering.

## David's action list

- [x] Google Workspace on 490.life (done 2026-08-07)
- [x] Printful account (done 2026-08-07)
- [ ] Brevo account (Phase 1 — free; Silas walks through)
- [ ] Stripe account (Phase 3; David enters API keys himself — credential rule)
- [ ] Google Admin: DKIM, DMARC, catch-all (from email setup — still open)

## Non-goals (v1)

- No CMS/admin UI on the main site (Studio is the authoring surface)
- No membership/login, no comments, no podcast feed
- No paid ads until blog + email capture live (existing 490 book-ads TODO stays parked)
- DSG redesign work: none — banners/redirects only

## Risks / honest notes

- Printful/Stripe/Brevo facts to be re-verified against live docs at planning time.
- WordPress container = ongoing update maintenance (Silas-owned, sessions).
- Publishing bridge is custom code on the content path (not the money path) — failure mode is a post not publishing, recoverable; alerting via Studio's honest inbox due-card.
- Sales tax stays David's responsibility as merchant of record (AZ initially).
