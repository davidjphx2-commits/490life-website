# 490.life Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild 490.life as an Eleventy multi-page brand site — home (email-capture-first), book funnel page, teachings blog with launch post, about page, Brevo newsletter + PDF lead magnet — and launch on the existing Coolify pipeline.

**Architecture:** Eleventy 3.x static site generator; source in `src/`, output `_site/`. Existing single-page funnel becomes `/seventy-times-seven` nearly verbatim. Blog posts are markdown files rendered through a post layout; Eleventy generates `/teachings` index, RSS, sitemap. Brevo hosted-form action wired through site data. Same Coolify app deploys it (build command added at cutover).

**Tech Stack:** Eleventy `@11ty/eleventy@^3`, Nunjucks templates, existing hand-rolled CSS (extended, not replaced), Brevo free tier, Desktop Commander `write_pdf` for the lead magnet.

## Global Constraints

- Brand system (spec §Components-1): cream `#FBF7EE`, antique gold `#C8A24C`, deep brown `#241a10`; fonts Cormorant Garamond (display) + EB Garamond (body); winged-lion logo `assets/logo.png`; header wordmark "490.life".
- Book funnel page must keep: all Amazon CTAs → `https://a.co/d/04EfFHKO`; Book JSON-LD; og:image cover.
- Primary homepage CTA = newsletter signup + free study guide (spec §Homepage job).
- Email contact everywhere: `david@490.life`.
- Outward-facing footer: winged-lion + "© 2026 490 Life Publishing".
- No CMS, no comments, no memberships (spec non-goals).
- Deploy: push to `main` → GitHub webhook → Coolify. **"Pushed ≠ live"** — always verify with a live-content probe after cutover (CLAUDE.md lesson 2026-07-20).
- Cache lesson 2026-07-30: static shells need `Cache-Control: no-cache` — handled in Task 9 via Coolify/nginx check; CSS keeps `?v=N` query-version pattern.
- Windows: run npm/node via Bash tool; real-disk writes via Write/Edit or `dangerouslyDisableSandbox` Bash.

---

### Task 1: Eleventy scaffold + passthrough of existing site

**Files:**
- Create: `package.json`, `.eleventy.js`, `.gitignore`, `src/_data/site.json`
- Move: `index.html` → `src/seventy-times-seven.html` (temporary; becomes njk in Task 4), `style.css` → `src/css/style.css`, `assets/*` → `src/assets/*`
- Test: build output check

**Interfaces:**
- Produces: `npm run build` → `_site/`; `npm run serve` → localhost:8080. `site.json` fields consumed by all later tasks: `{ "url": "https://490.life", "name": "490 Life", "email": "david@490.life", "brevoFormAction": "" }`

- [ ] **Step 1:** `package.json`:

```json
{
  "name": "490life-website",
  "private": true,
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve"
  },
  "devDependencies": { "@11ty/eleventy": "^3.0.0" }
}
```

- [ ] **Step 2:** `.eleventy.js`:

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());
  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
