import SelfImage from "../public/self.png";
import Image from "next/image";

const AboutPage = () => {
	return (
		<div className="flex flex-col lg:flex-row contents-center items-center my-32 lg:my-0  bg-opacity-40 bg-background">
			<div className="container">
				<Image src={SelfImage} alt="Szymon Szyszkowski"></Image>
			</div>
			<div className="container p-5 lg:mb-32">
				<h1 className="text-font font-bold text-4xl">Who Am I ?</h1>
				<p>
					Let me tell You a short story about a kid who always wanted to be a
					<span className="text-magenta"> scientist</span>.
				</p>
				<p>
					From my childhood, I was
					<span className="text-lightblue"> curious </span>about how the world
					works.
				</p>
				<br />
				<p className="italic">
					How the molecules of water bind together, yet are separate ? <br />
					Can we travel to the stars ? <br /> What is living on the skin of
					mouldy banana ? <br /> How come we are different, yet same species ?
				</p>
				<br />
				<p>
					As I grew up I have decided to set up myself with technical knowledge
					and acquired the higher education with an{" "}
					<span className="text-magenta">
						engineering degree in a field of biotechnology
					</span>
					specializing in{" "}
					<span className="text-lightblue">molecular biology</span> at Lodz
					University of Technology in Poland.
				</p>
				<p>
					By the last year of studies I have discovered the concept of{" "}
					<span className="text-lightblue">DNA sequencing</span> , which let me
					through my carrier as a{" "}
					<span className="text-lightblue">genome analyst</span> with
					bioinformatics aspirations in Children’s Health Memorial Institute.
				</p>
				<p>
					Afterwards I have finished my post-studies in the field of
					<span className="text-magenta"> omics data science</span> at the
					Interdisciplinary Centre for Mathematical and Computer Modelling in
					Warsaw.
				</p>
				<p>
					To fulfill my dreams, I needed to become a full time{" "}
					<span className="text-magenta">engineer</span>, so I have decided to
					increase my coding skills as these was crucial in vast field of omics
					data.
				</p>
				<p>
					That wa a hit, writing software was the very thing I wanted to do in
					the first place. This led me to a{" "}
					<span className="text-magenta">software developer</span> position at
					MNM diagnostics - a company where our mission is to help people with
					cancer.
				</p>
				<p>
					Soon after that I have started my company{" "}
					<span className="font-bold">Project Defiant</span>, where I connect
					software development with life science background
				</p>
				<p>
					For me it is very easy to say - “Do what You love to love what You
					do”, as I know now that I always wanted to be not only a{" "}
					<span className="text-lightblue">scientist</span> or{" "}
					<span className="text-magenta">engineer</span> but also an inventor.
				</p>
				<br />
				<p>Like Rosalind Franklin, and Bjarne Stroustrup together.</p>
				<br />
				<br />
				<p>
					Personally I a m a huge fun of SF - Star Trek, Stargate & Doctor WHO
				</p>
				<p className="font-bold">What describes me ?</p>
				<br />
				<p>
					I Never stop growing <br /> I love to discover new things <br />
					discipline makes me free <br />I think fast and my thoughts confirm
					the chaos theory
				</p>
			</div>
		</div>
	);
};

export default AboutPage;
