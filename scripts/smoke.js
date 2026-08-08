// Build-output smoke checks for 490.life (run after `npm run build`)
const fs = require("fs");
const path = require("path");

const SITE = path.join(__dirname, "..", "_site");
const failures = [];

const expectPages = [
  "index.html",
  "seventy-times-seven/index.html",
  "teachings/index.html",
  "teachings/necessities-of-effective-prayer-mark-11/index.html",
  "about/index.html",
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
