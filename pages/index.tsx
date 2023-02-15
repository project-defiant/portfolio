import { Fragment } from "react";
import HeroSection from "../components/hero/hero";

function HomePage() {
	return (
		<Fragment>
			<div className="flex justify-center items-center">
				<HeroSection></HeroSection>
			</div>
		</Fragment>
	);
}

export default HomePage;
