import { existsSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const site = "https://shan-platon-portfolio.vercel.app";

// Loaded inside the plugins, not imported at the top: Vite restarts the
// dev server whenever a file the config imports changes.
const content = new URL("./src/data/content.js", import.meta.url);
const loadProjects = async () => (await import(content.href)).projects;

// Builds sitemap.xml from the project list, so it never drifts from the site.
const sitemap = {
  name: "sitemap",
  async generateBundle() {
    const projects = await loadProjects();
    const paths = ["/", ...projects.map(({ id }) => `/projects/${id}`)];

    this.emitFile({
      type: "asset",
      fileName: "sitemap.xml",
      source: [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...paths.map((path) => `  <url><loc>${site}${path}</loc></url>`),
        "</urlset>",
        "",
      ].join("\n"),
    });
  },
};

// Values going into an HTML attribute. The word joiners in content.js
// (⁠) only guide line breaks on the page, so they are dropped here.
const attr = (text) =>
  text
    .replace(/⁠/g, "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");

// Swaps one tag's value in index.html, and fails the build if the tag is
// missing, so a changed index.html can't quietly break the pages below.
function swap(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`index.html has no match for ${pattern}`);
  return html.replace(pattern, (_, start, end) => `${start}${attr(value)}${end}`);
}

const meta = (key) => new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`);
const TITLE = /(<title>)[^<]*(<\/title>)/;
const CANONICAL = /(<link rel="canonical" href=")[^"]*(")/;

// Writes a page per project, and 404.html, from the built index.html: the
// same app, with that page's title, description and link-preview card in
// the HTML itself, since link previews never run the JavaScript. Vercel
// serves them as files (vercel.json), and 404.html with a real 404 status
// for any address that isn't a page.
const pages = {
  name: "pages",
  enforce: "post",
  async generateBundle(_, bundle) {
    const projects = await loadProjects();
    const html = bundle["index.html"].source;

    for (const project of projects) {
      const url = `${site}/projects/${project.id}`;
      const title = `${project.name} — Shan Platon`;
      // A card per project in public/og/, made from its main screenshot;
      // the site card stands in until one exists.
      const card = existsSync(new URL(`./public/og/${project.id}.png`, import.meta.url))
        ? `/og/${project.id}.png`
        : "/og.png";

      let page = swap(html, TITLE, title);
      page = swap(page, meta("description"), project.description);
      page = swap(page, CANONICAL, url);
      page = swap(page, meta("og:url"), url);
      page = swap(page, meta("og:title"), title);
      page = swap(page, meta("og:description"), project.description);
      page = swap(page, meta("og:image"), `${site}${card}`);
      page = swap(page, meta("og:image:alt"), `${project.name}, a project by Shan Platon.`);

      this.emitFile({ type: "asset", fileName: `projects/${project.id}/index.html`, source: page });
    }

    let missing = swap(html, TITLE, "Page not found — Shan Platon");
    missing = missing.replace("</head>", '  <meta name="robots" content="noindex" />\n  </head>');
    this.emitFile({ type: "asset", fileName: "404.html", source: missing });
  },
};

export default defineConfig({
  plugins: [react(), sitemap, pages],
});
