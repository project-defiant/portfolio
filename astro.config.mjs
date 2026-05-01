// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './src/site-config.js';

export default defineConfig({
site: siteConfig.metadata.siteUrl,
integrations: [mdx(), sitemap()],
});
