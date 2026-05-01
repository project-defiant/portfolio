import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import { runObsidianImport } from '../src/import/obsidian/pipeline.js';
import { createFileSystemImportMaterializer } from '../src/import/obsidian/materializer.js';
import { createGitHubSnapshotLoader } from '../src/import/obsidian/github-source.js';

const projectRoot = process.cwd();
const runtimeDir = path.join(projectRoot, 'test', 'runtime', 'obsidian-import');

function createSource(notes) {
  return {
    async load() {
      return {
        repo: { owner: 'project-defiant', repo: 'Project-defiant', ref: 'main' },
        notes,
      };
    },
  };
}

function createCapturingMaterializer() {
  const writes = [];

  return {
    materializer: {
      async writeImportArtifacts(payload) {
        writes.push(payload);
        return {
          files: payload.posts.map((post) => `imported/${post.slug}.md`),
          reportFile: 'import-report.json',
        };
      },
    },
    getWrites() {
      return writes;
    },
  };
}

const longBody = [
  'PROJECT-DEFIANT field notes from the ready queue.',
  'This entry has enough detail to clear the blog-ready minimum content threshold.',
  'It should publish once the importer validates the metadata and materializes Astro content.',
  'The body keeps going so the test exercises a genuinely publishable post rather than a stub.',
].join('\n\n');

test('import pipeline only considers publish-ready notes and materializes eligible posts', async () => {
  const capture = createCapturingMaterializer();
  const result = await runObsidianImport({
    source: createSource([
      {
        path: 'drafts/keep-out.md',
        body: longBody,
        metadata: {
          title: 'Ignore me',
          description: 'This should never be considered for import.',
          pubDate: '2024-11-01',
          slug: 'ignore-me',
        },
      },
      {
        path: 'blog/ready/launch-sequence.md',
        body: longBody,
        metadata: {
          title: 'Launch sequence',
          description: 'A publish-ready field report from the approved queue.',
          pubDate: '2024-11-01',
          slug: 'launch-sequence',
          tags: ['Ops', ' Field Reports '],
        },
      },
    ]),
    materializer: capture.materializer,
    importedAt: new Date('2024-11-08T12:00:00.000Z'),
  });

  assert.deepEqual(result.ignoredPaths, ['drafts/keep-out.md']);
  assert.equal(result.stats.considered, 1);
  assert.equal(result.stats.imported, 1);
  assert.equal(result.stats.skipped, 0);

  const [{ posts, report }] = capture.getWrites();
  assert.equal(posts.length, 1);
  assert.equal(posts[0].slug, 'launch-sequence');
  assert.equal(posts[0].author, 'PROJECT-DEFIANT');
  assert.deepEqual(posts[0].tags, ['Ops', 'Field Reports']);
  assert.equal(posts[0].sourceFile, 'blog/ready/launch-sequence.md');
  assert.equal(posts[0].importedAt, '2024-11-08T12:00:00.000Z');
  assert.equal(report.skippedPosts.length, 0);
});

test('import pipeline skips invalid ready notes and returns structured validation reasons', async () => {
  const capture = createCapturingMaterializer();
  const result = await runObsidianImport({
    source: createSource([
      {
        path: 'blog/ready/stub.md',
        body: 'too short',
        metadata: {
          title: 'Stub note',
          description: 'Short body should fail validation.',
          pubDate: '2024-11-01',
          slug: 'stub-note',
          extra: 'nope',
        },
      },
      {
        path: 'blog/ready/bad-date.md',
        body: longBody,
        metadata: {
          title: 'Bad date note',
          description: 'Metadata contains a malformed publication date.',
          pubDate: '2024-11-011',
          slug: 'Bad-Date',
        },
      },
    ]),
    materializer: capture.materializer,
    importedAt: new Date('2024-11-08T12:00:00.000Z'),
  });

  assert.equal(result.stats.imported, 0);
  assert.equal(result.stats.skipped, 2);
  assert.equal(capture.getWrites()[0].posts.length, 0);

  assert.deepEqual(
    result.skippedPosts.map((post) => ({ path: post.path, codes: post.reasons.map((reason) => reason.code) })),
    [
      {
        path: 'blog/ready/stub.md',
        codes: ['unknown-field', 'too-short-content'],
      },
      {
        path: 'blog/ready/bad-date.md',
        codes: ['invalid-pub-date', 'invalid-slug'],
      },
    ],
  );
});

