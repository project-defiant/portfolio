import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');

function readBuiltFile(relativePath) {
  return readFileSync(path.join(distDir, relativePath), 'utf8');
}

test('blog index renders an editorial list with metadata and filter links', () => {
  const html = readBuiltFile('blog/index.html');

  assert.match(html, /Filter by topic/i);
  assert.match(html, /href="\/blog\/tags\/astro\/"[^>]*>\s*Astro\s*</);
  assert.match(html, /href="\/blog\/tags\/journal\/"[^>]*>\s*Journal\s*</);
  assert.match(html, /href="\/blog\/markdown-style-guide\/"/);
  assert.match(html, /href="\/blog\/using-mdx\/"/);
  assert.match(html, /Published <time[^>]*>\s*Jun 19, 2024\s*<\/time>/);
  assert.match(html, /Here is a sample of some basic Markdown syntax/);
  assert.doesNotMatch(html, /blog-placeholder-/);

  assert.ok(html.indexOf('/blog/markdown-style-guide/') < html.indexOf('/blog/using-mdx/'));
  assert.ok(html.indexOf('/blog/using-mdx/') < html.indexOf('/blog/third-post/'));
});

test('tag pages filter the editorial list and keep the active topic visible', () => {
  const html = readBuiltFile('blog/tags/astro/index.html');

  assert.match(html, /aria-current="page"[^>]*>\s*Astro\s*</);
  assert.match(html, /href="\/blog\/markdown-style-guide\/"/);
  assert.match(html, /href="\/blog\/using-mdx\/"/);
  assert.doesNotMatch(html, /href="\/blog\/first-post\/"/);
});

test('blog posts show calm metadata, tag links, and optional hero handling', () => {
  const withHero = readBuiltFile('blog/markdown-style-guide/index.html');
  const withoutHero = readBuiltFile('blog/first-post/index.html');

  assert.match(withHero, /class="post-hero"/);
  assert.match(withHero, /alt="Notebook with a markdown draft open on screen"/);
  assert.match(withHero, /href="\/blog\/tags\/astro\/"[^>]*>\s*Astro\s*</);
  assert.match(withHero, /Published <time[^>]*>\s*Jun 19, 2024\s*<\/time>/);

  assert.match(withoutHero, /class="post-header"/);
  assert.doesNotMatch(withoutHero, /class="post-hero"/);
  assert.match(withoutHero, /href="\/blog\/tags\/journal\/"[^>]*>\s*Journal\s*</);
});
