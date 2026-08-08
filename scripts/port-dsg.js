// One-shot porter: DSG teaching pages -> 490.life resource pages (content unchanged, reskinned)
const fs = require("fs");
const path = require("path");

const SRC = "D:/Stratum137/Projects/DavidSlaysGoliath";
const OUT = path.join(__dirname, "..", "src");

const PAGES = {
  "gospel.html": {
    slug: "gospel",
    title: "The Gospel",
    description: "The good news of who Jesus is and what He did — the rescue initiated by God, accomplished by Christ, received by faith alone.",
  },
  "what-is-the-bible.html": {
    slug: "what-is-the-bible",
    title: "What Is the Bible?",
    description: "66 books, one story. What the Bible is, how it's organized, where it came from, and why you can trust it — with visual guides.",
  },
  "studying-the-bible.html": {
    slug: "studying-the-bible",
    title: "How to Study the Bible",
    description: "A practical guide to reading Scripture well — context, observation, interpretation, and application.",
  },
  "christian-life.html": {
    slug: "christian-life",
    title: "The Christian Life",
    description: "The essential rhythms of a life alive in Christ — the Word, prayer, repentance, generosity, service, story, and worship.",
  },
  "finding-a-church.html": {
    slug: "finding-a-church",
    title: "Finding a Good Church",
    description: "What actually matters when choosing a church home — and what doesn't.",
  },
};

// DSG navy/gold/stone -> 490 brown/gold/ink (case-insensitive)
const HEX_MAP = {
  "#1F3D5C": "#3a3020", "#1F3A52": "#3a3020",
  "#B4862E": "#A2761F", "#B8924D": "#A2761F",
  "#6E7F86": "#6d6150",
  "#FBF7F0": "#FBF7EE",
  "#2A3A46": "#3a3020",
  "#8A6522": "#A2761F",
};

for (const [file, meta] of Object.entries(PAGES)) {
  let html = fs.readFileSync(path.join(SRC, file), "utf8");
  let main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];

  // strip the page h1 (layout header carries the title)
  main = main.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/, "");

  // internal links -> new permalinks
  for (const [srcFile, m] of Object.entries(PAGES)) {
    main = main.split(srcFile).join(`/${m.slug}/`);
  }
  main = main.split('href="index.html"').join('href="/"');

  // palette swap (SVG fills etc.)
  main = main.replace(/#[0-9a-fA-F]{6}/g, (h) => HEX_MAP[h.toUpperCase()] || h);

  const page = `---
layout: base.njk
title: "${meta.title}"
description: "${meta.description}"
---

<header class="post-header">
  <div class="container">
    <div class="kicker">Resources</div>
    <h1>${meta.title}</h1>
    <nav class="resource-strip" aria-label="Resources">
      <a href="/resources/">All Resources</a>
      <a href="/gospel/"${meta.slug === "gospel" ? ' class="current"' : ""}>Gospel</a>
      <a href="/what-is-the-bible/"${meta.slug === "what-is-the-bible" ? ' class="current"' : ""}>The Bible</a>
      <a href="/studying-the-bible/"${meta.slug === "studying-the-bible" ? ' class="current"' : ""}>Studying It</a>
      <a href="/christian-life/"${meta.slug === "christian-life" ? ' class="current"' : ""}>Christian Life</a>
      <a href="/finding-a-church/"${meta.slug === "finding-a-church" ? ' class="current"' : ""}>Finding a Church</a>
    </nav>
  </div>
</header>

<article class="post-body resource">
${main.trim()}
</article>

{% include "signup.njk" %}
`;
  fs.writeFileSync(path.join(OUT, `${meta.slug}.njk`), page);
  console.log(`ported ${file} -> src/${meta.slug}.njk (${main.length} chars)`);
}
