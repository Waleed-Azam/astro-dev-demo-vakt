import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Hybrid: static marketing + docs, server function only for /api/waitlist.
export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'compile'
  }),
  site: 'https://vakt.demo',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  vite: {
    server: { allowedHosts: ['.e2b.app', 'localhost'] },
    ssr: { external: ['node:buffer', 'node:path', 'node:fs'] }
  }
});
