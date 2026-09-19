---
title: 490 Life Book Studio — Design Spec
type: project
project: 490life
tags: [490life, book-studio, ghostwriting, side-business, spec]
created: 2026-09-18
updated: 2026-09-18
status: approved
---

# 490 Life Book Studio — Design Spec

Approved by David 2026-09-18 (brainstorm session). Standalone side business, housed under 490 Life. Not part of Stratum 137; not measured against its goals or constitution.

## 1. Purpose

Repeatable, laptop-only income of $2,000+/mo within 90 days, scaling to $8–12K/mo at 15 hrs/week. AI does 85% of production; David does the conversations.

**Promise:** "You've been meaning to write it for years. Ninety days from now it's on Amazon."

## 2. Buyer

Christians who want to write a book or devotional and never will on their own:
- **Pastors / ministry leaders** — sermon series → book. Raw material already exists.
- **Christian coaches / consultants** — book as authority.
- **Laypeople** — a devotional, a testimony, a study.

One brand, one pipeline, sub-pitches per segment.

## 3. Offer ladder

| Tier | Name | Includes | David hrs | Price |
|---|---|---|---|---|
| B | **Assembled** | Upload sermons/notes + questionnaire → manuscript, 2 revision rounds, edit, interior + cover, KDP publish walkthrough, 1 launch call | 2–3 | $1,500 |
| A | **Drawn Out** (featured) | Assembled + 3 recorded interview sessions with David, chapter-by-chapter review calls | 6–8 | $3,500 |
| C | **Co-Written** | Drawn Out + David as hands-on editor, unlimited revisions, launch plan, 30 days of launch posts | 20+ | $8,500 |
| — | **Voice** | 12 social posts/mo + monthly newsletter from a 20-min voice note; add-on or standalone | 1/mo | $600/mo |

Devotionals: same tiers, ~70% price. Founding-client close tool (not advertised): first 3 Drawn Out books at $2,000 for a testimonial + cover on the page.

Payment: 50% deposit at signing, 50% at manuscript approval. Voice: monthly subscription.

## 4. Home: 490.life

Repo `C:\Stratum137\Projects\490life-website` (Eleventy + Nunjucks; Coolify auto-deploys `main`; Brevo forms; Laguna palette; Cormorant + Figtree; no em-dashes).

**Additions only:**
- `src/write-your-book.njk` → `/write-your-book/`
- `src/write-your-book-thanks.njk` → `/write-your-book/thanks/` (post-intake)
- Nav link "Write Your Book" + footer entry under "Work with David" + one card on home.
- No existing page restyled, rewritten, or removed.

Page sections: hero (beach headshot + Seventy Times Seven cover) · who it's for (3 segments) · how it works (3 steps) · tiers (A featured) · Voice add-on · proof (the book, Amazon link) · FAQ (ownership, authorship credit, "I have nothing written", timeline, devotionals) · CTA "Book a 20-minute call."

## 5. Booking → intake → pay

- **Cal.com** (free tier): "Write Your Book · 20 min" event on David's calendar. Embedded/linked from page CTA and Instagram bio.
- **Intake form** (Brevo form or Cal.com booking questions): tier interest · book idea in 2 lines · what exists (sermons / notes / outline / nothing) · segment · link to upload.
- **Stripe payment links**: existing 490 Life Stripe account (shop). Links: Assembled deposit/balance, Drawn Out deposit/balance, Co-Written deposit/balance, Voice monthly, Founding deposit/balance.

## 6. Production pipeline

Lives at `C:\Stratum137\Projects\490life-book-studio` (Silas-operated; Python + Claude).

```
clients/<slug>/
  intake.md            # from form + call notes
  raw/                 # sermon audio/video/PDF, interview recordings
  transcripts/         # whisper / youtube_transcript / pdf text
  voice-profile.md     # phrases, cadence, theology vocabulary, Scripture translation preference
  outline.md           # approved by David + client
  chapters/            # ch-01.md ... in client's voice
  edits/               # edit pass + David notes + client revisions
  book/                # 6x9 interior PDF, EPUB, cover brief, KDP metadata
  launch/              # launch posts (Co-Written), Amazon link
```

Stages: **ingest → transcribe → voice profile → outline → draft → edit → review → revise → typeset → publish (client's KDP account, screen-share) → launch.**

Devotional variant: 30/40/90-entry template (Scripture · reflection · prayer · question).

Voice pipeline: `voice/<slug>/` — monthly voice note → transcript → 12 posts + 1 newsletter → David skim → scheduled (Meta Business Suite / Buffer free tier).

## 7. Sales motion

**Instagram (@davidslaysgoliath, ~2,000 followers) — week 1**
Pinned post + 5-Story sequence ("opening 3 spots"), bio link → page. Pull last-90-day likers/commenters; 50 personalized DMs drafted by Silas, sent by David (25 Sat night, 25 Sun). 2 Reels/week, 30 sec, David to camera.

**Facebook (490 Life page + groups) — week 2**
Join 10 pastor / Christian-writer / church-leader groups. 3 value posts/wk drawn from 490 teachings. DM engagers.

**Substack — month 2.** Repost 490 teachings + "your book" series. Notes for discovery.
**Pinterest — month 3.** Devotional segment; pins → blog post → call.
**Reddit — listening only.** Paid FB/IG ads after 2 organic closes.

**Call script:** their story → what exists → tier fit → founding offer if hesitation → deposit link on the call. **Follow-up:** 3 touches over 10 days. **Tracking:** one sheet (prospect, source, stage, tier, next touch).

## 8. Weekly rhythm (15 hrs)

| Day | Hrs | David |
|---|---|---|
| Tue, Thu evenings | 3 each | Prospect calls, client interview sessions |
| Sat | 5 | Interviews, draft review, shoot 2 Reels |
| Sun | 4 | Draft review, DMs, posting |

Silas: Monday hands David the week's call list, DMs, posts; Friday reports numbers (DMs sent, calls booked, calls held, closes, $ collected).

## 9. Paper

One-page service agreement: client owns all rights and the KDP account; David uncredited unless client requests "with David S. Jones"; 50/50 payment; revision limits per tier; no guarantee of sales; confidentiality. Silas drafts; David reads before first client signs.

## 10. Milestones

| Day | Target |
|---|---|
| 7 | Page live, 50 DMs out, 5 calls booked |
| 30 | 2 book clients signed, 1 Voice client |
| 60 | First manuscript in revisions, 4 signed |
| 90 | First book on Amazon, $6K+ collected, Voice at 3 |

## 11. Out of scope (v1)

Paid ads · new brand/domain · podcast guesting · cover design beyond brief (use KDP Cover Creator or a $50 Fiverr designer per book, billed inside price) · audiobook.

## 12. Weekend build (2026-09-19/20)

Sat: page + nav + home card (branch, preview, merge) · Cal.com event · intake form · Stripe links · IG post/Stories/bio · 50 DMs drafted · call script + objections.
Sun: pipeline v1 (ingest → outline → chapters → edit → interior) · 30-day content bank (12 IG, 8 FB, 4 Reels scripts) · FB groups joined + first post · Substack account + 2 posts · remaining DMs.
