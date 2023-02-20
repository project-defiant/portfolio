import { useRouter } from "next/router";
import {
	getBlogIndex,
	initializeOctokit,
	getPostContent,
} from "../../scripts/get_post";
import { ReactNode } from "react";
import { remark } from "remark";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface PostProps {
	children?: ReactNode | undefined;
	className?: string;
	content: string;
	title: string;
	date: string;
	description: string;
	metadata: unknown;
}

function PostPage(props: PostProps) {
	console.log(props);
	return (
		<div className={"flex flex-col items-center justify-center my-6"}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				className="prose m-6 p-6 prose-zinc md:prose-xl blog-content"
			>
				{props.content}
			</ReactMarkdown>
		</div>
	);
}

export default PostPage;

export async function getStaticPaths() {
	const octokit = initializeOctokit();
	const posts = await getBlogIndex(octokit);
	const data = await JSON.parse(posts);
	const params = data.map((elem) => {
		return {
			params: {
				postId: elem.title.replace(".md", ""),
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
	const title = postPath.replace("_", " ").replace("-", " ");
	const octokit = initializeOctokit();
	const index = await getBlogIndex(octokit);
	const data = await JSON.parse(index);
	// get only current post index fields
	const metaData = data.filter((post) => {
		return post.title.replace(".md", "") === postPath;
	})[0];
	const content = await getPostContent(octokit, postPath + ".md");
	const date = metaData.date;
	const description = metaData.description;
	const parsedContent = matter(content);
	const processedContent = await remark().process(parsedContent.content);
	const contentHtml = processedContent.toString();
	return {
		props: {
			content: contentHtml,
			title: title,
			date: date,
			description: description,
			metadata: parsedContent.data,
		},
	};
}
