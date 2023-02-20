import Link from "next/link";

const PostCard = function (props) {
	return (
		<Link
			href={props.href}
			className="flex flex-col justify-start items-start p-2 rounded m-2 bg-transparent hover:bg-blue-500 bg-background text-font font-semibold hover:text-white py-2 px-4 border border-font hover:border-transparent w-full"
		>
			<h2 className="text-magenta text-2xl">
				{props.title
					.replace(".md", "")
					.replaceAll("_", " ")
					.replaceAll("-", " ")}
			</h2>
			<div className="flex flex-wrap flex-row bg-background font-lightblue font-semibold items-start justify-start w-full">
				{props.tags.map((tag) => {
					return (
						<span
							className="p-2 m-2 first:ml-0 last:mr-0 border border-lightblue hover:border-transparent rounded "
							key={`${tag}-3`}
						>
							{tag}
						</span>
					);
				})}
			</div>

			<span className="text-font">uploaded at {props.date}</span>

			<p className="text-l">{props.description}</p>
		</Link>
	);
};

export default PostCard;
