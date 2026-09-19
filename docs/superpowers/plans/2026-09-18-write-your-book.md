# 490 Life Book Studio: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `/write-your-book/` offer on 490.life plus the sales kit, content bank, service agreement, and a v1 production pipeline, so David can send the first 50 Instagram DMs Saturday night 2026-09-19 and take calls Monday.

**Architecture:** Two workspaces. (1) The website repo gets one new page, one thanks page, nav/footer links and a home strip, additions only, on a branch merged to `main` for Coolify. (2) A new `490life-book-studio` project holds the operating kit (sales, content, paper) and a prompt-driven Python CLI that turns a client's raw material into a KDP-ready manuscript.

**Tech Stack:** Eleventy 3 + Nunjucks + `scripts/smoke.js` (site). Python 3.14 (`py`), Claude via `claude -p`, existing `md2pdf.py` engine for PDFs, Whisper via the `/watch` toolchain for audio (studio). Cal.com free tier, Stripe payment links on the existing 490 Life account, Brevo for email.

**Spec:** `docs/superpowers/specs/2026-09-18-write-your-book-design.md` (canonical copy: `D:\Vault\wiki\490 Life\book-studio\book-studio-design-spec.md`)

## Global Constraints

- Website: **additions only.** No existing page restyled, rewritten, or removed. Allowed touches to existing files: one nav link + one footer link in `src/_includes/base.njk`, one new strip section in `src/index.njk`, new CSS rules appended to `src/css/style.css` (no edits to existing rules), entries in `scripts/smoke.js`, one key in `src/_data/site.json`.
- Copy: 490 voice per `memory/feedback_490_voice.md`: **no em-dashes anywhere**, headings use colons, no AI tells, no invented metrics. Client-facing prices exactly: Assembled $1,500 / Drawn Out $3,500 / Co-Written $8,500 / Voice $600 per month. Founding offer ($2,000) is **never** on the page.
- Palette/type: existing Laguna tokens (`--deep`, `--ocean`, `--gold`, `--mist`, `--foam`, `--line`), Cormorant display + Figtree body, existing classes (`page-hero`, `split`, `section-line`, `two-col`, `steps`, `onesheet`, `notbox`, `cta-band`, `btn-*`, `eyebrow`, `kicker`, `list-plain`).
- Branch `write-your-book`; local preview verified by screenshot before merge; `npm run build && npm test` green before every commit.
- Books publish under the **client's** KDP account. Client owns all rights.
- Nothing is sent to anyone (DMs, posts, emails) by Silas. Silas drafts; David sends.

---

## Part A: Website (Saturday)

### Task 1: `/write-your-book/` page + CSS

**Files:**
- Create: `src/write-your-book.njk`
- Modify: `src/css/style.css` (append only, after the last rule)
- Modify: `scripts/smoke.js` `expectPages` (add `"write-your-book/index.html"`)

**Interfaces:**
- Produces: `/write-your-book/` with anchors `#how`, `#tiers`, `#voice`, `#faq`, `#call`. Booking URL comes from site-data key `site.bookCallUrl` (Task 3 adds it).

- [ ] **Step 1: Add the smoke expectation (failing test)**: in `scripts/smoke.js` add `"write-your-book/index.html",` to `expectPages`.
- [ ] **Step 2: Run to verify it fails**: `npm run build && npm test` → `MISSING: write-your-book/index.html`.
- [ ] **Step 3: Write the page.** Front matter:

```njk
---
layout: base.njk
title: "Write Your Book: From Sermon Series or Story to Amazon in 90 Days"
description: "Christian book and devotional production with David S. Jones. You talk, I draw it out, we edit it together, and it's on Amazon in ninety days. Pastors, coaches, and anyone with a book in them."
permalink: /write-your-book/
ogImage: /assets/david-headshot-beach.jpg
---
```

