# Copilot Instructions

## Commands

- Install dependencies: `npm ci`
- Start local dev server: `npm run dev`
- Static Astro/type check: `npm run astro -- check`
- Production build: `npm run build`
  - `build` runs `prebuild` first, which executes `node scripts/materialize-obsidian-blog.mjs`
  - `prebuild` regenerates imported blog content from the stored Obsidian snapshot before `astro build`
- Full test suite: `npm test`
  - This runs `npm run build && node --test`
- Single test file: `npm run build && node --test test/homepage.test.mjs`
- Single test by name: `npm run build && node --test test/homepage.test.mjs --test-name-pattern="immersive motion"`
- Refresh the stored Obsidian snapshot from the source repo: `npm run sync:obsidian -- --trigger=manual`
- Backfill the current Astro blog into the publish-ready source-repo format:
  - Dry run: `npm run backfill:blog`
  - Write artifacts: `npm run backfill:blog -- --write`

## Architecture

This is an Astro static site with a shared shell and a content pipeline layered on top of the standard blog collection.

- `src/layouts/SiteLayout.astro`, `src/components/BaseHead.astro`, and `src/site-config.js` centralize branding, navigation, canonical metadata, and social metadata for the whole site.
- Public blog pages (`src/pages/blog/**`) do not assemble post metadata themselves. They rely on `src/content/blog.ts`, which wraps `astro:content` entries into `PreparedBlogPost` objects, sorts posts newest-first, computes reading time, deduplicates tags, and generates tag slugs.
- The blog collection schema lives in `src/content/config.ts`. Published content can come from:
  - hand-authored files in `src/content/blog/*.md` and `*.mdx`
  - generated imports in `src/content/blog/imported/`
- The Obsidian import flow is a two-step pipeline:
  1. `npm run sync:obsidian` fetches the publish-ready manifest and note bodies from the source GitHub repo into `src/generated/obsidian/source-snapshot.json`
  2. `npm run build` triggers `scripts/materialize-obsidian-blog.mjs`, which validates that snapshot, rewrites `src/content/blog/imported/`, and emits `src/generated/obsidian/import-report.json`
- Import validation/reporting logic lives under `src/import/obsidian/`. In CI, the materialization step can aggregate invalid ready-note failures into a single GitHub issue instead of failing hard on reporting problems.
- `scripts/backfill-published-posts.mjs` and the `src/import/obsidian/backfill*.js` modules are the reverse path: they turn the current Astro blog back into the ready-note contract for the external source repo.

## Key conventions

- Lowercase routes are canonical. `src/pages/Blog/**` and `src/pages/About.astro` are compatibility redirects; preserve them when changing public blog/about URLs. `src/pages/Timeline.astro` redirects to `/resume`.
- Tests are build-output oriented. Most tests read rendered HTML/CSS from `dist/`, so targeted tests should still be run after `npm run build`.
- Keep site-wide identity, nav, and metadata in `src/site-config.js`. Layouts and components are expected to consume that shared config instead of hardcoding brand strings or route lists.
- For blog features, reuse `src/content/blog.ts` helpers instead of duplicating sorting, reading-time, or tag normalization logic in page files.
- Imported Obsidian notes are strict by design:
  - only files under `blog/ready/` are considered
  - metadata is allowlisted (`title`, `description`, `author`, `pubDate`, `updatedDate`, `heroImage`, `heroImageAlt`, `tags`, `featured`, `slug`)
  - `slug` must be kebab-case
  - dates must be `YYYY-MM-DD`
  - note bodies must meet the 200-character minimum
  - missing `author` defaults to `PROJECT-DEFIANT`
- `src/content/blog/imported/` and `src/generated/obsidian/*.json` are generated artifacts. The importer clears and rewrites the imported content directory on each run, so do not hand-edit files there as source of truth.
- Motion behavior is part of the public contract. `SiteLayout.astro` sets `data-motion` to `full`, `lite`, or `reduce`, and homepage tests assert the related `data-motion-*` hooks and reduced-motion fallbacks.
