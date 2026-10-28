import { defineConfig } from 'astro/config';

// Static output: every page is prebuilt HTML. No server, no database,
// no JS needed to read the site. Deploy the `dist/` folder anywhere.
export default defineConfig({
  site: 'https://example.com',
  build: {
    format: 'directory',
  },
  devToolbar: { enabled: false },
});
