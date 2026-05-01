import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');

function readBuiltFile(relativePath) {
	return readFileSync(path.join(distDir, relativePath), 'utf8');
}

function escapeForRegex(value) {
	return value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertStaticRedirect(relativePath, location) {
	const html = readBuiltFile(relativePath);
	assert.match(html, new RegExp(`http-equiv="refresh" content="0;url=${escapeForRegex(location)}"`));
	assert.match(html, new RegExp(`<a href="${escapeForRegex(location)}"`));
}

function readLinkedStylesheets(htmlPath) {
	const html = readBuiltFile(htmlPath);
	const hrefs = [...html.matchAll(/href="(\/_astro\/[^"]+\.css)"/g)].map(([, href]) => href.slice(1));
	return hrefs.map((href) => readBuiltFile(href)).join('\n');
}

test('site shell publishes approved identity, routes, and real contact links', () => {
	const html = readBuiltFile('index.html');

	assert.match(html, /PROJECT-DEFIANT/);
	assert.match(html, /Szymon Szyszkowski/);

	for (const [href, label] of [
		['/', 'Home'],
		['/about', 'About'],
		['/resume', 'Resume'],
		['/blog', 'Blog'],
	]) {
		assert.match(html, new RegExp(`href="${href}"[^>]*>${label}<`));
	}

	for (const href of [
		'https://github.com/project-defiant',
		'https://www.linkedin.com/in/szymon-szyszkowski-bb3762182',
		'https://x.com/SSzyszkowski',
		'mailto:szymonszyszkowski@gmail.com',
	]) {
		assert.match(html, new RegExp(href.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')));
	}

	assert.doesNotMatch(html, /Hello, Astronaut!|astrodotbuild|withastro|m\.webtoo\.ls/i);
	assert.ok(readBuiltFile('about/index.html').length > 0);
	assert.ok(readBuiltFile('resume/index.html').length > 0);
});

test('shared metadata is branded consistently across public pages', () => {
	const home = readBuiltFile('index.html');
	const about = readBuiltFile('about/index.html');
	const resume = readBuiltFile('resume/index.html');

	assert.match(home, /<title>PROJECT-DEFIANT/);
	assert.match(home, /property="og:site_name" content="PROJECT-DEFIANT"/);
	assert.match(home, /rel="canonical" href="https:\/\/project-defiant\.github\.io\/"/);

	assert.match(about, /<title>About \| PROJECT-DEFIANT/);
	assert.match(resume, /<title>Resume \| PROJECT-DEFIANT/);
	assert.match(resume, /property="twitter:site" content="@SSzyszkowski"/);
});

test('built styles default to a dark theme with a light fallback', () => {
	const css = readLinkedStylesheets('index.html');

	assert.match(css, /color-scheme:dark light/);
	assert.match(css, /@media \(prefers-color-scheme: light\)/);
	assert.match(css, /--color-background: 10 12 16/);
	assert.match(css, /--color-background: 245 247 250/);
});

test('legacy About and Timeline routes redirect to normalized public URLs', () => {
	assertStaticRedirect('About/index.html', '/about');
	assertStaticRedirect('Timeline/index.html', '/resume');
});

test('resume route introduces a recruiter-friendly summary above structured sections', () => {
	const resume = readBuiltFile('resume/index.html');

	assert.match(resume, /<h1[^>]*>Resume<\/h1>/);
	assert.match(
		resume,
		/Senior computational biologist and bioinformatics software developer bridging genomics, data curation, and delivery/i,
	);
	assert.match(resume, /<h2[^>]*>Experience<\/h2>/);
	assert.match(resume, /<h2[^>]*>Education<\/h2>/);
	assert.match(resume, /<h2[^>]*>Service<\/h2>/);
	assert.match(resume, /Open Targets/);
});

test('resume route keeps key experience and education entries in resume order', () => {
	const resume = readBuiltFile('resume/index.html');

	for (const phrase of [
		'Open Targets',
		'Data Curators',
		'QuartzBio',
		'Self Development',
		'MNM Diagnostics',
		"Children's Health Memorial Institute",
		'Aflofarm',
		'ICM UW HEAP trainee',
		'ICM UW Omics postgraduate',
		'Intercollegiate Faculty of Biotechnology trainee',
		'Lodz University of Technology degree',
		'Lodz University senate/service',
	]) {
		assert.match(resume, new RegExp(escapeForRegex(phrase)));
	}

	assert.ok(resume.indexOf('Open Targets') < resume.indexOf('QuartzBio'));
	assert.ok(resume.indexOf('QuartzBio') < resume.indexOf('MNM Diagnostics'));
	assert.ok(resume.indexOf('MNM Diagnostics') < resume.indexOf("Children&#39;s Health Memorial Institute"));
	assert.ok(resume.indexOf('ICM UW HEAP trainee') < resume.indexOf('Lodz University of Technology degree'));
	assert.ok(resume.indexOf('Lodz University of Technology degree') < resume.indexOf('Lodz University senate/service'));
});

test('blog routes keep canonical lowercase URLs and redirect legacy uppercase paths', () => {
	const blogIndex = readBuiltFile('blog/index.html');
	const blogPost = readBuiltFile('blog/first-post/index.html');
	const rss = readBuiltFile('rss.xml');

	assert.match(blogIndex, /href="\/blog\/first-post\/"/);
	assert.match(blogPost, /rel="canonical" href="https:\/\/project-defiant\.github\.io\/blog\/first-post\/"/);
	assert.match(rss, /<link>https:\/\/project-defiant\.github\.io\/blog\/first-post\/<\/link>/);

	assertStaticRedirect('Blog/index.html', '/blog');
	assertStaticRedirect('Blog/first-post/index.html', '/blog/first-post');
});
