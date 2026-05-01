import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import { runAstroBlogBackfill } from '../src/import/obsidian/backfill.js';
import { createAstroBlogBackfillSource } from '../src/import/obsidian/astro-blog-source.js';
import { createFileSystemBackfillMaterializer } from '../src/import/obsidian/backfill-materializer.js';
import { createReadyDirectorySource } from '../src/import/obsidian/ready-directory-source.js';
import { createFileSystemImportMaterializer } from '../src/import/obsidian/materializer.js';
import { runObsidianImport } from '../src/import/obsidian/pipeline.js';

const projectRoot = process.cwd();
const runtimeDir = path.join(projectRoot, 'test', 'runtime', 'blog-backfill');

function createInMemorySource(posts, { hasAsset = async () => true } = {}) {
  return {
    async load() {
      return { posts, hasAsset };
    },
  };
}

test('backfill dry-run transforms current Astro blog posts into ready-note contracts while preserving slugs', async () => {
  await rm(runtimeDir, { recursive: true, force: true });

  const result = await runAstroBlogBackfill({
    source: createAstroBlogBackfillSource({
      contentDir: path.join(projectRoot, 'src', 'content', 'blog'),
      publicDir: path.join(projectRoot, 'public'),
    }),
    materializer: createFileSystemBackfillMaterializer({
      repoDir: path.join(runtimeDir, 'source-repo'),
      reportFile: path.join(runtimeDir, 'backfill-report.json'),
      dryRun: true,
    }),
    migratedAt: new Date('2026-01-03T10:15:00.000Z'),
  });

  assert.equal(result.stats.discovered, 5);
  assert.equal(result.stats.migrated, 5);
  assert.equal(result.stats.skipped, 0);
  assert.equal(result.stats.warnings, 1);
  assert.deepEqual(
    result.migratedPosts.map((post) => post.metadata.slug),
    ['first-post', 'markdown-style-guide', 'second-post', 'third-post', 'using-mdx'],
  );
  assert.equal(result.report.slugMap.every((entry) => entry.status === 'retained'), true);
  assert.equal(result.report.auditPosts.find((post) => post.slug === 'using-mdx').warnings[0].code, 'mdx-format-risk');
  assert.equal(result.materialized.dryRun, true);
  assert.equal(result.materialized.plannedFiles.includes('blog/ready/index.json'), true);
  await assert.rejects(access(path.join(runtimeDir, 'source-repo')));
});

test('backfilled ready repo round-trips through the import pipeline without losing published coverage', async () => {
  await rm(runtimeDir, { recursive: true, force: true });

  const backfill = await runAstroBlogBackfill({
    source: createAstroBlogBackfillSource({
      contentDir: path.join(projectRoot, 'src', 'content', 'blog'),
      publicDir: path.join(projectRoot, 'public'),
    }),
    materializer: createFileSystemBackfillMaterializer({
      repoDir: path.join(runtimeDir, 'source-repo'),
      reportFile: path.join(runtimeDir, 'backfill-report.json'),
    }),
    migratedAt: new Date('2026-01-03T10:15:00.000Z'),
  });

  const imported = await runObsidianImport({
    source: createReadyDirectorySource({ repoDir: path.join(runtimeDir, 'source-repo') }),
    materializer: createFileSystemImportMaterializer({
      contentDir: path.join(runtimeDir, 'imported-content'),
      reportFile: path.join(runtimeDir, 'import-report.json'),
    }),
    importedAt: new Date('2026-01-04T09:00:00.000Z'),
  });

  const usingMdxMarkdown = await readFile(
    path.join(runtimeDir, 'imported-content', 'using-mdx.mdx'),
    'utf8',
  );

  assert.equal(backfill.stats.migrated, 5);
  assert.equal(imported.stats.imported, 5);
  assert.equal(imported.stats.skipped, 0);
  assert.deepEqual(
    imported.importedPosts.map((post) => post.slug),
    ['first-post', 'markdown-style-guide', 'second-post', 'third-post', 'using-mdx'],
  );
  assert.match(usingMdxMarkdown, /heroImageAlt: "Editor window showing a mix of markdown and Astro component imports"/);

  await rm(runtimeDir, { recursive: true, force: true });
});

test('backfill audit blocks slug collisions and reports broken assets for manual review', async () => {
  const result = await runAstroBlogBackfill({
    source: createInMemorySource(
      [
        {
          path: 'alpha.md',
          slug: 'shared-slug',
          extension: '.md',
          metadata: {
            title: 'Alpha',
            description: 'Alpha description for a published post.',
            pubDate: 'Jul 08 2022',
            tags: ['Ops'],
          },
          body: 'A'.repeat(260),
        },
        {
          path: 'beta.md',
          slug: 'shared-slug',
          extension: '.md',
          metadata: {
            title: 'Beta',
            description: 'Beta description for a published post.',
            pubDate: 'Jul 09 2022',
            tags: ['Ops'],
          },
          body: 'B'.repeat(260),
        },
        {
          path: 'gamma.md',
          slug: 'gamma',
          extension: '.md',
          metadata: {
            title: 'Gamma',
            description: 'Gamma description for a published post.',
            pubDate: 'Jul 10 2022',
            heroImage: '/missing-image.jpg',
            tags: ['Ops'],
          },
          body: 'C'.repeat(260),
        },
      ],
      { hasAsset: async (assetPath) => assetPath !== '/missing-image.jpg' },
    ),
    materializer: createFileSystemBackfillMaterializer({
      repoDir: path.join(runtimeDir, 'audit-only'),
      dryRun: true,
    }),
    migratedAt: new Date('2026-01-03T10:15:00.000Z'),
  });

  assert.equal(result.stats.migrated, 1);
  assert.equal(result.stats.skipped, 2);
  assert.equal(result.stats.warnings, 1);
  assert.equal(result.stats.errors, 2);
  assert.deepEqual(
    result.skippedPosts.map((post) => post.reasons[0].code),
    ['slug-collision', 'slug-collision'],
  );
  assert.equal(result.report.auditPosts.find((post) => post.slug === 'gamma').warnings[0].code, 'missing-hero-image');
});
