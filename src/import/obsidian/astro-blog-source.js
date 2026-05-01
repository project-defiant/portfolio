import path from 'node:path';
import { readdir, readFile, stat } from 'node:fs/promises';

import { parseFrontmatterDocument } from './frontmatter.js';

function normalizeRelativePath(filePath) {
  return filePath.replaceAll('\\', '/').replace(/^\.\//, '');
}

async function walk(directory, collected = []) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'imported') {
        continue;
      }

      await walk(fullPath, collected);
      continue;
    }

    if (/\.(md|mdx)$/i.test(entry.name)) {
      collected.push(fullPath);
    }
  }

  return collected;
}

export function createAstroBlogBackfillSource({ contentDir, publicDir }) {
  return {
    async load() {
      const files = await walk(contentDir);
      const posts = [];

      for (const file of files.sort((left, right) => left.localeCompare(right))) {
        const relativePath = normalizeRelativePath(path.relative(contentDir, file));
        const document = await readFile(file, 'utf8');
        const { metadata, body } = parseFrontmatterDocument(document);
        const extension = path.extname(relativePath).toLowerCase() === '.mdx' ? '.mdx' : '.md';
        const slug = normalizeRelativePath(relativePath.slice(0, -extension.length));

        posts.push({
          path: relativePath,
          slug,
          extension,
          metadata,
          body,
        });
      }

      return {
        posts,
        async hasAsset(publicPath) {
          if (typeof publicPath !== 'string' || !publicPath.startsWith('/')) {
            return false;
          }

          try {
            const assetStat = await stat(path.join(publicDir, publicPath.slice(1)));
            return assetStat.isFile();
          } catch {
            return false;
          }
        },
      };
    },
  };
}
