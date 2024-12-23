import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://simenandre.no',
  integrations: [sitemap()],
  markdown: {
    layouts: {
      default: './src/article-layout.astro',
    },
  },
});
