import Image from "next/image";
import Link from "next/link";
import GithubIcon from "../../public/github.svg";
import LinkedInIcon from "../../public/linkedin.svg";
import YouTubeIcon from "../../public/you-tube.svg";
import MediumIcon from "../../public/medium.svg";

class Icon {
	image: unknown;
	alt: string;
	href: string;
	constructor(image, alt: string, href: string) {
		this.image = image;
		this.alt = alt;
		this.href = href;
	}
}

const icons = [
	{
		image: GithubIcon,
		alt: "github link",
		href: "https://github.com/PROJECT-DEFIANT",
	},
	{
		image: LinkedInIcon,
		alt: "linkedin link",
		href: "https://www.linkedin.com/in/szymon-szyszkowski-bb3762182/",
	},

	{ image: YouTubeIcon, alt: "You tube link", href: "#" },
	{
		image: MediumIcon,
		alt: "Medium link",
		href: "https://medium.com/@szymonszyszkowski",
	},
];

const FooterComponent = function () {
	return (
		<footer className={"fixed bottom-0 bg-test2 font-black w-full"}>
			<div className={"flex justify-around items-center p-4"}>
				<section className={"hidden sm:block"}>
					<span className={"text-xl"}>Szymon Szyszkowski</span>
				</section>
				<section
					className={"flex flex-row gap-6 justify-center contents-center"}
				>
					{icons.map((icon, idx) => {
						return (
							<Link href={icon.href} key={`${icon}-${idx}`}>
								<Image alt={icon.alt} src={icon.image}></Image>
							</Link>
						);
					})}
				</section>
			</div>
		</footer>
	);
};

export default FooterComponent;
