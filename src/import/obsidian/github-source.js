import { APPROVED_READY_DIR, DEFAULT_SOURCE_REPO } from './constants.js';
import { normalizeSourcePath } from './schema.js';

function createHeaders(token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'project-defiant-obsidian-import',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function rawUrl({ owner, repo, ref, filePath }) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${filePath}`;
}

async function fetchOptionalJson(fetchImpl, url, headers) {
  const response = await fetchImpl(url, { headers });
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

async function fetchText(fetchImpl, url, headers) {
  const response = await fetchImpl(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}) for ${url}`);
  }

  return response.text();
}

function buildManifestMap(entries) {
  const manifest = new Map();

  if (!Array.isArray(entries)) {
    return manifest;
  }

  for (const entry of entries) {
    if (!entry || typeof entry !== 'object' || typeof entry.sourceFile !== 'string') {
      continue;
    }

    const sourceFile = normalizeSourcePath(entry.sourceFile);
    const { sourceFile: _sourceFile, ...metadata } = entry;
    manifest.set(sourceFile, metadata);
  }

  return manifest;
}

export function createGitHubSnapshotLoader({
  owner = DEFAULT_SOURCE_REPO.owner,
  repo = DEFAULT_SOURCE_REPO.repo,
  ref = DEFAULT_SOURCE_REPO.ref,
  token = process.env.GITHUB_TOKEN,
  fetchImpl = fetch,
} = {}) {
  return {
    async load() {
      const headers = createHeaders(token);
      const manifestEntries = await fetchOptionalJson(
        fetchImpl,
        rawUrl({ owner, repo, ref, filePath: `${APPROVED_READY_DIR}index.json` }),
        headers,
      );
      const manifest = buildManifestMap(manifestEntries);

      const notes = [];
      for (const [relativePath, metadata] of manifest.entries()) {
        const fullPath = `${APPROVED_READY_DIR}${relativePath}`;
        try {
          const body = await fetchText(fetchImpl, rawUrl({ owner, repo, ref, filePath: fullPath }), headers);
          notes.push({ path: fullPath, body, metadata });
        } catch (error) {
          if (error instanceof Error && error.message.includes('(404)')) {
            notes.push({ path: fullPath, body: '', metadata });
          } else {
            throw error;
          }
        }
      }

      return {
        repo: { owner, repo, ref },
        fetchedAt: new Date().toISOString(),
        notes,
      };
    },
  };
}
