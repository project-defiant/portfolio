function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatRunContext(run = {}) {
  const lines = [];

  if (run.repository) {
    lines.push(`- Repository: ${run.repository}`);
  }

  if (run.trigger) {
    lines.push(`- Trigger: ${run.trigger}`);
  }

  if (run.runId && run.runUrl) {
    lines.push(`- Run: [${run.runId}](${run.runUrl})`);
  } else if (run.runId) {
    lines.push(`- Run: ${run.runId}`);
  }

  if (run.sha) {
    lines.push(`- Commit: \`${String(run.sha).slice(0, 12)}\``);
  }

  return lines;
}

function formatSummary(report) {
  return [
    `- Notes discovered: ${report.stats.discovered}`,
    `- Ready notes considered: ${report.stats.considered}`,
    `- Imported posts: ${report.stats.imported}`,
    `- Skipped notes: ${report.stats.skipped}`,
    `- Ignored paths: ${report.ignoredPaths.length}`,
    `- Imported at: ${report.importedAt}`,
    `- Fetched at: ${report.fetchedAt ?? 'not available'}`,
    `- Source repo: ${report.repo.owner}/${report.repo.repo}@${report.repo.ref}`,
  ];
}

function formatImportedPosts(report) {
  if (report.importedPosts.length === 0) {
    return ['- None'];
  }

  return report.importedPosts.map(
    (post) => `- \`${post.slug}\` from \`${post.sourceFile}\` (pubDate ${post.pubDate})`,
  );
}

function formatSkippedPosts(report) {
  return report.skippedPosts.flatMap((post) => [
    `### \`${post.path}\``,
    ...post.reasons.map(
      (reason) => `- \`${reason.code}\` (${reason.field}): ${reason.message}`,
    ),
    '',
  ]);
}

function formatIgnoredPaths(report) {
  if (report.ignoredPaths.length === 0) {
    return ['- None'];
  }

  return report.ignoredPaths.map((filePath) => `- \`${filePath}\``);
}

function buildIssueTitle({ report, run = {} }) {
  const runLabel = run.runId ? ` from run ${run.runId}` : '';
  return `[Obsidian Import] ${pluralize(report.stats.skipped, 'invalid publish-ready note')}${runLabel}`;
}

function buildIssueBody({ report, run = {} }) {
  return [
    '# Obsidian import validation report',
    '',
    '## Run context',
    ...formatRunContext(run),
    '',
    '## Summary',
    ...formatSummary(report),
    '',
    '## Imported successes',
    ...formatImportedPosts(report),
    '',
    '## Invalid publish-ready notes',
    ...formatSkippedPosts(report),
    '## Ignored non-ready files',
    ...formatIgnoredPaths(report),
    '',
  ].join('\n');
}

export function readGitHubRunContext(env = process.env) {
  const repository = env.GITHUB_REPOSITORY;
  const runId = env.GITHUB_RUN_ID;
  const serverUrl = env.GITHUB_SERVER_URL ?? 'https://github.com';

  return {
    repository,
    trigger: env.GITHUB_EVENT_NAME ?? 'manual',
    runId,
    runUrl: repository && runId ? `${serverUrl}/${repository}/actions/runs/${runId}` : undefined,
    sha: env.GITHUB_SHA,
  };
}

export function createGitHubIssueReporter({ issueClient } = {}) {
  return {
    async report({ report, run } = {}) {
      if (!report || report.skippedPosts.length === 0) {
        return {
          status: 'not-needed',
          reported: false,
          hardFailure: false,
        };
      }

      if (!issueClient?.createIssue) {
        return {
          status: 'unconfigured',
          reported: false,
          hardFailure: false,
        };
      }

      const issue = {
        title: buildIssueTitle({ report, run }),
        body: buildIssueBody({ report, run }),
      };

      try {
        const createdIssue = await issueClient.createIssue(issue);
        return {
          status: 'reported',
          reported: true,
          hardFailure: false,
          issue: createdIssue,
        };
      } catch (error) {
        return {
          status: 'reporting-failed',
          reported: false,
          hardFailure: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}
