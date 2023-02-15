import { Fragment } from "react";
import Link from "next/link";
import TextWrapper from "../text-components/text-wrapper";

interface LogoProps {
	className?: string;
}

const Logo = function (props: LogoProps) {
	return (
		<Fragment>
			<Link href="/" className={props.className}>
				<TextWrapper>
					<span className={"text-font"}>{"project"}</span>
					<span className={"text-lightblue"}>{"::"}</span>
					<span className={"text-font"}>{"defiant"}</span>
				</TextWrapper>
			</Link>
		</Fragment>
	);
};

export default Logo;
