import path from 'node:path';
import { mkdir, rm, writeFile } from 'node:fs/promises';

function yamlString(value) {
  return JSON.stringify(value);
}

function buildFrontmatter(metadata, body) {
  const lines = [
    '---',
    `title: ${yamlString(metadata.title)}`,
    `description: ${yamlString(metadata.description)}`,
    `author: ${yamlString(metadata.author)}`,
    `pubDate: ${yamlString(metadata.pubDate)}`,
    `slug: ${yamlString(metadata.slug)}`,
    `featured: ${metadata.featured ? 'true' : 'false'}`,
    `tags: ${JSON.stringify(metadata.tags ?? [])}`,
  ];

  if (metadata.updatedDate) {
    lines.push(`updatedDate: ${yamlString(metadata.updatedDate)}`);
  }

  if (metadata.heroImage) {
    lines.push(`heroImage: ${yamlString(metadata.heroImage)}`);
  }

  if (metadata.heroImageAlt) {
    lines.push(`heroImageAlt: ${yamlString(metadata.heroImageAlt)}`);
  }

  lines.push('---', '', body, '');
  return lines.join('\n');
}

export function createFileSystemBackfillMaterializer({ repoDir, reportFile, dryRun = false }) {
  return {
    async writeBackfillArtifacts({ notes, manifest, report }) {
      const plannedFiles = ['blog/ready/index.json', ...notes.map((note) => note.path)];

      if (dryRun) {
        return {
          dryRun: true,
          plannedFiles,
          files: [],
          manifestFile: path.join(repoDir, 'blog', 'ready', 'index.json'),
          reportFile,
        };
      }

      await rm(repoDir, { recursive: true, force: true });
      const readyDir = path.join(repoDir, 'blog', 'ready');
      await mkdir(readyDir, { recursive: true });

      const files = [];
      for (const note of notes) {
        const targetFile = path.join(repoDir, note.path);
        await mkdir(path.dirname(targetFile), { recursive: true });
        await writeFile(targetFile, buildFrontmatter(note.metadata, note.body), 'utf8');
        files.push(targetFile);
      }

      const manifestFile = path.join(readyDir, 'index.json');
      await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

      if (reportFile) {
        await mkdir(path.dirname(reportFile), { recursive: true });
        await writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
      }

      return {
        dryRun: false,
        plannedFiles,
        files,
        manifestFile,
        reportFile,
      };
    },
  };
}
