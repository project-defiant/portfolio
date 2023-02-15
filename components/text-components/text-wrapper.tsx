import { ReactNode, Fragment } from "react";

interface TextWrapperProps {
	children?: ReactNode | undefined;
	className?: string;
}

const TextWrapper = function (props: TextWrapperProps) {
	return (
		<Fragment>
			<span className={"text-magenta"}>{"<"}</span>
			<span>{props.children}</span>
			<span className={"text-magenta"}>{">"}</span>
		</Fragment>
	);
};

export default TextWrapper;
