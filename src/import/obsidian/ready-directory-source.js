import path from 'node:path';
import { readFile } from 'node:fs/promises';

import { APPROVED_READY_DIR, DEFAULT_SOURCE_REPO } from './constants.js';
import { parseFrontmatterDocument } from './frontmatter.js';

async function readOptionalJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function readOptionalText(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return '';
    }

    throw error;
  }
}

export function createReadyDirectorySource({ repoDir, repo = DEFAULT_SOURCE_REPO }) {
  return {
    async load() {
      const readyDir = path.join(repoDir, 'blog', 'ready');
      const manifestEntries = await readOptionalJson(path.join(readyDir, 'index.json'));
      const notes = [];

      for (const entry of manifestEntries) {
        if (!entry || typeof entry.sourceFile !== 'string') {
          continue;
        }

        const sourceFile = entry.sourceFile.replaceAll('\\', '/');
        const rawDocument = await readOptionalText(path.join(readyDir, sourceFile));
        const { metadata: frontmatter, body } = parseFrontmatterDocument(rawDocument);
        const { sourceFile: _sourceFile, ...manifestMetadata } = entry;

        notes.push({
          path: `${APPROVED_READY_DIR}${sourceFile}`,
          body,
          metadata: Object.keys(frontmatter).length > 0 ? { ...frontmatter, ...manifestMetadata } : manifestMetadata,
        });
      }

      return {
        repo: { ...repo },
        fetchedAt: null,
        notes,
      };
    },
  };
}
