import path from 'node:path';
import { createGitHubSnapshotLoader } from '../src/import/obsidian/github-source.js';
import { writeStoredSnapshot } from '../src/import/obsidian/snapshot-store.js';

const projectRoot = process.cwd();
const snapshotFile = path.join(projectRoot, 'src', 'generated', 'obsidian', 'source-snapshot.json');
const triggerIndex = process.argv.indexOf('--trigger');
const trigger = triggerIndex >= 0 ? process.argv[triggerIndex + 1] : 'manual';

const loader = createGitHubSnapshotLoader();
const snapshot = await loader.load();
await writeStoredSnapshot(snapshotFile, snapshot);

console.log(
  JSON.stringify(
    {
      trigger,
      snapshotFile,
      fetchedAt: snapshot.fetchedAt,
      notes: snapshot.notes.length,
    },
    null,
    2,
  ),
);
