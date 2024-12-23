import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://simenandre.no",
  integrations: [sitemap(), mdx()],
  markdown: {
    layouts: {
      default: "./src/article-layout.astro",
    },
  },
});

