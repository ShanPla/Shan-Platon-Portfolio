import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const site = "https://shan-platon-portfolio.vercel.app";

// Builds sitemap.xml from the project list, so it never drifts from the site.
const sitemap = {
  name: "sitemap",
  async generateBundle() {
    // Loaded here, not imported at the top: Vite restarts the dev server
    // whenever a file the config imports changes.
    const content = new URL("./src/data/content.js", import.meta.url);
    const { projects } = await import(content.href);
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

export default defineConfig({
  plugins: [react(), sitemap],
});
