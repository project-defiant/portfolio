const DEFAULT_API_BASE_URL = 'https://api.github.com';

function createHeaders(token) {
  return {
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'project-defiant-obsidian-import',
    Authorization: `Bearer ${token}`,
  };
}

export function createGitHubIssueClient({
  owner,
  repo,
  token = process.env.GITHUB_TOKEN,
  apiBaseUrl = DEFAULT_API_BASE_URL,
  fetchImpl = fetch,
} = {}) {
  if (!owner || !repo || !token) {
    return null;
  }

  return {
    async createIssue({ title, body }) {
      const response = await fetchImpl(`${apiBaseUrl}/repos/${owner}/${repo}/issues`, {
        method: 'POST',
        headers: createHeaders(token),
        body: JSON.stringify({ title, body }),
      });

      if (!response.ok) {
        throw new Error(`GitHub issue creation failed (${response.status}) for ${owner}/${repo}`);
      }

      return response.json();
    },
  };
}

export function createGitHubIssueClientFromEnvironment({
  repository = process.env.GITHUB_REPOSITORY,
  token = process.env.GITHUB_TOKEN,
  apiBaseUrl,
  fetchImpl,
} = {}) {
  if (!repository || !repository.includes('/')) {
    return null;
  }

  const [owner, repo] = repository.split('/');
  return createGitHubIssueClient({ owner, repo, token, apiBaseUrl, fetchImpl });
}
