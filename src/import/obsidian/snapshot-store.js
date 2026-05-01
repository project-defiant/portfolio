import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { DEFAULT_SOURCE_REPO } from './constants.js';

function createEmptySnapshot() {
  return {
    repo: { ...DEFAULT_SOURCE_REPO },
    fetchedAt: null,
    notes: [],
  };
}

export async function readStoredSnapshot(snapshotFile) {
  try {
    const raw = await readFile(snapshotFile, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      repo: parsed.repo ?? { ...DEFAULT_SOURCE_REPO },
      fetchedAt: parsed.fetchedAt ?? null,
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    };
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return createEmptySnapshot();
    }

    throw error;
  }
}

export async function writeStoredSnapshot(snapshotFile, snapshot) {
  await mkdir(path.dirname(snapshotFile), { recursive: true });
  await writeFile(snapshotFile, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
}

export function createSnapshotFileSource(snapshotFile) {
  return {
    async load() {
      return readStoredSnapshot(snapshotFile);
    },
  };
}
