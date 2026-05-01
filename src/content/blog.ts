import { getCollection, type CollectionEntry } from 'astro:content';

export interface BlogTagLink {
label: string;
slug: string;
}

export interface BlogTagOption extends BlogTagLink {
count: number;
}

export interface PreparedBlogPost {
entry: CollectionEntry<'blog'>;
slug: string;
title: string;
description: string;
pubDate: Date;
updatedDate?: Date;
heroImage?: string;
heroImageAlt?: string;
tags: BlogTagLink[];
readingTimeMinutes: number;
}

export function slugifyTag(tag: string) {
return tag
.trim()
.toLowerCase()
.replace(/[^a-z0-9]+/g, '-')
.replace(/^-+|-+$/g, '');
}

function dedupeTags(tags: string[]) {
const seen = new Map<string, BlogTagLink>();

for (const label of tags) {
const trimmedLabel = label.trim();
const slug = slugifyTag(trimmedLabel);

if (slug && !seen.has(slug)) {
seen.set(slug, { label: trimmedLabel, slug });
}
}

return [...seen.values()];
}

function getReadingTimeMinutes(body: string) {
const words = body.trim().split(/\s+/).filter(Boolean).length;
return Math.max(1, Math.ceil(words / 180));
}

export function prepareBlogPost(entry: CollectionEntry<'blog'>): PreparedBlogPost {
return {
entry,
slug: entry.slug,
title: entry.data.title,
description: entry.data.description,
pubDate: entry.data.pubDate,
updatedDate: entry.data.updatedDate,
heroImage: entry.data.heroImage,
heroImageAlt: entry.data.heroImageAlt,
tags: dedupeTags(entry.data.tags ?? []),
readingTimeMinutes: getReadingTimeMinutes(entry.body),
};
}

export async function getPreparedBlogPosts() {
const posts = await getCollection('blog');
return posts.map(prepareBlogPost).sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

export function collectBlogTags(posts: PreparedBlogPost[]) {
const counts = new Map<string, BlogTagOption>();

for (const post of posts) {
for (const tag of post.tags) {
const current = counts.get(tag.slug);
if (current) {
current.count += 1;
} else {
counts.set(tag.slug, { ...tag, count: 1 });
}
}
}

return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function getPostsForTag(posts: PreparedBlogPost[], tagSlug: string) {
return posts.filter((post) => post.tags.some((tag) => tag.slug === tagSlug));
}
