import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import PysparkIcon from "../public/pyspark.png";
import LustreIcon from "../public/lustre.png";
import SpadesIcon from "../public/spades.png";
import PytestIcon from "../public/pytest.svg";
import NextflowIcon from "../public/nextflow.png";
import DeltalakeIcon from "../public/deltalake.png";
import S3Icon from "../public/s3.png";
import JupyterIcon from "../public/jupyter.svg";

type IconType = "work" | "school";

interface TimelineEntry {
	title: string;
	subtitle: string;
	description?: string;
	date: string;
	type: IconType;
	skills?: string[];
	customIcons?: { src: StaticImageData; alt: string }[];
}

const SKILL_ICONS: Record<string, string> = {
	python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
	r: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
	pandas: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
	bash: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
	linux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
	typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
	rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
	scala: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
	nextjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
	tailwindcss: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
	django: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
	docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
	kubernetes: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
	aws: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
};

const timelineData: TimelineEntry[] = [
	{
		title: "Open Targets",
		subtitle: "Senior Computational Biologist",
		description:
			"Working with GWAS and QTL data and computational pipelines - Orchestration & Gentropy.",
		date: "2024 - onwards",
		type: "work",
		skills: ["python", "scala", "docker"],
		customIcons: [{ src: PysparkIcon, alt: "pyspark icon" }],
	},
	{
		title: "Data Curators",
		subtitle: "Software developer",
		description:
			"Working with deploying and organizing AWS cloud infrastructure, TIDE, preparing documents for successful software validation.",
		date: "2024",
		type: "work",
		skills: ["r", "aws"],
	},
	{
		title: "QuartzBio",
		subtitle: "Software developer II",
		description:
			"Developing solutions for Virtual Sample Management Inventory, working with clinical data processing in R environment.",
		date: "II.2024 - XII.2024",
		type: "work",
		skills: ["r", "docker"],
		customIcons: [{ src: S3Icon, alt: "s3 icon" }],
	},
	{
		title: "Self development",
		subtitle: "Constantly growing and learning new stuff",
		date: "2021 - onwards",
		type: "school",
		skills: ["nextjs", "tailwindcss", "django", "typescript", "rust", "scala"],
	},
	{
		title: "MNM diagnostics",
		subtitle: "Junior software developer (XI.2021 - VI.2022) → Software developer (VII.2022 - II.2023)",
		description:
			"Working with Whole genome sequencing, cancer tumor descriptors, rna-seq, bioinformatics tools development documentation, automatic testing and pipeline executions on AWS cloud infrastructure with gitOps strategy.",
		date: "XI.2021 – II.2023",
		type: "work",
		skills: ["python", "pandas", "docker", "kubernetes", "aws", "bash", "r"],
		customIcons: [
			{ src: PysparkIcon, alt: "pyspark icon" },
			{ src: PytestIcon, alt: "pytest icon" },
			{ src: NextflowIcon, alt: "nextflow icon" },
			{ src: DeltalakeIcon, alt: "deltalake icon" },
			{ src: S3Icon, alt: "s3 icon" },
			{ src: JupyterIcon, alt: "jupyter icon" },
		],
	},
	{
		title: "Interdisciplinary Centre for Mathematical and Computational Modelling at University of Warsaw",
		subtitle: "HEAP Metagenomics Pipelines",
		description: "Metagenomics pipelines evaluation on HPC cluster (Okeanos) at ICM UW - trainee project",
		date: "VI.2020 - VIII.2020",
		type: "work",
		skills: ["bash"],
		customIcons: [
			{ src: LustreIcon, alt: "lustre icon" },
			{ src: SpadesIcon, alt: "spades icon" },
		],
	},
	{
		title: "Interdisciplinary Centre for Mathematical and Computational Modelling at University of Warsaw",
		subtitle: "Omics Data Science course postgraduate",
		description: "Bioinformatics and analysis of high throughput biomedical data",
		date: "X.2019 – III.2020",
		type: "school",
		skills: ["python", "bash", "r"],
	},
	{
		title: "Children's Health Memorial Institute in Warsaw",
		subtitle: "Junior Assistant Biotechnologist / Bioinformatician",
		description: "NGS target panel data analytics & processing, rare disease genetics",
		date: "V.2019 – IX.2021",
		type: "work",
		skills: ["python", "linux"],
	},
	{
		title: "Aflofarm Poland drug manufacturing plant in Ksawerów",
		subtitle: "Junior Laboratory Analyst",
		date: "X.2018 – XII.2018",
		type: "work",
	},
	{
		title: "Intercollegiate Faculty of Biotechnology UG&MUG",
		subtitle: "Trainee in Laboratory of Protein Biochemistry",
		description: "Extraction of recombinant E.coli proteins.",
		date: "VII.2018 - VIII.2018",
		type: "work",
	},
	{
		title: "Senate of the Lodz University of Technology",
		subtitle: "Faculty of biotechnology council member, university senate member",
		date: "X.2017 – XII.2018",
		type: "school",
	},
	{
		title: "Lodz University of Technology",
		subtitle: "Biotechnology engineering I graduate",
		description: "Graduated with engineer diploma with specialization in technical biochemistry.",
		date: "X.2015 - II.2019",
		type: "school",
		skills: ["python", "pandas", "bash"],
	},
];

function WorkIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
			<path
				fillRule="evenodd"
				d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
				clipRule="evenodd"
			/>
			<path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
		</svg>
	);
}

function SchoolIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
			<path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
			<path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
			<path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
		</svg>
	);
}

function SkillBadge({ skill }: { skill: string }) {
	const iconUrl = SKILL_ICONS[skill];
	if (!iconUrl) return null;

	return (
		<div className="inline-block border-2 border-white/20 m-1 bg-white/10 rounded-full p-2">
			<img src={iconUrl} alt={skill} className="w-8 h-8" />
		</div>
	);
}

function CustomIconBadge({ src, alt }: { src: StaticImageData; alt: string }) {
	return (
		<div className="inline-block border-2 border-white/20 m-1 bg-white/10 rounded-full p-2">
			<div className="w-8 h-8 flex items-center justify-center">
				<Image src={src} alt={alt} className="max-w-full max-h-full object-contain" />
			</div>
		</div>
	);
}

function TimelineItem({ entry, isLast, index }: { entry: TimelineEntry; isLast: boolean; index: number }) {
	const isWork = entry.type === "work";
	const bgColor = isWork ? "bg-magentaBox" : "bg-lightblueBox";
	const iconBgColor = isWork ? "bg-magentaBox" : "bg-lightblueBox";

	const contentCard = (
		<div className={`${bgColor} rounded-lg p-4 text-white`}>
			<h3 className="text-lg font-bold">{entry.title}</h3>
			<h4 className="text-base opacity-90">{entry.subtitle}</h4>
			{entry.description && <p className="mt-2 text-sm opacity-80">{entry.description}</p>}

			{(entry.skills || entry.customIcons) && (
				<div className="flex flex-wrap mt-4">
					{entry.skills?.map((skill) => (
						<SkillBadge key={skill} skill={skill} />
					))}
					{entry.customIcons?.map((icon) => (
						<CustomIconBadge key={icon.alt} src={icon.src} alt={icon.alt} />
					))}
				</div>
			)}
		</div>
	);

	return (
		<motion.div
			className="flex gap-4 md:gap-8"
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
		>
			{/* Left side - content for school, date for work (hidden on mobile) */}
			<motion.div
				className="hidden md:flex md:w-1/3 justify-end items-start pt-4"
				initial={{ opacity: 0, x: -30 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true, margin: "-100px" }}
				transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
			>
				{isWork ? (
					<span className="text-font text-sm">{entry.date}</span>
				) : (
					contentCard
				)}
			</motion.div>

			{/* Center - line and icon */}
			<div className="flex flex-col items-center">
				<motion.div
					className={`${iconBgColor} rounded-full p-3 text-font z-10`}
					initial={{ scale: 0 }}
					whileInView={{ scale: 1 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.3, delay: index * 0.1 + 0.1, type: "spring", stiffness: 200 }}
				>
					{isWork ? <WorkIcon /> : <SchoolIcon />}
				</motion.div>
				{!isLast && (
					<motion.div
						className="w-0.5 bg-font/30 flex-1 min-h-[40px]"
						initial={{ scaleY: 0 }}
						whileInView={{ scaleY: 1 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
						style={{ originY: 0 }}
					/>
				)}
			</div>

			{/* Right side - content for work, date for school (hidden on mobile) */}
			<motion.div
				className="flex-1 md:w-1/3 pb-8"
				initial={{ opacity: 0, x: 30 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true, margin: "-100px" }}
				transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
			>
				{/* Date shown on mobile only */}
				<span className="md:hidden text-font text-sm block mb-2">{entry.date}</span>

				{/* On mobile, always show content on right. On desktop, depends on type */}
				<div className="md:hidden">{contentCard}</div>
				<div className="hidden md:block">
					{isWork ? (
						contentCard
					) : (
						<span className="text-font text-sm">{entry.date}</span>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
}

export default function TimelinePage() {
	return (
		<div className="max-w-4xl mx-auto px-4 py-8 mb-32">
			{timelineData.map((entry, index) => (
				<TimelineItem key={index} entry={entry} index={index} isLast={index === timelineData.length - 1} />
			))}
		</div>
	);
}
