import { DEFAULT_AUTHOR, DEFAULT_SOURCE_REPO } from './constants.js';
import { APPROVED_READY_DIR } from './constants.js';
import { validatePublishReadyNote } from './schema.js';

const MONTHS = new Map([
  ['jan', '01'],
  ['feb', '02'],
  ['mar', '03'],
  ['apr', '04'],
  ['may', '05'],
  ['jun', '06'],
  ['jul', '07'],
  ['aug', '08'],
  ['sep', '09'],
  ['oct', '10'],
  ['nov', '11'],
  ['dec', '12'],
]);

function toIsoDate(value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  const normalized = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const namedMonth = normalized.match(/^([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})$/);
  if (namedMonth) {
    const [, monthName, day, year] = namedMonth;
    const month = MONTHS.get(monthName.toLowerCase());
    if (month) {
      return `${year}-${month}-${day.padStart(2, '0')}`;
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return undefined;
  }

  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()))
    .toISOString()
    .slice(0, 10);
}

function normalizeTags(tags) {
  return Array.isArray(tags)
    ? tags.filter((tag) => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean)
    : [];
}

function detectWarnings(post, assetAvailable) {
  const warnings = [];

  if (post.extension === '.mdx' && (/^import\s/m.test(post.body) || /<\w+[\s>]/.test(post.body))) {
    warnings.push({
      code: 'mdx-format-risk',
      message: 'MDX post uses imports or component syntax and should be reviewed before publishing from the source repo.',
    });
  }

  if (post.metadata.heroImage && assetAvailable === false) {
    warnings.push({
      code: 'missing-hero-image',
      message: `Referenced hero image ${post.metadata.heroImage} is missing from public/.`,
    });
  }

  return warnings;
}

function createCollisionReason(slug, paths) {
  return {
    code: 'slug-collision',
    field: 'slug',
    message: `slug ${slug} collides across published posts: ${paths.join(', ')}.`,
  };
}

function groupPostsBySlug(posts) {
  const collisions = new Map();

  for (const post of posts) {
    const current = collisions.get(post.slug) ?? [];
    current.push(post.path);
    collisions.set(post.slug, current);
  }

  return collisions;
}

function createReadyMetadata(post) {
  return {
    title: post.metadata.title,
    description: post.metadata.description,
    author: typeof post.metadata.author === 'string' && post.metadata.author.trim().length > 0
      ? post.metadata.author.trim()
      : DEFAULT_AUTHOR,
    pubDate: toIsoDate(post.metadata.pubDate),
    updatedDate: toIsoDate(post.metadata.updatedDate),
    heroImage: post.metadata.heroImage,
    heroImageAlt: post.metadata.heroImageAlt,
    tags: normalizeTags(post.metadata.tags),
    featured: post.metadata.featured === true,
    slug: post.slug,
  };
}

export async function runAstroBlogBackfill({ source, materializer, migratedAt = new Date() }) {
  const snapshot = await source.load();
  const slugGroups = groupPostsBySlug(snapshot.posts ?? []);
  const migratedPosts = [];
  const skippedPosts = [];
  const auditPosts = [];
  const slugMap = [];

  for (const post of snapshot.posts ?? []) {
    const assetAvailable = post.metadata.heroImage ? await snapshot.hasAsset?.(post.metadata.heroImage) : undefined;
    const warnings = detectWarnings(post, assetAvailable);
    const metadata = createReadyMetadata(post);
    const relativeTargetPath = `${metadata.slug}${post.extension}`;

    if ((slugGroups.get(metadata.slug) ?? []).length > 1) {
      const reasons = [createCollisionReason(metadata.slug, slugGroups.get(metadata.slug) ?? [])];
      skippedPosts.push({ path: post.path, slug: metadata.slug, reasons });
      auditPosts.push({ path: post.path, slug: metadata.slug, warnings, errors: reasons });
      continue;
    }

    const transformed = {
      path: `${APPROVED_READY_DIR}${relativeTargetPath}`,
      body: post.body,
      metadata,
      sourcePath: post.path,
      extension: post.extension,
    };

    const validation = validatePublishReadyNote(
      { path: transformed.path, body: transformed.body, metadata: transformed.metadata },
      { importedAt: migratedAt },
    );

    if (!validation.ok) {
      skippedPosts.push({ path: post.path, slug: metadata.slug, reasons: validation.skip.reasons });
      auditPosts.push({ path: post.path, slug: metadata.slug, warnings, errors: validation.skip.reasons });
      continue;
    }

    migratedPosts.push(transformed);
    slugMap.push({
      sourcePath: post.path,
      slug: metadata.slug,
      targetPath: transformed.path,
      status: 'retained',
    });
    auditPosts.push({ path: post.path, slug: metadata.slug, warnings, errors: [] });
  }

  const manifest = migratedPosts.map((post) => ({
    sourceFile: post.path.slice(APPROVED_READY_DIR.length),
    ...post.metadata,
  }));

  const report = {
    targetRepo: { ...DEFAULT_SOURCE_REPO },
    migratedAt: migratedAt.toISOString(),
    slugMap,
    auditPosts,
    skippedPosts,
    manifest,
    stats: {
      discovered: snapshot.posts?.length ?? 0,
      migrated: migratedPosts.length,
      skipped: skippedPosts.length,
      warnings: auditPosts.reduce((total, post) => total + post.warnings.length, 0),
      errors: skippedPosts.reduce((total, post) => total + post.reasons.length, 0),
    },
  };

  const materialized = await materializer.writeBackfillArtifacts({
    notes: migratedPosts,
    manifest,
    report,
  });

  return {
    migratedPosts,
    skippedPosts,
    stats: report.stats,
    materialized,
    report,
  };
}
