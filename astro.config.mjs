// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { lastModified } from './src/last-modified.ts';

// https://astro.build/config
export default defineConfig({
  // Needed for canonical URLs, the sitemap and absolute Open Graph images.
  // Without it the sitemap integration refuses to run.
  site: 'https://opengewerk.de',

  // Apache serves a directory as its index.html. Pages are therefore emitted as
  // <route>/index.html and every internal link carries the trailing slash, so a
  // visitor never walks through a DirectorySlash redirect on the way in.
  trailingSlash: 'always',

  integrations: [
    sitemap({
      // The legal pages carry no search intent and would only dilute the
      // sitemap. They stay reachable and indexable, they are just not announced.
      filter: (page) =>
        !page.endsWith('/impressum/') && !page.endsWith('/datenschutz/'),
      // The date a page's text last changed, from the history of its file. An
      // entry without a known date stays without one.
      serialize(item) {
        const lastmod = lastModified(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],

  build: {
    // Component styles go out as files, never as <style> in the page, so the
    // Content-Security-Policy of the vHost can stay at 'self' (#64).
    // scripts/check-pages.mjs fails the check if anything inline comes back.
    inlineStylesheets: 'never',
  },

  image: {
    // The interface previews are wide screenshots. Astro emits avif and webp
    // next to the original and picks per browser.
    responsiveStyles: true,
  },
});
