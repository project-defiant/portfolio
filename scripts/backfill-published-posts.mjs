import path from 'node:path';

import { runAstroBlogBackfill } from '../src/import/obsidian/backfill.js';
import { createAstroBlogBackfillSource } from '../src/import/obsidian/astro-blog-source.js';
import { createFileSystemBackfillMaterializer } from '../src/import/obsidian/backfill-materializer.js';

const projectRoot = process.cwd();
const shouldWrite = process.argv.includes('--write');
const outputDir = path.join(projectRoot, 'src', 'generated', 'backfill', 'source-repo');
const reportFile = path.join(projectRoot, 'src', 'generated', 'backfill', 'backfill-report.json');

const result = await runAstroBlogBackfill({
  source: createAstroBlogBackfillSource({
    contentDir: path.join(projectRoot, 'src', 'content', 'blog'),
    publicDir: path.join(projectRoot, 'public'),
  }),
  materializer: createFileSystemBackfillMaterializer({
    repoDir: outputDir,
    reportFile,
    dryRun: !shouldWrite,
  }),
});

console.log(
  JSON.stringify(
    {
      dryRun: !shouldWrite,
      migrated: result.stats.migrated,
      skipped: result.stats.skipped,
      warnings: result.stats.warnings,
      errors: result.stats.errors,
      outputDir: shouldWrite ? outputDir : null,
      reportFile: shouldWrite ? reportFile : null,
      reviewSlugs: result.report.auditPosts
        .filter((post) => post.warnings.length > 0 || post.errors.length > 0)
        .map((post) => post.slug),
    },
    null,
    2,
  ),
);
