import path from 'node:path';
import { createSnapshotFileSource } from '../src/import/obsidian/snapshot-store.js';
import { createFileSystemImportMaterializer } from '../src/import/obsidian/materializer.js';
import { runObsidianImport } from '../src/import/obsidian/pipeline.js';
import { createGitHubIssueClientFromEnvironment } from '../src/import/obsidian/github-issues.js';
import { createGitHubIssueReporter, readGitHubRunContext } from '../src/import/obsidian/reporting.js';

const projectRoot = process.cwd();
const snapshotFile = path.join(projectRoot, 'src', 'generated', 'obsidian', 'source-snapshot.json');
const contentDir = path.join(projectRoot, 'src', 'content', 'blog', 'imported');
const reportFile = path.join(projectRoot, 'src', 'generated', 'obsidian', 'import-report.json');

const result = await runObsidianImport({
  source: createSnapshotFileSource(snapshotFile),
  materializer: createFileSystemImportMaterializer({ contentDir, reportFile }),
});

const reporting = await createGitHubIssueReporter({
  issueClient: createGitHubIssueClientFromEnvironment(),
}).report({
  report: result.report,
  run: readGitHubRunContext(),
});

if (result.stats.skipped > 0 && reporting.status !== 'reported') {
  console.warn(
    JSON.stringify(
      {
        warning: 'Invalid publish-ready notes were found but the GitHub issue notification was not created.',
        reporting,
      },
      null,
      2,
    ),
  );
}

console.log(
  JSON.stringify(
    {
      considered: result.stats.considered,
      imported: result.stats.imported,
      skipped: result.stats.skipped,
      reportFile,
      reporting: {
        status: reporting.status,
        issueUrl: reporting.issue?.html_url ?? null,
        error: reporting.error ?? null,
      },
    },
    null,
    2,
  ),
);
