import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SchoolIcon from "@mui/icons-material/School";
import PysparkIcon from "../public/pyspark.png";
import LustreIcon from "../public/lustre.png";
import KronaIcon from "../public/krona.png";
import SpadesIcon from "../public/spades.png";
import PytestIcon from "../public/pytest.svg";
import NextflowIcon from "../public/nextflow.png";
import FastapiIcon from "../public/fastapi.png";
import DeltalakeIcon from "../public/deltalake.png";
import NeovimIcon from "../public/Neovim.png";
import S3Icon from "../public/s3.png";
import HailIcon from "../public/hail.png";
import Image from "next/image";
import JupyterIcon from "../public/jupyter.svg";
import {
	COriginalIcon,
	ROriginalIcon,
	VscodeOriginalIcon,
	NumpyOriginalIcon,
	PythonOriginalIcon,
	ReactOriginalIcon,
	PandasOriginalIcon,
	BashOriginalIcon,
	LinuxOriginalIcon,
	JavascriptOriginalIcon,
	TypescriptOriginalIcon,
	RustPlainIcon,
	ScalaOriginalIcon,
	NextjsOriginalIcon,
	TailwindcssPlainIcon,
	Css3OriginalIcon,
	Html5OriginalIcon,
	SassOriginalIcon,
	WebpackOriginalIcon,
	NodejsOriginalIcon,
	DjangoOriginalIcon,
	LuaOriginalIcon,
	FlaskOriginalIcon,
	DockerOriginalIcon,
	KubernetesPlainIcon,
	AmazonwebservicesOriginalIcon,
	SlackOriginalIcon,
	GitOriginalIcon,
	GithubOriginalIcon,
	JiraOriginalIcon,
} from "react-devicons";

