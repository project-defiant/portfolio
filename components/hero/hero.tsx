import Logo from "../logo/logo";
import SpaceShip from "../../public/spaceship-xxl.svg";
import Image from "next/image";
import Link from "next/link";

const HeroSection = function () {
	return (
		<section className="grid grid-rows-6 grid-cols-6 md:grid-rows-4 my-10">
			<div className="relative container col-start-1 col-span-5 row-span-3 row-start-1">
				<div className="relative">
					<Image
						priority={true}
						alt="Project defiant logo"
						src={SpaceShip}
						className={"md:relative xl:bottom-20"}
					></Image>
					<div className="absolute top-1/2 left-1/2">
						<Logo
							className={
								"text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-7xl font-bold"
							}
						></Logo>
						<h1 className="text-font text-sm sm:text-xl xl:text-3xl">
							<span>Where</span>
							<span className={"text-magenta"}> no man has </span>
							<span>code</span>
							<span className={"text-magenta"}> before...</span>
							<br />
						</h1>
					</div>
				</div>
			</div>
			<div className="container justify-self-center px-5 col-span-full row-start-4 row-span-full md:col-start-3 md:row-start-3 md:row-span-1 z-10">
				<div>
					<h2 className="text-font text-sm sm:text-xl xl:text-3xl">
						<span className={"text-font"}>I am passionate about </span>
						<span className={"text-lightblue"}>life science </span>
						<span className={"text-font"}>with </span>
						<span className={"text-magenta"}> programming </span>
						<span className={"text-font"}>skills</span>
					</h2>
				</div>
				<div>
					<div className={"container flex flex-col sm:flex-row"}>
						<div className={"container my-2 p-2"}>
							<h3 className={"text-font text-xl mb-6"}>Check my blog</h3>
							<Link
								href="/blog"
								className="p-3 px-6 pt-2 text-white bg-lightblueBox rounded-full baseline text-font hover:bg-lightblue"
							>
								Recent posts
							</Link>
						</div>
						<div className="container my-2 p-2">
							<h3 className={"text-font text-xl mb-6"}>Lets work together</h3>
							<a
								href="#"
								className="p-3 px-6 pt-2 text-white bg-magentaBox rounded-full baseline text-font hover:bg-magenta"
							>
								Contact me
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