```

- [ ] **Step 3:** `.gitignore`: `node_modules/`, `_site/`. Move files per **Files** list (`git mv`).
- [ ] **Step 4:** `npm install` then `npm run build`. Expected: `_site/seventy-times-seven/index.html` exists (11ty pretty-URLs the .html file), assets + css copied.
- [ ] **Step 5:** Commit: `feat: eleventy scaffold, existing funnel preserved under /seventy-times-seven`

### Task 2: Base layout + shared header/footer (brand shell)

**Files:**
- Create: `src/_includes/base.njk`
- Modify: `src/css/style.css` (append nav + footer + page-shell rules)

**Interfaces:**
- Produces: layout `base.njk` consumed by every page. Front-matter contract: `title`, `description`, optional `ogImage` (default `/assets/logo.png`), optional `canonical`.

- [ ] **Step 1:** `base.njk` — head mirrors current index.html head pattern (fonts preconnect, Cormorant/EB Garamond stylesheet link, `style.css?v=8`), plus:

```njk
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ title }} | 490 Life</title>
<meta name="description" content="{{ description }}">
<link rel="canonical" href="{{ site.url }}{{ page.url }}">
<meta property="og:title" content="{{ title }}"><meta property="og:description" content="{{ description }}">
<meta property="og:url" content="{{ site.url }}{{ page.url }}">
<meta property="og:image" content="{{ site.url }}{{ ogImage or '/assets/logo.png' }}">
<meta property="og:site_name" content="490 Life">
{# fonts + css links copied verbatim from current index.html head #}
</head>
<body>
<header class="site-header"><div class="container header-inner">
  <a href="/" class="brand"><img src="/assets/logo.png?v=3" alt="490 Life" class="brand-logo"><span class="brand-word">490.life</span></a>
  <nav class="site-nav">
    <a href="/teachings/">Teachings</a>
    <a href="/seventy-times-seven/">The Book</a>
    <a href="/about/">About</a>
    <a href="#subscribe" class="nav-cta">Join the List</a>
  </nav>
</div></header>
{{ content | safe }}
<footer class="site-footer"><div class="container">
  <img src="/assets/logo.png?v=3" alt="" class="footer-logo">
  <p>490 = seventy times seven. <em>Matthew 18:22.</em></p>
  <p><a href="mailto:david@490.life">david@490.life</a></p>
  <p class="fine">© 2026 490 Life Publishing · Created by David S. Jones</p>
</div></footer>
</body></html>
```

- [ ] **Step 2:** CSS append — `.site-nav` (EB Garamond small-caps links, gold hover underline), `.nav-cta` (gold pill), mobile: nav wraps under brand. Footer: brown band matching existing `.site-header` treatment. Keep every existing rule untouched.
- [ ] **Step 3:** Build; view a dummy page using layout in browser at 1280px and 375px. Header/footer render, nav readable both widths.
- [ ] **Step 4:** Commit: `feat: shared brand shell (base layout, nav, footer)`

### Task 3: Homepage (email-capture-first)

**Files:**
- Create: `src/index.njk`
- Modify: `src/css/style.css` (hero, pillar cards, signup band)

**Interfaces:**
- Consumes: `base.njk`, `site.brevoFormAction` (empty until Task 7 — form renders with `data-pending` and is completed in Task 7).

- [ ] **Step 1:** `src/index.njk` — sections, real copy (edit freely at review):
  1. **Hero:** kicker "SEVENTY TIMES SEVEN · MATTHEW 18:22" · H1 "Live the 490 Life." · sub: "When Peter asked how many times he had to forgive, Jesus ended the counting: seventy times seven. 490 isn't a number — it's a way of life with the God who keeps no record of wrongs." · primary CTA button → `#subscribe` ("Get the free study guide") · secondary link → `/teachings/`.
  2. **What is 490? band** — three short paragraphs (the question, the answer, the invitation), gold rule between.
  3. **Latest teachings** — list newest 3 via `collections.teachings` (title, date, excerpt, Read link).
  4. **Book card** — cover.jpg, one-line hook ("He kept no record of your wrongs. Why do you still keep yours?"), CTA → `/seventy-times-seven/`.
  5. **Signup band `#subscribe`** — H2 "Weekly teachings, straight to you." · benefit line (one teaching a week + the free *Necessities of Effective Prayer* study guide) · form (email field + button) posting to `{{ site.brevoFormAction }}`.
- [ ] **Step 2:** CSS: hero = cathedral-light treatment reused from funnel (light-shaft SVG + glow already in stylesheet — reuse classes); pillar/teaching cards on cream with brown text, gold accents; signup band = brown with gold button.
- [ ] **Step 3:** Build + browser check desktop/mobile; all five sections present, no horizontal scroll at 375px.
- [ ] **Step 4:** Commit: `feat: new homepage — brand hero, teachings, book card, signup band`

### Task 4: Book page port

**Files:**
- Modify: `src/seventy-times-seven.html` → rename `src/seventy-times-seven.njk`, add front matter, strip duplicated header/footer, keep everything else byte-faithful

- [ ] **Step 1:** Add front matter (`layout: base.njk`, `title: Seventy Times Seven — On the God Who Forgives Past All Counting`, description + `ogImage: /assets/cover.jpg` copied from current metas). Delete the old inline `<header>`/`<footer>` blocks (base.njk provides them). Keep Book JSON-LD block inside page body via a `<script type="application/ld+json">` (valid anywhere).
- [ ] **Step 2:** Grep `_site/seventy-times-seven/index.html` for `a.co/d/04EfFHKO` — count must equal the old file's count. Verify JSON-LD present once.
- [ ] **Step 3:** Browser-compare against live 490.life — visually equivalent (hero, journey, quote, bio, capture, CTA).
- [ ] **Step 4:** Commit: `feat: book funnel ported to /seventy-times-seven under shared shell`

### Task 5: Teachings blog (layout, index, launch post, RSS, sitemap)

**Files:**
- Create: `src/_includes/post.njk`, `src/teachings/index.njk`, `src/teachings/teachings.json`, `src/teachings/necessities-of-effective-prayer-mark-11.md`, `src/feed.njk`, `src/sitemap.njk`, `src/robots.txt`

**Interfaces:**
- Produces: collection `teachings` (tag applied via directory data), consumed by homepage §3 and index. Post front-matter contract: `title`, `date`, `description`, `passage`.

- [ ] **Step 1:** `src/teachings/teachings.json`:

```json
{ "layout": "post.njk", "tags": ["teachings"], "permalink": "/teachings/{{ page.fileSlug }}/" }
```

- [ ] **Step 2:** `post.njk` — extends base: article header (passage kicker, H1, date), prose column (65ch), scripture blockquote styling, end-of-post signup band (same `#subscribe` include as homepage — extract to `src/_includes/signup.njk`, used by both), book callout box when front matter `bookCallout: true`.
- [ ] **Step 3:** `teachings/index.njk` — reverse-chron list of `collections.teachings`: title, date (`readableDate`), description, passage badge.
- [ ] **Step 4:** Launch post — convert `D:\Vault\wiki\theology\scripture\mark-11-22-25-necessities-effective-prayer.md` to post markdown: strip vault frontmatter, add post front matter (`title: The Necessities for Effective Prayer`, `passage: Mark 11:22-25`, `date: 2026-08-10`, `bookCallout: true`, description = the short-answer line); keep the five-necessities structure; the forgiveness section's book callout links `/seventy-times-seven/`.
- [ ] **Step 5:** `feed.njk` (Atom, permalink `/feed.xml`) and `sitemap.njk` (permalink `/sitemap.xml`) over `collections.all`; `robots.txt` allows all + sitemap line.
- [ ] **Step 6:** Build. Verify `_site/teachings/index.html` lists the post; post page renders scripture quotes; `feed.xml` + `sitemap.xml` valid XML (`py -c "import xml.dom.minidom,..."` parse both).
- [ ] **Step 7:** Commit: `feat: teachings blog — post layout, index, RSS, sitemap, launch post`

### Task 6: About page

**Files:**
- Create: `src/about.njk`

- [ ] **Step 1:** Sections: David's story (adapt author bio from book page — expand with faith journey; David reviews copy), **The David-and-Goliath story** block (testimony framing, references davidslaysgoliath.com as "where this began"), photo `assets/david-jones.jpg` (width:100% height:auto — known warp gotcha), contact line `david@490.life`, signup include.
- [ ] **Step 2:** Build + browser check. Commit: `feat: about page with testimony corner`

### Task 7: Brevo — account, form, welcome automation, lead magnet delivery

**Files:**
- Create: `src/assets/490-life-study-guide-necessities-of-effective-prayer.pdf`
- Modify: `src/_data/site.json` (`brevoFormAction`), `src/_includes/signup.njk` (final field names), `src/thank-you.njk` (new)

**Interfaces:**
- Consumes: David creates Brevo account (free) — **David-only step (credentials rule)**.
- Produces: working double-opt-in signup delivering the PDF.

- [ ] **Step 1:** Lead-magnet PDF: restyle the teaching doc to brand (Garamond/gold/brown, lion + "490.LIFE" cover header, footer "© 2026 490 Life Publishing · 490.life") as print HTML; render via Desktop Commander `write_pdf`; save to `src/assets/...pdf`. Eyeball every page.
- [ ] **Step 2 (David):** Create Brevo account; Silas guides live (browser co-drive). Then Silas (with David at keys for login): create list "490 Life Weekly", signup form (email only) with double opt-in, redirect after confirm → `https://490.life/thank-you/`; welcome automation email containing the study-guide download link `https://490.life/assets/490-life-study-guide-necessities-of-effective-prayer.pdf`; sender `david@490.life` (add Brevo domain-auth TXT records at Shopify DNS — same routine as Google's).
- [ ] **Step 3:** Paste form action URL into `site.json.brevoFormAction`; align `signup.njk` input names to Brevo's form contract (typically `EMAIL`); create `thank-you.njk` (confirmation + "check your inbox for the study guide" + latest teachings links).
- [ ] **Step 4:** End-to-end test with a non-David external address: subscribe → confirm → welcome mail arrives → PDF downloads. **Do not mark done until the mail lands.**
- [ ] **Step 5:** Commit: `feat: brevo signup wired end-to-end + branded study guide lead magnet`

### Task 8: Build-output smoke test script

**Files:**
- Create: `scripts/smoke.js`

- [ ] **Step 1:** Node script asserting over `_site/`: every expected page exists (`/`, `/seventy-times-seven/`, `/teachings/`, `/teachings/necessities-of-effective-prayer-mark-11/`, `/about/`, `/thank-you/`, `/feed.xml`, `/sitemap.xml`); every internal `href` in every HTML file resolves to a file in `_site`; homepage contains `id="subscribe"`; book page contains `a.co/d/04EfFHKO` and `application/ld+json`; no page contains `undefined` or `{{`. Exit 1 on any failure, listing them.
- [ ] **Step 2:** Run `node scripts/smoke.js` — expected: `ALL CHECKS PASS`. Add `"test": "node scripts/smoke.js"` to package.json.
- [ ] **Step 3:** Commit: `test: build smoke checks (pages, links, CTAs)`

### Task 9: Cutover + live verification

**Files:**
- Modify: Coolify app `490life-website` settings (dashboard, not repo)

- [ ] **Step 1:** Pre-push: `npm run build && npm test` green; full-site browser pass (desktop + mobile) on local serve.
- [ ] **Step 2:** Coolify: switch app to nixpacks/static-with-build — build `npm ci && npm run build`, publish dir `_site`. Check custom-nginx option; if available add `add_header Cache-Control "no-cache, must-revalidate" always;` for HTML (lesson 2026-07-30).
- [ ] **Step 3:** Push `main`. Watch Coolify build to success (not just webhook green).
- [ ] **Step 4:** Live probes: `curl -s https://490.life/ | grep "Live the 490 Life"` (new-code probe); curl each page URL → 200; `curl -sI https://490.life/` header check.
- [ ] **Step 5:** Full browser pass on production, both widths. Then: vault filing (infra page update, log entry, manual page per Operator's Manual rule — visual manual with site map + publish pipeline), spec status flip to "Phase 1 live".
- [ ] **Step 6:** Commit docs: `docs: phase 1 launch notes + manual`

---

## Self-review

- **Spec coverage:** home/book/blog/about/email/lead-magnet/launch — Tasks 3/4/5/6/7/9. Analytics, bridge, DSG ports, shop = later phases per spec. ✔
- **Placeholder scan:** `brevoFormAction` empty-until-Task-7 is declared dependency injection, not a TBD; copy marked for David review is real draft copy. ✔
- **Consistency:** layout name `base.njk`, collection `teachings`, include `signup.njk` used identically across tasks. ✔