Sections, in order, copy written with the `writing` skill in 490 voice:
1. `section.page-hero > .container.split`: kicker "Write your book · Pastors, coaches, anyone with one in them"; h1 with one `<i>` phrase; lead paragraph; actions: `btn-primary` "Book a 20-minute call" → `{{ site.bookCallUrl }}`, `btn-ghost` "How it works" → `#how`; right column `.photo-pair`: `figure` `/assets/david-headshot-beach.jpg`, `figure` `/assets/cover.jpg` (Seventy Times Seven) captioned as proof.
2. `section.section-line > .container.two-col`: eyebrow "Who this is for"; `ul.list-plain` three segments (pastor with a sermon series, Christian coach or counselor with a framework, believer with a devotional or a testimony); `.notbox` "What this is not" (not a content mill, not a template, not your name on someone else's theology; you approve every word before it prints).
3. `section.section-line.on-light#how > .container.two-col`: eyebrow "How it works"; `.steps` three `.step`: 1 A first call · 2 We draw it out (interviews or your sermons, in your voice) · 3 It ships (edit together, cover, Amazon, under your account).
4. `section.section-line#tiers > .container`: eyebrow "Three ways to work"; `.tiers` grid, three `.tier`, middle `.tier.featured` (Drawn Out $3,500); each: eyebrow tier name, h3, `.price` with `<small>`, `.fit` line, `ul` inclusions, `a.btn` → `#call`. Note under grid: devotionals, same three ways, shorter book, priced on the call.
5. `section.section-line.on-light#voice > .container.two-col`: eyebrow "After the book, or instead of it"; Voice $600 per month, 12 posts and a monthly letter from one 20-minute voice note.
6. `section.section-line > .container`: eyebrow "Proof"; `.onesheet` three cells: the book (link `/seventy-times-seven/`), thirty years of listening for a living, 490 Life itself.
7. `section.section-line.on-light#faq > .container`: eyebrow "Questions"; `.faq` of `details > summary`: Who owns it? · Whose name is on it? · I have nothing written · How long? · What about a devotional? · How do you know my voice? · What does publishing cost? (KDP is free; cover included).
8. `section.cta-band#call`: eyebrow "Start here"; h2 "Book the twenty-minute call."; p; `a.btn-gold` → `{{ site.bookCallUrl }}`; small line: or email `{{ site.email }}` subject "My book."
9. `{% include "signup.njk" %}`

Append to `src/css/style.css`:

```css
/* Write Your Book: tiers + faq (2026-09-19) */
.tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem; align-items: stretch; }
.tier { background: #fff; border: 1px solid var(--foam); border-radius: var(--radius); padding: 1.8rem 1.6rem; display: flex; flex-direction: column; gap: 0.6rem; }
.tier .eyebrow { margin-bottom: 0; }
.tier h3 { font-size: 1.7rem; color: var(--deep); }
.tier .price { font-family: var(--display); font-size: 2.4rem; color: var(--deep); line-height: 1; margin: 0.2rem 0 0.4rem; }
.tier .price small { font-family: var(--body); font-size: 0.85rem; color: var(--ink-soft); margin-left: 0.3rem; }
.tier .fit { font-size: 0.92rem; color: var(--ink-soft); }
.tier ul { list-style: none; padding: 0; margin: 0.4rem 0 1rem; display: grid; gap: 0.35rem; font-size: 0.92rem; flex: 1; }
.tier li::before { content: "\00b7"; color: var(--gold); font-weight: 700; margin-right: 0.5rem; }
.tier.featured { background: var(--deep); border-color: var(--deep); color: #fff; box-shadow: 0 28px 50px -30px rgba(14, 59, 69, 0.55); }
.tier.featured h3, .tier.featured .price { color: #fff; }
.tier.featured .eyebrow, .tier.featured .price small, .tier.featured li::before { color: var(--gold); }
.tier.featured .fit, .tier.featured ul { color: rgba(255, 255, 255, 0.8); }
.faq { display: grid; gap: 0.6rem; margin-top: 1.6rem; max-width: 72ch; }
.faq details { border: 1px solid var(--line); border-radius: var(--radius); background: #fff; padding: 0.9rem 1.2rem; }
.faq summary { cursor: pointer; font-family: var(--display); font-size: 1.3rem; color: var(--deep); }
.faq details p { margin-top: 0.6rem; font-size: 0.95rem; color: var(--ink-soft); }
@media (max-width: 900px) { .tiers { grid-template-columns: 1fr; } }
```

- [ ] **Step 4: Verify**: `npm run build && npm test` → no failures. Em-dash count in `src/write-your-book.njk` → 0.
- [ ] **Step 5: Commit on branch**

```bash
git checkout -b write-your-book
git add src/write-your-book.njk src/css/style.css scripts/smoke.js
git commit -m "Add Write Your Book page: tiers, Voice add-on, FAQ, call CTA"
```

### Task 2: Thanks page, nav + footer links, home strip

**Files:**
- Create: `src/write-your-book-thanks.njk` → `/write-your-book/thanks/`
- Modify: `src/_includes/base.njk` nav (after the Coaching link) and footer "Work with David" list
- Modify: `src/index.njk` (insert `section.book-strip` immediately after the `</section>` closing `.doors`)
- Modify: `src/css/style.css` (append)
- Modify: `scripts/smoke.js` (add `"write-your-book/thanks/index.html"`)

- [ ] **Step 1**: smoke expectation, run, confirm `MISSING`.
- [ ] **Step 2: Thanks page**: `layout: base.njk`, `permalink: /write-your-book/thanks/`, `eleventyExcludeFromCollections: true`. Copy: "You're on the calendar." What happens next (three lines), what to bring to the call, link to `/teachings/`.
- [ ] **Step 3: Nav + footer**: after `<a href="/coaching/">Coaching</a>` insert `<a href="/write-your-book/">Write Your Book</a>`; in footer "Work with David" insert `<li><a href="/write-your-book/">Write your book</a></li>` after the coaching item. Nothing else.
- [ ] **Step 4: Home strip** after `.doors`:

```njk
<section class="book-strip">
  <div class="container book-strip-inner">
    <div>
      <div class="eyebrow">New</div>
      <h2 class="section-title">Write your book. Ninety days to Amazon.</h2>
      <p>For pastors with a sermon series, coaches with a framework, and believers with a devotional they keep putting off. You talk, I draw it out, we ship it under your name.</p>
    </div>
    <a class="btn btn-gold" href="/write-your-book/">See how it works</a>
  </div>
</section>
```

CSS append:

```css
.book-strip { background: var(--deep); color: #fff; }
.book-strip .eyebrow { color: var(--gold); }
.book-strip .section-title { color: #fff; }
.book-strip p { color: rgba(255, 255, 255, 0.78); max-width: 60ch; }
.book-strip-inner { display: flex; align-items: center; justify-content: space-between; gap: 2rem; padding: 3rem 0; }
@media (max-width: 800px) { .book-strip-inner { flex-direction: column; align-items: flex-start; } }
```

- [ ] **Step 5**: build + smoke; em-dash counts unchanged in `index.njk`/`base.njk`, 0 in the thanks page; `git diff --stat` shows only the allowed files.
- [ ] **Step 6: Commit**

```bash
git add src/write-your-book-thanks.njk src/_includes/base.njk src/index.njk src/css/style.css scripts/smoke.js
git commit -m "Link Write Your Book from nav, footer and home; add thanks page"
```

### Task 3: Booking URL, local preview, merge, deploy

**Files:**
- Modify: `src/_data/site.json` (add `"bookCallUrl"`)

- [ ] **Step 1**: add `"bookCallUrl": "https://cal.com/davidsjones/write-your-book"` (provisional; David confirms the handle when he creates the Cal.com account). Build + smoke.
- [ ] **Step 2: Preview**: `npx eleventy --serve --port 8080`; open `/write-your-book/` in the built-in browser; screenshot desktop + 375px. Check: hero photos load, tiers 3-up with dark featured card, FAQ opens, CTAs resolve, home strip present, nav link present. Fix, commit.
- [ ] **Step 3: Merge + deploy**: `git checkout main && git merge --no-ff write-your-book && git push origin main`; confirm `git log origin/main -1`; wait for Coolify; verify `https://490.life/write-your-book/` is 200, contains "Drawn Out", has 0 em-dashes.
- [ ] **Step 4**: log commit hash + URL in `D:\Vault\wiki\490 Life\book-studio\log.md`.

---

## Part B: Studio workspace (Saturday night + Sunday)

### Task 4: Scaffold `C:\Stratum137\Projects\490life-book-studio`

**Files:** `README.md`, `.gitignore` (`clients/`, `voice/`, `*.mp3`, `*.mp4`, `*.wav`, `*.m4a`), `clients/.gitkeep`, `voice/.gitkeep`, `sales/`, `content/`, `paper/`, `pipeline/`, `pipeline/prompts/`, `pipeline/tests/`. `git init`, first commit.

README: purpose; folder map from spec §6; CLI verbs (Task 8); spec location; Silas drafts, David sends; client material never leaves this machine.

### Task 5: Sales kit (`sales/`)

- `sales/instagram-launch.md`: pinned post, 5-Story sequence (on-screen text per frame), bio line.
- `sales/dm-templates.md`: 5 variants (pastor / coach / layperson / devotional / "you mentioned a book once"), each ≤ 60 words, one question, no link in the first message.
- `sales/dm-list.xlsx`: handle, name, segment, evidence, variant, sent, reply, call booked. Silas fills 50 rows from `@davidslaysgoliath` recent commenters via `agent-reach` Instagram; likers David screenshots, Silas transcribes.
- `sales/call-script.md`: 20-min arc (story 6 · what exists 4 · tier fit 5 · founding offer only on hesitation · deposit link on the call · next step booked).
- `sales/objections.md`: price · "I can write it myself" · "AI wrote it?" · "whose name" · "not enough material" · "let me pray about it" (with a respectful next-touch date).
- `sales/follow-up-sequence.md`: T+2 note, T+5 value (sample chapter outline), T+10 close the loop.
- `sales/pipeline-tracker.xlsx`: prospect, source, segment, stage (DM → reply → call booked → call held → deposit → in production → delivered), tier, $, next touch, notes; summary sheet by week: DMs, replies, calls, closes, $ collected.

All prose via `writing` skill, David's voice, 0 em-dashes.

### Task 6: Content bank (`content/`)

- `content/instagram-30-days.md`: 12 posts (hook, body, CTA, image from existing 490 assets).
- `content/facebook-groups.md`: 8 value posts for pastor/writer groups (no pitch in body; CTA is a question) + 10 target groups with join notes.
- `content/reels-scripts.md`: 4 × 30-sec spoken scripts; first line hook, last line ask.
- `content/substack-first-two.md`: post 1 "your sermon series is already a book"; post 2 "the ninety-day method"; Substack setup checklist.
- `content/calendar.xlsx`: day, channel, piece, status.

### Task 7: Paper (`paper/`)

- `paper/service-agreement.md` + PDF via `py D:\Stratum137\Projects\scratch\md2pdf.py`. Clauses: scope by tier · payment 50/50 · revisions per tier · client owns all rights, KDP account, royalties · authorship credit at client's option · no sales guarantee · confidentiality · Arizona law · one page. David reads before first client.
- `paper/intake-questions.md`: Cal.com booking questions (tier interest · the book in two lines · what exists · segment · link to material · best time).
- `paper/accounts-checklist.md`: David-only steps with exact paste copy: Cal.com event (name, description, questions); Stripe payment links × 9 (Assembled $750/$750, Drawn Out $1,750/$1,750, Co-Written $4,250/$4,250, Founding $1,000/$1,000, Voice $600 monthly); Instagram bio; Facebook groups; Substack handle.

### Task 8: Pipeline v1 (`pipeline/`)

**Files:** `pipeline/studio.py`, `pipeline/typeset.py`, `pipeline/book.css`, `pipeline/prompts/{voice-profile,outline,chapter,edit,devotional-entry,voice-posts}.md`, `pipeline/tests/test_studio.py`

**Interfaces (CLI):**
- `studio.py new <slug> --tier {assembled,drawn-out,co-written} --kind {book,devotional}` → `clients/<slug>/` tree + `intake.md`
- `studio.py transcribe <slug>` → `raw/*` → `transcripts/*.md` (audio/video via the `/watch` Whisper toolchain; PDF via `pypdf`; md/txt copied)
- `studio.py profile <slug>` → `voice-profile.md`
- `studio.py outline <slug>` → `outline.md`
- `studio.py draft <slug> [--chapter N]` → `chapters/ch-NN.md`
- `studio.py edit <slug>` → `edits/ch-NN.edited.md`, `edits/notes.md`
- `studio.py typeset <slug>` → `book/interior.pdf` (6×9, Cormorant, running heads, chapter openers), `book/manuscript.epub` (pandoc if present, else HTML), `book/kdp-metadata.md`
- `studio.py voice <slug>` → `voice/<slug>/YYYY-MM/posts.md`, `newsletter.md`

Model calls via `claude -p` with the prompt file as system prompt; `--dry-run` prints the assembled prompt and writes nothing.

- [ ] **Step 1 (tests first)**: `test_new_creates_tree`, `test_transcribe_copies_markdown`, `test_typeset_produces_pdf_from_two_chapters` (fixture with two short chapters; `book/interior.pdf` exists, > 10 KB), `test_dry_run_writes_nothing`. Run `py -m pytest pipeline/tests -q` → 4 failures.
- [ ] **Step 2**: implement `studio.py` + `typeset.py` (read `md2pdf.py` first; reuse its engine).
- [ ] **Step 3**: tests green; `studio.py new demo --tier drawn-out --kind book` smoke; commit.

### Task 9: Vault + memory close-out

- [ ] `wiki/490 Life/book-studio/index.md`, `log.md`, `how-to-run.md` (David's weekly steps + Silas's commands).
- [ ] `D:\Vault\index.md` + `log.md` lines; `ops/brain/vault_commit.py --agent silas --msg "490 Book Studio: spec, site page, kit"`.
- [ ] Memory `project_490_book_studio.md` status line; `tools_inventory.md` if pandoc/pypdf installed.

---

## Self-review

- Spec coverage: §3 tiers → T1/T7 · §4 page → T1–T3 · §5 booking/pay → T3/T7 · §6 pipeline → T8 · §7 sales → T5/T6 · §8 rhythm → T9 how-to-run · §9 paper → T7 · §10 milestones → tracker T5. Founding offer only in the call script. Substack/Pinterest month 2–3 deliberately outside this plan.
- Placeholders: `site.bookCallUrl` provisional, called out in T3 and T7.
- Names consistent: `write-your-book` branch/page/permalink; `studio.py` verbs match README.
