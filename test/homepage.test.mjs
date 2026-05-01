import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');

function readBuiltFile(relativePath) {
	return readFileSync(path.join(distDir, relativePath), 'utf8');
}

function readLinkedStylesheets(htmlPath) {
	const html = readBuiltFile(htmlPath);
	const hrefs = [...html.matchAll(/href="(\/_astro\/[^"]+\.css)"/g)].map(([, href]) => href.slice(1));
	return hrefs.map((href) => readBuiltFile(href)).join('\n');
}

test('homepage publishes Project Defiant hero copy and live CTA destinations', () => {
	const html = readBuiltFile('index.html');

	assert.match(html, /Where no man has code before\.\.\./);
	assert.match(html, /life science/i);
	assert.match(html, /programming/i);
	assert.match(html, /href="\/blog"[^>]*>Enter the blog</);
	assert.match(
		html,
		/mailto:szymonszyszkowski@gmail\.com\?subject=Project%20Defiant%20inquiry/,
	);
});

test('homepage hero integrates the cropped spaceship asset as presentation, not baked heading text', () => {
	const html = readBuiltFile('index.html');
	const css = readLinkedStylesheets('index.html');

	assert.match(html, /<h1[^>]*>Where no man has code before\.\.\.<\/h1>/);
	assert.doesNotMatch(html, /<h1[^>]*>&lt;project::defiant&gt;<\/h1>/i);
	assert.match(html, /Mission signals/);
	assert.match(`${html}\n${css}`, /images\/spaceship-hero\.jpg/);
});

test('homepage keeps immersive motion hooks around the real hero copy and CTAs', () => {
	const html = readBuiltFile('index.html');

	assert.match(html, /data-motion="full"/);
	assert.match(html, /data-motion-scene="immersive-hero"/);
	assert.match(html, /data-motion-block="copy"/);
	assert.match(html, /data-motion-block="contact"/);
	assert.match(html, /data-motion-block="signals"/);
	assert.match(html, /href="\/blog"[^>]*>Enter the blog</);
	assert.match(html, /href="\/resume"[^>]*>View resume</);
});

test('homepage ships graceful reduced-motion and constrained-device fallbacks', () => {
	const html = readBuiltFile('index.html');
	const css = readLinkedStylesheets('index.html');

	assert.match(html, /prefers-reduced-motion: reduce/);
	assert.match(html, /max-width: 720px/);
	assert.match(html, /hover: none/);
	assert.match(html, /saveData/);
	assert.match(css, /\[data-motion=lite\]/);
	assert.match(css, /\[data-motion=reduce\]/);
	assert.match(css, /a:focus-visible/);
});
