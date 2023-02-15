import { Fragment, ReactNode } from "react";
import MainHeader from "./main-header";
import BackgroundContainer from "./background";

interface LayoutProps {
	children?: ReactNode | undefined;
	className?: string;
}

const Layout = function (props: LayoutProps) {
	return (
		<Fragment>
			<BackgroundContainer></BackgroundContainer>
			<MainHeader></MainHeader>
			<main className={"text-font"}>{props.children}</main>
		</Fragment>
	);
};

export default Layout;
