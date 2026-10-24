module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("lessonsOnly", (posts) => (posts || []).filter((p) => p.data.lesson));
  eleventyConfig.addFilter("weeksOnly", (posts) => (posts || []).filter((p) => p.data.week));
  // Card-size copies live in src/assets/cards/; fall back to the original if no copy exists.
  const cardDir = require("path").join(__dirname, "src", "assets", "cards");
  eleventyConfig.addFilter("card", (url) => {
    const name = String(url || "").split("/").pop();
    return require("fs").existsSync(require("path").join(cardDir, name)) ? "/assets/cards/" + name : url;
  });
  eleventyConfig.addFilter("weeklyOnly", (posts) => (posts || []).filter((p) => p.data.track !== "deeper"));
  eleventyConfig.addFilter("deeperOnly", (posts) => (posts || []).filter((p) => p.data.track === "deeper"));
  eleventyConfig.addFilter("lessonPost", (posts, n) => (posts || []).find((p) => p.data.lesson === n));
  eleventyConfig.addFilter("weekPost", (posts, n) => (posts || []).find((p) => p.data.week === n));
  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
