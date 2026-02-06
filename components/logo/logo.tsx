import { Fragment } from "react";
import HyperspaceLink from "../hyperspace/hyperspace-link";
import TextWrapper from "../text-components/text-wrapper";

interface LogoProps {
	className?: string;
}

const Logo = function (props: LogoProps) {
	return (
		<Fragment>
			<HyperspaceLink href="/" className={props.className}>
				<TextWrapper>
					<span className={"text-font"}>{"project"}</span>
					<span className={"text-lightblue"}>{"::"}</span>
					<span className={"text-font"}>{"defiant"}</span>
				</TextWrapper>
			</HyperspaceLink>
		</Fragment>
	);
};

export default Logo;
