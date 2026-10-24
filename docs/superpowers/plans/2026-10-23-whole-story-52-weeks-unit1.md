# The Whole Story 52 Weeks: Unit 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Weeks 1–10 (Lessons 1–5 split in two) as finished week PDFs and 2-page Small Group Guides for David's review, with reusable tooling for Units 2–6.

**Architecture:** A week is composed, not hand-edited: `compose_week.py` cuts the source lesson body at its `<h2 class="sg-section">` headings and stitches the week from those sections plus a small JSON of new writing (`weeks/content/WW.json`). `assemble.py` and `build_lesson_pdf.py` gain a weeks mode; a new `build_week_guide.py` prints the 2-page guide. Nothing goes to the site until David approves Unit 1.

**Tech Stack:** Python 3 (py), Edge headless PDF printing, PyMuPDF for QA, existing diagram SVGs and ESV verifier (`esv_get.py`, vq-style checker).

**Spec:** `C:\Stratum137\Projects\490life-website\docs\superpowers\specs\2026-10-23-whole-story-52-weeks-design.md`

## Global Constraints
- Zero em-dashes in any output. David's voice: warm, plain, no stacked "not X but Y", no punchy fragment pairs.
- Every Scripture quotation ESV word for word, verified against fetched ESV text.
- Theology guardrails from the spec hold (Westminster; common ground on baptism and the Supper; definite atonement; Rom 5:12 in Adam; eternal punishment; Father never pictured).
- Week A: Word card, parts in range, new short Turn, 3 practices, 3–4 questions. Week B: recap opening, parts in range, Thread Watch, lesson's Turn, 3 practices incl. memory verse, 3–4 questions, Sources. Core Doctrine box stays at its anchor.
- Guide: exactly 2 pages.
- Splits for Unit 1: L1 Parts 1–3 / 4–6; L2 1–3 / 4–5; L3 1–2 / 3–5; L4 1–2 / 3–5; L5 1–2 / 3–4.
- Project root: `C:\Users\david\OneDrive\Documents\A 490 Life Teachings\Bible Study Project` (not a git repo; site repo is separate and untouched in this plan).

## Files
- Create `tools/compose_week.py` (section parser + week composer), `tools/test_compose_week.py`.
- Create `weeks/content/01.json` … `10.json` (new writing + split settings per week).
- Create `weeks/WW-slug.body.html`, `weeks/WW-slug.frontmatter.yml` (generated).
- Modify `tools/assemble.py` (accept `--dir weeks`), `tools/build_lesson_pdf.py` (cover kicker "Week N of 52" when `week:` set).
- Create `tools/build_week_guide.py`, `weeks/guides/01.json` … `10.json`.

---

### Task 1: Section parser and week composer
**Files:** create `tools/compose_week.py`, `tools/test_compose_week.py`
**Produces:** `split_sections(body) -> dict` with keys `hero, here, intro, word, parts (list of str), turn, living (list of practice html), refs, discussion (list of li text), sources`; `compose(week_json) -> (body_html, frontmatter_text)`.

- [ ] Step 1: Write `test_compose_week.py` asserting, for lesson 05: 4 parts; the Turn section excludes the Living It principles; 6 practices; 7 discussion items; the doctrine block (between `<!--doctrine-->` markers) sits inside the parts text; Thread Watch (`sg-thread`) is inside the last part chunk or the Turn chunk.
- [ ] Step 2: Run `py test_compose_week.py`; expect failure (module missing).
- [ ] Step 3: Implement `split_sections` by splitting on `<h2 class="sg-section">`, classifying by the `sg-num` label (Introduction, The Word, Part …, The Turn, For Discussion, Sources). Move any `sg-thread` div found in the Turn chunk to the end of the parts (it belongs to Week B).
- [ ] Step 4: Implement `compose`: Week A = hero(cover A) + here + opening + word + parts[a] + new Turn + practices + next + discussion. Week B = hero(cover B) + here + recap + parts[b] (with thread) + lesson Turn prose (Living It removed) + practices + next + discussion + sources. Write body and frontmatter (`title`, `passage`, `date`, `description`, `series: "The Whole Story"`, `week`, `lesson`, `ogImage`).
- [ ] Step 5: Run tests; expect pass.

### Task 2: Weeks mode in assemble and the PDF builder
**Files:** modify `tools/assemble.py`, `tools/build_lesson_pdf.py`
- [ ] Step 1: `assemble.py`: optional `--dir weeks` reads/writes in `weeks/` instead of `lessons/`.
- [ ] Step 2: `build_lesson_pdf.py`: if `week` in front matter, kicker reads "Week N of 52" and image paths resolve from the project `assets/` (weeks/ is a sibling of lessons/, so `../assets` already works).
- [ ] Step 3: Rebuild Lesson 5 unchanged and confirm identical page count (regression).

### Task 3: Content for Weeks 1–10
**Files:** `weeks/content/01.json` … `10.json`
- [ ] For each week: title, slug, lesson, half, part range, cover image + verses, opening (A) or recap (B), Turn (A only), 3 practices, 3–4 discussion questions (drawn from the lesson's seven, new ones only where needed), next-week reading, description.
- [ ] Fetch ESV for every new quotation; verify all quotes in all ten week bodies with the checker; zero em-dashes.

### Task 4: Build and QA the ten week PDFs
- [ ] Compose, assemble, build each week; record words and pages (target 5–9 pages).
- [ ] Contact sheet of every page; fix layout issues; confirm each week has exactly the features the spec assigns.

### Task 5: 2-page guides
**Files:** `tools/build_week_guide.py`, `weeks/guides/01.json` … `10.json`
- [ ] Builder adapted from `build_guide.py`: page 1 group, page 2 leader notes; Core Doctrine block only when the week contains one; assert exactly 2 pages.
- [ ] Write the ten guide JSONs; verify quotes and blanks (adapt `check_guide.py`).

### Task 6: Review and delivery
- [ ] Independent theology/voice review of all new writing (openings, recaps, Week A Turns, practices, questions, guides); apply fixes; rebuild.
- [ ] Copy PDFs to `out/weeks/`, Downloads, and the vault; send to David; ask to approve Unit 1 before anything goes to the site.