test('import pipeline still materializes valid posts when invalid ready notes are reported', async () => {
  const capture = createCapturingMaterializer();
  const result = await runObsidianImport({
    source: createSource([
      {
        path: 'blog/ready/launch-sequence.md',
        body: longBody,
        metadata: {
          title: 'Launch sequence',
          description: 'A publish-ready field report from the approved queue.',
          pubDate: '2024-11-01',
          slug: 'launch-sequence',
        },
      },
      {
        path: 'blog/ready/stub.md',
        body: 'too short',
        metadata: {
          title: 'Stub note',
          description: 'Short body should fail validation.',
          pubDate: '2024-11-01',
          slug: 'stub-note',
        },
      },
    ]),
    materializer: capture.materializer,
    importedAt: new Date('2024-11-08T12:00:00.000Z'),
  });

  assert.equal(result.stats.imported, 1);
  assert.equal(result.stats.skipped, 1);
  assert.deepEqual(
    result.importedPosts.map((post) => post.slug),
    ['launch-sequence'],
  );
  assert.deepEqual(
    result.skippedPosts.map((post) => post.path),
    ['blog/ready/stub.md'],
  );
  assert.deepEqual(
    capture.getWrites()[0].posts.map((post) => post.slug),
    ['launch-sequence'],
  );
});

test('file-system materializer writes Astro-ready markdown and a structured report', async () => {
  await rm(runtimeDir, { recursive: true, force: true });

  const materializer = createFileSystemImportMaterializer({
    contentDir: path.join(runtimeDir, 'content'),
    reportFile: path.join(runtimeDir, 'obsidian-import-report.json'),
  });

  const result = await runObsidianImport({
    source: createSource([
      {
        path: 'blog/ready/portable-astro.md',
        body: longBody,
        metadata: {
          title: 'Portable Astro import',
          description: 'A valid entry that should render into generated Astro markdown.',
          pubDate: '2024-11-15',
          updatedDate: '2024-11-16',
          slug: 'portable-astro-import',
          featured: true,
          heroImage: '/portable-astro.jpg',
          heroImageAlt: 'Portable Astro artwork ready for migration.',
          tags: ['Astro', 'Import'],
        },
      },
    ]),
    materializer,
    importedAt: new Date('2024-11-22T09:30:00.000Z'),
  });

  const markdown = await readFile(
    path.join(runtimeDir, 'content', 'portable-astro-import.md'),
    'utf8',
  );
  const report = JSON.parse(await readFile(path.join(runtimeDir, 'obsidian-import-report.json'), 'utf8'));

  assert.match(markdown, /title: "Portable Astro import"/);
  assert.match(markdown, /author: "PROJECT-DEFIANT"/);
  assert.match(markdown, /slug: "portable-astro-import"/);
  assert.match(markdown, /sourceFile: "blog\/ready\/portable-astro\.md"/);
  assert.match(markdown, /importedAt: "2024-11-22T09:30:00.000Z"/);
  assert.match(markdown, /featured: true/);
  assert.match(markdown, /heroImageAlt: "Portable Astro artwork ready for migration\."/);
  assert.match(markdown, /Portable Astro import/);

  assert.equal(result.materialized.files[0], path.join(runtimeDir, 'content', 'portable-astro-import.md'));
  assert.equal(report.stats.imported, 1);
  assert.deepEqual(report.skippedPosts, []);

  await rm(runtimeDir, { recursive: true, force: true });
});

test('github snapshot loader reads the publish-ready manifest and keeps missing files reportable', async () => {
  const manifest = [
    {
      sourceFile: 'launch-sequence.md',
      title: 'Launch sequence',
      description: 'A valid publish-ready note from the remote manifest.',
      pubDate: '2024-11-01',
      slug: 'launch-sequence',
    },
    {
      sourceFile: 'missing-from-repo.md',
      title: 'Missing source file',
      description: 'Metadata exists even when the markdown body has not landed yet.',
      pubDate: '2024-11-02',
      slug: 'missing-source-file',
    },
  ];

  const loader = createGitHubSnapshotLoader({
    owner: 'project-defiant',
    repo: 'Project-defiant',
    ref: 'main',
    fetchImpl: async (url) => {
      if (url.endsWith('/blog/ready/index.json')) {
        return new Response(JSON.stringify(manifest), { status: 200 });
      }

      if (url.endsWith('/blog/ready/launch-sequence.md')) {
        return new Response(longBody, { status: 200 });
      }

      return new Response('not found', { status: 404 });
    },
  });

  const snapshot = await loader.load();

  assert.equal(snapshot.notes.length, 2);
  assert.equal(snapshot.notes[0].path, 'blog/ready/launch-sequence.md');
  assert.equal(snapshot.notes[0].body, longBody);
  assert.equal(snapshot.notes[1].path, 'blog/ready/missing-from-repo.md');
  assert.equal(snapshot.notes[1].body, '');
});
