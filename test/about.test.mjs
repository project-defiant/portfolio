import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');

function readBuiltFile(relativePath) {
  return readFileSync(path.join(distDir, relativePath), 'utf8');
}

test('about page renders the approved narrative through the shared shell', () => {
  const html = readBuiltFile('about/index.html');

  assert.match(html, /<title>About \| PROJECT-DEFIANT/);
  assert.match(html, /href="\/about" class="active"/);

  for (const phrase of [
    /childhood curiosity/i,
    /study biotechnology/i,
    /DNA sequencing/i,
    /genome analyst/i,
    /postgraduate omics studies/i,
    /software engineer at MNM Diagnostics/i,
    /Project Defiant/i,
    /inventor, scientist, and engineer/i,
    /science fiction/i,
  ]) {
    assert.match(html, phrase);
  }
});

test('about page preserves the personal traits section in the public output', () => {
  const html = readBuiltFile('about/index.html');

  for (const phrase of [
    /Never stop growing/i,
    /Love discovering new things/i,
    /Discipline makes me free/i,
    /Think fast/i,
    /chaos theory/i,
  ]) {
    assert.match(html, phrase);
  }
});