const TimelinePage = function () {
	return (
		<div className="flex justify-center items-center mb-32">
			<VerticalTimeline>
				<VerticalTimelineElement
					className="vertical-timeline-element--work "
					contentStyle={{
						background: "#3FA4D1",
						color: "#fff",
					}}
					contentArrowStyle={{
						borderRight: "10px solid  #3FA4D1",
					}}
					date="X.2015 - II.2019"
					iconStyle={{ background: "#3FA4D1", color: "#EBCACA" }}
					icon={<SchoolIcon />}
				>
					<h1>Lodz University of Technology</h1>
					<h2>Biotechnology engineerirng I graduate</h2>
					<h3>
						Graduated with engineer diploma with specialization in
						technical biochemistry.
					</h3>
					<div className="flex-row  rounded-full justify-evenly my-4 items-center">
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<PythonOriginalIcon size="3em"></PythonOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<PandasOriginalIcon size="3em"></PandasOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<BashOriginalIcon size="3em"></BashOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<LinuxOriginalIcon size="3em"></LinuxOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<NumpyOriginalIcon size="3em"></NumpyOriginalIcon>
						</div>
					</div>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work "
					contentStyle={{
						background: "#3FA4D1",
						color: "#fff",
					}}
					contentArrowStyle={{
						borderRight: "10px solid  #3FA4D1",
					}}
					date="X.2017 – XII.2018"
					iconStyle={{ background: "#3FA4D1", color: "#EBCACA" }}
					icon={<SchoolIcon />}
				>
					<h1>Senate of the Lodz University of Technology</h1>
					<h2>
						Faculty of biotechnology council member, university
						senate member
					</h2>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work "
					contentStyle={{
						background: "#B3506E",
						color: "#fff",
					}}
					contentArrowStyle={{
						borderRight: "10px solid  #B3506E",
					}}
					date="VII.2018 - VIII.2018"
					iconStyle={{ background: "#B3506E", color: "#EBCACA" }}
					icon={<WorkOutlineIcon />}
				>
					<h1>Intercollegiate Faculty of Biotechnology UG&MUG</h1>
					<h2>Trainee in Laboratory of Protein Biochemistry</h2>
					<h3>
						Extraction of recombinant{" "}
						<span className="italic">E.coli</span> proteins.
					</h3>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work "
					contentStyle={{
						background: "#B3506E",
						color: "#fff",
					}}
					contentArrowStyle={{
						borderRight: "10px solid  #B3506E",
					}}
					date="X.2018 – XII.2018"
					iconStyle={{ background: "#B3506E", color: "#EBCACA" }}
					icon={<WorkOutlineIcon />}
				>
					<h1>
						Aflofarm Poland drug manufacturing plant in Ksawerów
					</h1>
					<h2>Junior Laboratory Analyst</h2>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work "
					contentStyle={{
						background: "#B3506E",
						color: "#fff",
					}}
					contentArrowStyle={{
						borderRight: "10px solid  #B3506E",
					}}
					date="V.2019 – IX.2021"
					iconStyle={{ background: "#B3506E", color: "#EBCACA" }}
					icon={<WorkOutlineIcon />}
				>
					<h1>{"Children's Health Memorial Institute in Warsaw"}</h1>
					<h2>Junior Assistant Biotechnologist / Bioinformatician</h2>
					<h3>
						NGS target panel data analytics & processing, rare
						disease genetics
					</h3>
					<div className="flex-row  rounded-full justify-start my-4 items-center">
						<div className="inline-block  m-2 bg-test2 rounded-full p-3">
							<PythonOriginalIcon size="3em"></PythonOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<LinuxOriginalIcon size="3em"></LinuxOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<VscodeOriginalIcon size="3em"></VscodeOriginalIcon>
						</div>
					</div>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work "
					contentStyle={{
						background: "#3FA4D1",
						color: "#fff",
					}}
					contentArrowStyle={{
						borderRight: "10px solid  #3FA4D1",
					}}
					date="X.2019 – III.2020"
					iconStyle={{ background: "#3FA4D1", color: "#EBCACA" }}
					icon={<SchoolIcon />}
				>
					<h1>
						{
							"Interdisciplinary Centre for Mathematical and Computational Modelling at University of Warsaw"
						}
					</h1>
					<h2>Omics Data Science course postgraduate</h2>
					<h3>
						Bioinformatics and analysis of high throughput
						biomedical data
					</h3>
					<div className="flex flex-row rounded-full justify-start my-4 flex-wrap">
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<PythonOriginalIcon size="3em"></PythonOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<LinuxOriginalIcon size="3em"></LinuxOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<BashOriginalIcon size="3em"></BashOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<COriginalIcon size="3em"></COriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<ROriginalIcon size="3em"></ROriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={PysparkIcon}
									className="icon"
									alt={"pyspark icon"}
								></Image>
							</div>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={LustreIcon}
									className="icon"
									alt={"lustre icon"}
								></Image>
							</div>
						</div>
					</div>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work "
					contentStyle={{
						background: "#B3506E",
						color: "#fff",
					}}
					contentArrowStyle={{
						borderRight: "10px solid  #B3506E",
					}}
					date="VI.2020 - VIII.2020"
					iconStyle={{ background: "#B3506E", color: "#EBCACA" }}
					icon={<WorkOutlineIcon />}
				>
					<h1>
						{
							"Interdisciplinary Centre for Mathematical and Computational Modelling at University of Warsaw"
						}
					</h1>
					<h2>HEAP Metagenomics Pipelines</h2>
					<h3>
						Metagenomics pipelines evaluation on HPC cluster
						(Okeanos) at ICM UW - trainee project
					</h3>
					<div className="flex flex-row rounded-full justify-start my-4 flex-wrap">
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<LinuxOriginalIcon size="3em"></LinuxOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<BashOriginalIcon size="3em"></BashOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={KronaIcon}
									className="icon"
									alt={"krona icon"}
								></Image>
							</div>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={LustreIcon}
									className="icon"
									alt={"lustre icon"}
								></Image>
							</div>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={SpadesIcon}
									className="icon"
									alt={"spades icon"}
								></Image>
							</div>
						</div>
					</div>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work "
					contentStyle={{
						background: "#B3506E",
						color: "#fff",
					}}
					contentArrowStyle={{
						borderRight: "10px solid  #B3506E",
					}}
					date="XI.2021 – II.2023"
					iconStyle={{ background: "#B3506E", color: "#EBCACA" }}
					icon={<WorkOutlineIcon />}
				>
					<h1>{"MNM diagnostics"}</h1>
					<h2>Junior software developer (XI.2021 - VI.2022)</h2>
					<h2>Software developer (VII.2022 - II.2023)</h2>

					<h3>
						Working with Whole genome sequencing, cancer tumor
						descriptors, rna-seq, bioinformatics tools development
						documentation, automatic testing and pipeline executions
						on AWS cloud infrastructure with gitOps strategy.
					</h3>
					<div className="flex flex-row rounded-full justify-start my-4 flex-wrap">
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<PythonOriginalIcon size="3em"></PythonOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<PandasOriginalIcon size="3em"></PandasOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<LinuxOriginalIcon size="3em"></LinuxOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<DockerOriginalIcon size="3em"></DockerOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<KubernetesPlainIcon size="3em"></KubernetesPlainIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<GitOriginalIcon size="3em"></GitOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<GithubOriginalIcon size="3em"></GithubOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<FlaskOriginalIcon size="3em"></FlaskOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<AmazonwebservicesOriginalIcon size="3em"></AmazonwebservicesOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<SlackOriginalIcon size="3em"></SlackOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<JiraOriginalIcon size="3em"></JiraOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<BashOriginalIcon size="3em"></BashOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<ROriginalIcon size="3em"></ROriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={PysparkIcon}
									className="icon"
									alt={"pyspark icon"}
								></Image>
							</div>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={PytestIcon}
									className="icon"
									alt={"pytest icon"}
								></Image>
							</div>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={NextflowIcon}
									className="icon"
									alt={"nextflow icon"}
								></Image>
							</div>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={DeltalakeIcon}
									className="icon"
									alt={"deltalake icon"}
								></Image>
							</div>
						</div>{" "}
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={HailIcon}
									className="icon"
									alt={"hail icon"}
								></Image>
							</div>
						</div>{" "}
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={S3Icon}
									className="icon"
									alt={"s3 icon"}
								></Image>
							</div>
						</div>{" "}
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={NeovimIcon}
									className="icon"
									alt={"neovim icon"}
								></Image>
							</div>
						</div>{" "}
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={JupyterIcon}
									className="icon"
									alt={"jupyter icon"}
								></Image>
							</div>
						</div>
					</div>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work "
					contentStyle={{
						background: "#3FA4D1",
						color: "#fff",
					}}
					contentArrowStyle={{
						borderRight: "10px solid  #3FA4D1",
					}}
					date="2021 - onwards"
					iconStyle={{ background: "#3FA4D1", color: "#EBCACA" }}
					icon={<SchoolIcon />}
				>
					<h1>{"Self development"}</h1>
					<h2>Constantly growing and learning new stuff</h2>

					<div className="flex flex-wrap flex-row  rounded-full justify-start my-4">
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<Css3OriginalIcon size="3em"></Css3OriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<Html5OriginalIcon size="3em"></Html5OriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<JavascriptOriginalIcon size="3em"></JavascriptOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<ReactOriginalIcon size="3em"></ReactOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<NextjsOriginalIcon size="3em"></NextjsOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<TailwindcssPlainIcon size="3em"></TailwindcssPlainIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<SassOriginalIcon size="3em"></SassOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<WebpackOriginalIcon size="3em"></WebpackOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<NodejsOriginalIcon size="3em"></NodejsOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<DjangoOriginalIcon size="3em"></DjangoOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<TypescriptOriginalIcon size="3em"></TypescriptOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<RustPlainIcon size="3em"></RustPlainIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<ScalaOriginalIcon size="3em"></ScalaOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<LuaOriginalIcon size="3em"></LuaOriginalIcon>
						</div>
						<div className="inline-block  border-2 m-2 bg-test2 rounded-full p-3">
							<div className="icon-container flex items-center align-center">
								<Image
									src={FastapiIcon}
									className="icon"
									alt={"fastapi icon"}
								></Image>
							</div>
						</div>
					</div>
				</VerticalTimelineElement>
			</VerticalTimeline>
		</div>
	);
};

export default TimelinePage;
