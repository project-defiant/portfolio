# Copilot Instructions

## Commands

Run commands from the repository root (`The-defiant/`). CI uses Node 20.

- Install dependencies: `npm ci`
- Start local dev server: `npm run dev`
- Static Astro/content/type check: `npm run astro -- check`
- Production build: `npm run build`
  - `build` runs `prebuild` first, which executes `node scripts/materialize-obsidian-blog.mjs`
  - that prebuild step validates the stored Obsidian snapshot, rewrites `src/content/blog/imported/`, and emits `src/generated/obsidian/import-report.json`
- Preview built output: `npm run preview`
- Full test suite: `npm test`
  - this runs `npm run build && node --test`
- Single build-output test file: `npm run build && node --test test/homepage.test.mjs`
- Single test by name: `npm run build && node --test test/homepage.test.mjs --test-name-pattern="immersive motion"`
- Single pipeline test file: `node --test test/obsidian-import.test.mjs`
- Refresh the stored Obsidian snapshot from the source repo: `npm run sync:obsidian -- --trigger=manual`
- Backfill the current Astro blog into the publish-ready source-repo format:
  - dry run: `npm run backfill:blog`
  - write artifacts: `npm run backfill:blog -- --write`

## High-level architecture

This repository is an Astro static site with two content paths feeding one published blog: hand-authored Astro content and generated imports from an external Obsidian-ready repo.

- `src/layouts/SiteLayout.astro`, `src/components/BaseHead.astro`, and `src/site-config.js` form the shared shell. Branding, nav links, canonical URLs, Open Graph metadata, and Twitter metadata are expected to come from that shared config rather than being redefined per page.
- The About and Resume pages are data-driven. `src/pages/about.astro` pulls narrative content from `src/data/about-content.js`, and `src/pages/resume.astro` renders structured sections from `src/data/resume.ts`.
- Public blog routes under `src/pages/blog/**` are thin wrappers around `src/content/blog.ts`. That module is the canonical place for post preparation: it wraps `astro:content` entries into `PreparedBlogPost`, sorts newest-first, computes reading time, normalizes tags, and derives tag slugs.
- The blog collection schema is defined in `src/content/config.ts`. Published posts can come from hand-authored files in `src/content/blog/` or generated imports in `src/content/blog/imported/`.
- The Obsidian import flow is a two-step pipeline:
  1. `npm run sync:obsidian` fetches the publish-ready manifest and note bodies from `project-defiant/Project-defiant` into `src/generated/obsidian/source-snapshot.json`
  2. `npm run build` triggers `scripts/materialize-obsidian-blog.mjs`, which runs the import pipeline in `src/import/obsidian/`, validates ready-note metadata/body rules, rewrites `src/content/blog/imported/`, and writes `src/generated/obsidian/import-report.json`
- The reverse path is also first-class. `scripts/backfill-published-posts.mjs` plus the `src/import/obsidian/backfill*.js` modules convert the current Astro blog back into the publish-ready source-repo contract under `src/generated/backfill/`.
- CI (`.github/workflows/obsidian-import.yml`) runs `npm ci`, `npm run sync:obsidian`, and `npm run build`. Invalid ready notes are reported through the importer’s GitHub-issue reporting layer instead of turning reporting failures into hard build failures.

## Key conventions

- Lowercase routes are canonical. `src/pages/Blog/**`, `src/pages/About.astro`, and `src/pages/Timeline.astro` are compatibility redirects and should stay aligned with their lowercase destinations.
- Most tests are build-output tests. Files like `test/homepage.test.mjs`, `test/blog.test.mjs`, `test/about.test.mjs`, and `test/foundation.test.mjs` read rendered HTML/CSS from `dist/`, so rebuild before running them in isolation.
- Keep site-wide identity, nav, metadata, and canonical URL behavior in `src/site-config.js` and the shared shell. Tests assert real public branding and links, so hardcoded replacements in page files tend to break expectations.
- Reuse `src/content/blog.ts` helpers for sorting, reading time, tag slugs, and tag filtering. If blog URL shape or metadata handling changes, check both the page layer and `src/pages/rss.xml.js`, which reads the raw collection separately.
- Imported Obsidian notes are strict by design:
  - only files under `blog/ready/` are considered
  - metadata is allowlisted to `title`, `description`, `author`, `pubDate`, `updatedDate`, `heroImage`, `heroImageAlt`, `tags`, `featured`, and `slug`
  - `slug` must be kebab-case
  - dates must use `YYYY-MM-DD`
  - note bodies must meet the 200-character minimum
  - missing `author` defaults to `PROJECT-DEFIANT`
- `src/content/blog/imported/` and `src/generated/obsidian/*.json` are generated artifacts. The importer clears and rewrites the imported content directory, so do not treat those files as hand-edited source of truth.
- Import and backfill are intended to round-trip. If you change the ready-note contract, validation rules, slug handling, or frontmatter fields, keep both `src/import/obsidian/pipeline.js` and the backfill modules in sync and update the paired tests in `test/obsidian-import.test.mjs` and `test/blog-backfill.test.mjs`.
- Motion behavior is part of the public contract. `SiteLayout.astro` sets `data-motion` to `full`, `lite`, or `reduce`, and homepage tests assert the motion hooks and reduced-motion fallbacks.
