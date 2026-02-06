import {
	getBlogIndex,
	initializeOctokit,
	getPostContent,
	getHtmlContent,
} from "../../scripts/get_post";
import { ReactNode } from "react";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface PostProps {
	children?: ReactNode | undefined;
	className?: string;
	content: string;
	title: string;
	date: string;
	description: string;
	metadata: unknown;
	type?: "md" | "rmd";
}

function PostPage(props: PostProps) {
	return (
		<div className="flex flex-col items-center justify-center my-6">
			<article className="prose prose-invert prose-lg md:prose-xl m-6 p-6 blog-content max-w-4xl">
				<header className="mb-8 border-b border-font/20 pb-4">
					<h1 className="text-3xl md:text-4xl font-bold text-font mb-2">{props.title}</h1>
					<p className="text-font/70 text-sm">{props.date}</p>
					{props.description && (
						<p className="text-font/80 mt-2 italic">{props.description}</p>
					)}
				</header>
				{props.type === "rmd" ? (
					<div
						className="rmd-content"
						dangerouslySetInnerHTML={{ __html: props.content }}
					/>
				) : (
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
					>
						{props.content}
					</ReactMarkdown>
				)}
			</article>
		</div>
	);
}

export default PostPage;

export async function getStaticPaths() {
	const octokit = initializeOctokit();
	const posts = await getBlogIndex(octokit);
	const data = await JSON.parse(posts);
	const params = data.map((elem) => {
		// Strip both .md and .rmd extensions
		const postId = elem.title.replace(/\.(md|rmd)$/i, "");
		return {
			params: {
				postId: postId,
				postDate: elem.date,
				postDescription: elem.description,
			},
		};
	});

	return {
		paths: params,
		fallback: true, // can also be true or 'blocking'
	};
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
	const postPath = context.params.postId;
	const title = postPath.replaceAll("_", " ").replaceAll("-", " ");
	const octokit = initializeOctokit();
	const index = await getBlogIndex(octokit);
	const data = await JSON.parse(index);
	// get only current post index fields (match both .md and .rmd extensions)
	const metaData = data.filter((post) => {
		return post.title.replace(/\.(md|rmd)$/i, "") === postPath;
	})[0];

	const postType = metaData.type || "md";
	const date = metaData.date;
	const description = metaData.description;

	if (postType === "rmd") {
		// For RMD posts, fetch the pre-rendered HTML file
		const htmlContent = await getHtmlContent(octokit, postPath + ".html");
		return {
			props: {
				content: htmlContent || "",
				title: title,
				date: date,
				description: description,
				metadata: {},
				type: "rmd",
			},
		};
	} else {
		// For markdown posts, use the existing logic
		const content = await getPostContent(octokit, postPath + ".md");
		const parsedContent = matter(content);
		return {
			props: {
				content: parsedContent.content,
				title: title,
				date: date,
				description: description,
				metadata: parsedContent.data,
				type: "md",
			},
		};
	}
}
