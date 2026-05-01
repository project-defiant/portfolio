import test from 'node:test';
import assert from 'node:assert/strict';

import { createGitHubIssueReporter } from '../src/import/obsidian/reporting.js';

function createImportReport(overrides = {}) {
  return {
    repo: { owner: 'project-defiant', repo: 'Project-defiant', ref: 'main' },
    fetchedAt: '2024-11-22T09:00:00.000Z',
    importedAt: '2024-11-22T09:30:00.000Z',
    ignoredPaths: ['drafts/not-ready.md'],
    skippedPosts: [
      {
        path: 'blog/ready/stub.md',
        reasons: [
          {
            code: 'unknown-field',
            field: 'extra',
            message: 'extra is not allowed in strict import mode.',
          },
          {
            code: 'too-short-content',
            field: 'body',
            message: 'body must be at least 200 non-whitespace characters.',
          },
        ],
      },
    ],
    importedPosts: [
      {
        slug: 'launch-sequence',
        sourceFile: 'blog/ready/launch-sequence.md',
        pubDate: '2024-11-01',
        updatedDate: null,
      },
    ],
    stats: {
      discovered: 3,
      considered: 2,
      imported: 1,
      skipped: 1,
    },
    ...overrides,
  };
}

function createCapturingIssueClient() {
  const calls = [];

  return {
    issueClient: {
      async createIssue(payload) {
        calls.push(payload);
        return {
          number: 12,
          html_url: 'https://github.com/project-defiant/the-defiant/issues/12',
        };
      },
    },
    getCalls() {
      return calls;
    },
  };
}

test('reporter creates one aggregated issue per run for invalid publish-ready notes', async () => {
  const capture = createCapturingIssueClient();
  const reporter = createGitHubIssueReporter({ issueClient: capture.issueClient });

  const result = await reporter.report({
    report: createImportReport(),
    run: {
      trigger: 'schedule',
      repository: 'mindos/The-defiant',
      runId: '4821',
      runUrl: 'https://github.com/mindos/The-defiant/actions/runs/4821',
      sha: 'abc123def456',
    },
  });

  assert.equal(capture.getCalls().length, 1);

  const [payload] = capture.getCalls();
  assert.match(payload.title, /1 invalid publish-ready note/i);
  assert.match(payload.title, /run 4821/i);
  assert.match(payload.body, /Imported posts: 1/);
  assert.match(payload.body, /Skipped notes: 1/);
  assert.match(payload.body, /Ignored paths: 1/);
  assert.match(payload.body, /blog\/ready\/stub\.md/);
  assert.match(payload.body, /unknown-field/);
  assert.match(payload.body, /too-short-content/);
  assert.match(payload.body, /launch-sequence/);
  assert.match(payload.body, /actions\/runs\/4821/);
  assert.equal(result.status, 'reported');
  assert.equal(result.reported, true);
  assert.equal(result.hardFailure, false);
});

test('reporter does not turn valid imports into hard failures when issue creation fails', async () => {
  const reporter = createGitHubIssueReporter({
    issueClient: {
      async createIssue() {
        throw new Error('GitHub issue API unavailable');
      },
    },
  });

  const result = await reporter.report({
    report: createImportReport(),
    run: {
      trigger: 'workflow_dispatch',
      repository: 'mindos/The-defiant',
      runId: '4822',
    },
  });

  assert.equal(result.status, 'reporting-failed');
  assert.equal(result.reported, false);
  assert.equal(result.hardFailure, false);
  assert.match(result.error, /GitHub issue API unavailable/);
});

test('reporter skips GitHub issue creation when no invalid ready notes were found', async () => {
  const capture = createCapturingIssueClient();
  const reporter = createGitHubIssueReporter({ issueClient: capture.issueClient });

  const result = await reporter.report({
    report: createImportReport({
      skippedPosts: [],
      stats: {
        discovered: 1,
        considered: 1,
        imported: 1,
        skipped: 0,
      },
    }),
    run: {
      trigger: 'manual',
      repository: 'mindos/The-defiant',
      runId: '4823',
    },
  });

  assert.equal(capture.getCalls().length, 0);
  assert.equal(result.status, 'not-needed');
  assert.equal(result.reported, false);
  assert.equal(result.hardFailure, false);
});
