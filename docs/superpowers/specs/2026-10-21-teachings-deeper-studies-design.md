# Teachings: Weekly, The Whole Story, and Deeper Studies

Approved by David, 2026-10-21.

## Problem
Teachings mixed two kinds of writing: weekly studies (3,000 to 6,000 words, 11 to 15 page PDFs) and one seminary-level study, Rightly Handling the Word (10,600 words, 28 pages), which overwhelms new readers. A five-page Beginner's Guide to it now exists. The site needs an obvious home for long studies, and a short entry point for each.

## Design
1. **Menus.** The Teachings dropdown, the footer "Read" list, and the /teachings/ hub each show three tracks: Weekly Teachings (/teachings/weekly/), The Whole Story (/bible-study/), Deeper Studies (/teachings/deeper/).
2. **One label.** A teaching's front matter may set `track: deeper`. Two Eleventy filters, `weeklyOnly` and `deeperOnly`, split `collections.teachings`. Weekly lists use `weeklyOnly`; the Deeper Studies page uses `deeperOnly`. The feed, homepage "latest", and llms.txt keep showing all teachings (new writing is new writing). URLs do not change.
3. **Rightly Handling the Word** gets `track: deeper` plus `shortVersion` (URL of the Beginner's Guide). Its URL, PDF, and Drive copy stay as they are.
4. **Beginner's Guide** becomes a weekly post at /teachings/rightly-handling-the-word-beginners-guide/ with front matter `deeperVersion` pointing at the full study. Its five-page PDF is `490-life-study-guide-rightly-handling-the-word-beginners-guide.pdf`, offered to the weekly list like the others, and copied to the Drive.
5. **Two-way links.** The full study opens with "New to Bible study? Start with the Beginner's Guide." The Beginner's Guide ends with "Ready to go deeper? Read the full study." The Resources page "How to Study the Bible" adds both to its Go Deeper list.
6. **Deeper Studies page.** Intro plus one card per deeper study: title, passage, description, length, time to work through, and a link to its short version when one exists.

## Checks
`npm run build`, `node scripts/smoke.js` (pages exist, every internal link resolves), new smoke entries for /teachings/deeper/ and the Beginner's Guide page and PDF, plus assertions that the weekly list excludes the full study and the deeper page includes it. Visual check of menu and pages at desktop and phone width; live verification after deploy.
