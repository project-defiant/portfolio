import { getBlogIndex, initializeOctokit } from "../../scripts/get_post";
import { useState } from "react";
import dynamic from "next/dynamic";

import PostCard from "../../components/postcard/postcard";
import TextWrapper from "../../components/text-components/text-wrapper";

// Dynamic import for TagWordCloud (uses D3 which requires client-side rendering)
const TagWordCloud = dynamic(
	() => import("../../components/wordcloud/TagWordCloud"),
	{ ssr: false }
);
function BlogPage(props) {
	const [tags, setTags] = useState(props.tags);
	const [isActive, setIsActive] = useState("");

	const handleTagClick = (tag: string) => {
		if (isActive === tag) {
			// Clicking the same tag again clears the filter
			setTags(props.tags);
			setIsActive("all");
		} else {
			setIsActive(tag);
			setTags([tag]);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center m-12">
			{/* Tag Word Cloud Section */}
			<div className="w-full max-w-4xl mb-12">
				<h1 className="text-font text-3xl m-6 text-center">
					<TextWrapper>Tag Cloud</TextWrapper>
				</h1>
				<TagWordCloud
					tags={props.tags}
					onTagClick={handleTagClick}
					selectedTag={isActive === "all" ? undefined : isActive}
				/>
				{isActive && isActive !== "all" && (
					<div className="text-center mt-4">
						<button
							className="text-font/70 hover:text-font underline text-sm"
							onClick={() => {
								setTags(props.tags);
								setIsActive("all");
							}}
						>
							Clear filter
						</button>
					</div>
				)}
			</div>

			<div className="flex flex-row items-end justify-center flex-wrap w-full">
			<div className="flex flex-col items-start justify-center m-6 w-full lg:w-1/2">
				<h1 className="text-font text-3xl m-6">
					<TextWrapper>Recent posts</TextWrapper>
				</h1>
				{props.posts.map((post) => {
					return (
						<PostCard
							description={post.description}
							title={post.title}
							date={post.date}
							key={post.title}
							tags={post.tags}
							href={`/blog/${post.title.replace(/\.(md|rmd)$/i, "")}`}
						></PostCard>
					);
				})}
			</div>
			<div className="flex flex-col items-start justify-center flex-wrap m-6 w-full lg:w-1/2">
				<h1 className="text-font text-3xl m-6">
					<TextWrapper>Search by tag</TextWrapper>
				</h1>
				<div className="flex flex-row flex-wrap">
					{props.tags.map((tag) => {
						return (
							<button
								className={`m-2 bg-background hover:bg-blue-500 text-font font-semibold hover:text-white py-2 px-4 border border-font hover:border-transparent rounded ${
									isActive === tag ? "btn-active" : ""
								}`}
								key={tag}
								onClick={() => {
									setIsActive(tag);
									setTags([tag]);
								}}
							>
								<span className="">{tag}</span>
							</button>
						);
					})}
					<button
						className={`m-2 bg-background hover:bg-blue-500 text-font font-semibold hover:text-white py-2 px-4 border border-font hover:border-transparent rounded ${
							isActive === "all" ? "btn-active" : ""
						}`}
						onClick={() => {
							setTags(props.tags);
							setIsActive("all");
						}}
					>
						all
					</button>
				</div>
				{props.posts.map((post) => {
					const hasAnyElems = tags.some((elem) =>
						post.tags.includes(elem)
					);

					return (
						hasAnyElems && (
							<PostCard
								description={post.description}
								title={post.title}
								date={post.date}
								key={post.title + 2}
								tags={post.tags}
								href={`/blog/${post.title.replace(/\.(md|rmd)$/i, "")}`}
							></PostCard>
						)
					);
				})}
			</div>
			</div>
		</div>
	);
}

export default BlogPage;

export async function getStaticProps(props) {
	const octokit = initializeOctokit();
	const posts = await getBlogIndex(octokit);
	// const new_posts = JSON.stringify(posts);
	const data = await JSON.parse(posts);
	const tags = data.map((elem) => elem.tags).flat();
	const paths = data.map((elem) => elem.title);
	console.log(paths);
	return {
		props: {
			posts: data,
			tags: tags,
			paths: paths,
		},
	};
}
