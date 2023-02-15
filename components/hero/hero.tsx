import Logo from "../logo/logo";
import SpaceShip from "../../public/spaceship-xl.svg";
import Image from "next/image";

const HeroSection = function () {
	return (
		<section className="relative">
			<Image
				alt="Project defiant logo"
				src={SpaceShip}
				style={{
					width: "70rem",
					height: "auto",
				}}
			></Image>
			<Logo className={"absolute top-1/2 left-1/2 text-6xl md:xl"}></Logo>
		</section>
	);
};

export default HeroSection;
