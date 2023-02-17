import { getProjects, initializeOctokit } from "../scripts/get_post";
import Link from "next/link";

const ProjectsPage = function ({ projects }) {
	console.log(projects);
	return (
		<div className="flex items-center justify-center">
			<div className="flex flex-col">
				{projects.map((project, idx) => {
					return (
						<section
							key={`${project.name}-${idx}`}
							className="text-font"
						>
							<Link href={project.url}>
								<h1>{project.name}</h1>
							</Link>
							<p>{project.description}</p>
						</section>
					);
				})}
			</div>
		</div>
	);
};

export async function getStaticProps() {
	const octokit = initializeOctokit();
	const projects = await getProjects(octokit);
	return {
		props: {
			projects,
		},
	};
}

export default ProjectsPage;
