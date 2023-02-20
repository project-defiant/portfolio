import { Octokit } from "octokit";
import { RequestError } from "@octokit/request-error";

interface OctokitInitializer {
	octokit: InstanceType<typeof Octokit>;
	owner: string;
	repo: string;
}

/**
 * @description Function to initialize octokit with `GITHUB_TOKEN` from env vars
 * @returns object with `octokit`, `owner` and `repo` attributes
 */
function initializeOctokit(): OctokitInitializer {
	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN,
	});
	const owner = "PROJECT-DEFIANT";
	const repo = "Project-defiant";
	return {
		octokit: octokit,
		owner: owner,
		repo: repo,
	};
}

/**xXs
 * @description Function to check if filename follows pattern of `XX-title.md`
 * @param filename name of the file to check
 * @returns true if file complies with pattern else false
 */
function isPost(filename: string): boolean {
	const expr = new RegExp("[0-9]+-\\w+.md");
	return filename.match(expr) ? true : false;
}

/**
 * @description Function to get content of the post file stored inside the git repository
 * @param octokitInitializer initializer object
 * @param path path to the post file in the git repo
 * @returns file content
 */
async function getPostContent(
	octokitInitializer: OctokitInitializer,
	path: string
): Promise<string | undefined> {
	try {
		const response = await octokitInitializer.octokit.request(
			`GET /repos/${octokitInitializer.owner}/${octokitInitializer.repo}/contents/${path}`
		);
		const content = Buffer.from(response.data.content, "base64").toString();
		return content;
	} catch (res: unknown) {
		if (res instanceof RequestError) {
			switch (res.status) {
				case 401:
					console.error("Authentication failed");
					break;
				case 404:
					console.error("Did not received any output");
					break;
			}
		}
	}
}

async function getBlogIndex(octokitInitializer: OctokitInitializer) {
	try {
		const response = await octokitInitializer.octokit.request(
			`GET /repos/${octokitInitializer.owner}/${octokitInitializer.repo}/contents/index.json`
		);
		const content = Buffer.from(response.data.content, "base64").toString();
		// const data = JSON.parse(content);
		return content;
	} catch (res: unknown) {
		if (res instanceof RequestError) {
			switch (res.status) {
				case 401:
					console.error("Authentication failed");
					break;
				case 404:
					console.error("Did not received any output");
					break;
			}
		}
	}
}

/**
 * @description Function to get list of projects from git repository
 * @param octokitInitializer initializer object
 * @returns list of repository objects with `name`, `url` and `description` attributes
 */
async function getProjects(octokitInitializer: OctokitInitializer) {
	try {
		const response =
			await octokitInitializer.octokit.rest.repos.listForUser({
				username: octokitInitializer.owner,
			});
		// get only public and non fork repositories
		const repos = response.data
			.filter((data) => !data.private)
			.filter((data) => !data.fork)
			.map((data) => {
				return {
					name: data.name,
					url: data.html_url,
					description: data.description,
				};
			});
		return repos;
	} catch (res: unknown) {
		// https://stackoverflow.com/questions/42618089/how-do-you-use-typed-errors-in-async-catch
		if (res instanceof RequestError) {
			switch (res.status) {
				case 401:
					console.log("Authentication failed");
					break;
				case 404:
					console.log("Did not received any output");
					break;
			}
			return res.message;
		}
	}
}

/**
 * @description Function to get list of current repository post files in .md format.
 * @param octokitInitializer initialzier object
 * @returns list of repository filenames
 */
async function getBlogPosts(octokitInitializer: OctokitInitializer) {
	try {
		const response = await octokitInitializer.octokit.request(
			`GET /repos/${octokitInitializer.owner}/${octokitInitializer.repo}/contents/`
		);
		const posts = response.data
			.map((data: { path: string }) => data.path)
			.filter(isPost);
		return posts;
	} catch (res) {
		if (res instanceof RequestError) {
			switch (res.status) {
				case 401:
					console.error("Authentication failed");
					break;
				case 404:
					console.error("Did not received any output file");
					break;
			}
		}
	}
}

export {
	isPost,
	getBlogPosts,
	getProjects,
	getPostContent,
	initializeOctokit,
	getBlogIndex,
};
