// Build-output smoke checks for 490.life (run after `npm run build`)
const fs = require("fs");
const path = require("path");

const SITE = path.join(__dirname, "..", "_site");
const failures = [];

const expectPages = [
  "index.html",
  "seventy-times-seven/index.html",
  "teachings/index.html",
  "teachings/weekly/index.html",
  "teachings/necessities-of-effective-prayer-mark-11/index.html",
  "teachings/the-end-of-counting/index.html",
  "bible-study/index.html",
  "bible-study/the-story-jesus-told/index.html",
  "assets/490-life-study-guide-the-story-jesus-told.pdf",
  "bible-study/the-god-who-is-there/index.html",
  "assets/490-life-study-guide-the-god-who-is-there.pdf",
  "bible-study/creation-and-the-image-of-god/index.html",
  "assets/490-life-study-guide-creation-and-the-image-of-god.pdf",
  "bible-study/the-fall/index.html",
  "assets/490-life-study-guide-the-fall.pdf",
  "bible-study/ruin-spreads/index.html",
  "assets/490-life-study-guide-ruin-spreads.pdf",
  "bible-study/abraham/index.html",
  "assets/490-life-study-guide-abraham.pdf",
  "bible-study/isaac-jacob-joseph/index.html",
  "assets/490-life-study-guide-isaac-jacob-joseph.pdf",
  "bible-study/exodus-passover/index.html",
  "assets/490-life-study-guide-exodus-passover.pdf",
  "bible-study/sinai/index.html",
  "assets/490-life-study-guide-sinai.pdf",
  "bible-study/tabernacle/index.html",
  "assets/490-life-study-guide-tabernacle.pdf",
  "bible-study/atonement/index.html",
  "assets/490-life-study-guide-atonement.pdf",
  "bible-study/wilderness-conquest/index.html",
  "assets/490-life-study-guide-wilderness-conquest.pdf",
  "assets/490-life-small-group-guide-the-story-jesus-told.pdf",
  "assets/490-life-small-group-guide-the-god-who-is-there.pdf",
  "assets/490-life-small-group-guide-creation-and-the-image-of-god.pdf",
  "assets/490-life-small-group-guide-the-fall.pdf",
  "assets/490-life-small-group-guide-ruin-spreads.pdf",
  "assets/490-life-small-group-guide-abraham.pdf",
  "assets/490-life-small-group-guide-isaac-jacob-joseph.pdf",
  "assets/490-life-small-group-guide-exodus-passover.pdf",
  "assets/490-life-small-group-guide-sinai.pdf",
  "assets/490-life-small-group-guide-tabernacle.pdf",
  "assets/490-life-small-group-guide-atonement.pdf",
  "assets/490-life-small-group-guide-wilderness-conquest.pdf",
  "bible-study/judges-ruth/index.html",
  "assets/490-life-study-guide-judges-ruth.pdf",
  "assets/490-life-small-group-guide-judges-ruth.pdf",
  "assets/490-life-study-guide-the-end-of-counting.pdf",
  "about/index.html",
  "coaching/index.html",
  "write-your-book/index.html",
  "write-your-book/thanks/index.html",
  "speaking/index.html",
  "assets/david-headshot-beach.jpg",
  "assets/david-studio-crossed.jpg",
  "assets/mens-group-lawn.jpg",
  "thank-you/index.html",
  "almost-there/index.html",
  "gospel/index.html",
  "what-is-the-bible/index.html",
  "studying-the-bible/index.html",
  "christian-life/index.html",
  "finding-a-church/index.html",
  "feed.xml",
  "sitemap.xml",
  "robots.txt",
  "css/style.css",
  "assets/logo.png",
  "assets/cover.jpg",
];

for (const p of expectPages) {
  if (!fs.existsSync(path.join(SITE, p))) failures.push(`MISSING: ${p}`);
}

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

const hrefRe = /(?:href|src)="(\/[^"#?]*)/g;
for (const file of htmlFiles(SITE)) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(SITE, file);

  if (html.includes("undefined") ) failures.push(`LITERAL 'undefined' in ${rel}`);
  if (html.includes("{{")) failures.push(`UNRENDERED TEMPLATE in ${rel}`);

  let m;
  while ((m = hrefRe.exec(html))) {
    const target = m[1].replace(/\?.*$/, "");
    if (target === "/") continue;
    if (target.startsWith("/x/")) continue; // analytics scripts are proxied at runtime, never in _site
    const asFile = path.join(SITE, target);
    const asIndex = path.join(SITE, target, "index.html");
    if (!fs.existsSync(asFile) && !fs.existsSync(asIndex)) {
      failures.push(`BROKEN LINK ${target} in ${rel}`);
    }
  }
}

const home = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
if (!home.includes('id="subscribe"')) failures.push("HOME missing #subscribe section");
if (!home.includes("sibforms.com/serve")) failures.push("HOME missing Brevo form action");
if (!home.includes("form.capture")) failures.push("HOME missing capture-form submit script");
if (!home.includes("/almost-there/")) failures.push("HOME missing almost-there redirect");
if (!home.includes("/coaching/") || !home.includes("/speaking/")) failures.push("HOME missing coaching/speaking links");
if (!home.includes('class="nav-toggle"')) failures.push("HOME missing mobile nav toggle");

const book = fs.readFileSync(path.join(SITE, "seventy-times-seven/index.html"), "utf8");
const amazonCount = (book.match(/a\.co\/d\/04EfFHKO/g) || []).length;
if (amazonCount < 3) failures.push(`BOOK page has ${amazonCount} Amazon CTAs (expected >= 3)`);
if (!book.includes("application/ld+json")) failures.push("BOOK page missing JSON-LD");

for (const xml of ["feed.xml", "sitemap.xml"]) {
  const content = fs.readFileSync(path.join(SITE, xml), "utf8");
  if (!content.trim().startsWith("<?xml")) failures.push(`${xml} does not start with XML declaration`);
}

if (failures.length) {
  console.error("SMOKE FAILURES:\n" + failures.map((f) => "  - " + f).join("\n"));
  process.exit(1);
}
console.log("ALL CHECKS PASS");
