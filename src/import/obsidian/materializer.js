import path from 'node:path';
import { mkdir, rm, writeFile } from 'node:fs/promises';

function yamlString(value) {
  return JSON.stringify(value);
}

function buildFrontmatter(post) {
  const lines = [
    '---',
    `title: ${yamlString(post.title)}`,
    `description: ${yamlString(post.description)}`,
    `author: ${yamlString(post.author)}`,
    `pubDate: ${yamlString(post.pubDate)}`,
    `slug: ${yamlString(post.slug)}`,
    `sourceFile: ${yamlString(post.sourceFile)}`,
    `importedAt: ${yamlString(post.importedAt)}`,
    `featured: ${post.featured ? 'true' : 'false'}`,
    `tags: ${JSON.stringify(post.tags)}`,
  ];

  if (post.updatedDate) {
    lines.push(`updatedDate: ${yamlString(post.updatedDate)}`);
  }

  if (post.heroImage) {
    lines.push(`heroImage: ${yamlString(post.heroImage)}`);
  }

  if (post.heroImageAlt) {
    lines.push(`heroImageAlt: ${yamlString(post.heroImageAlt)}`);
  }

  lines.push('---', '', post.body, '');
  return lines.join('\n');
}

export function createFileSystemImportMaterializer({ contentDir, reportFile }) {
  return {
    async writeImportArtifacts({ posts, report }) {
      await rm(contentDir, { recursive: true, force: true });
      await mkdir(contentDir, { recursive: true });

      const files = [];
      for (const post of posts) {
        const targetFile = path.join(contentDir, `${post.slug}${post.extension}`);
        await writeFile(targetFile, buildFrontmatter(post), 'utf8');
        files.push(targetFile);
      }

      if (reportFile) {
        await mkdir(path.dirname(reportFile), { recursive: true });
        await writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
      }

      return { files, reportFile };
    },
  };
}
