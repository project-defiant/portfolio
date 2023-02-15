import { Fragment, ReactNode } from "react";
import MainHeader from "./main-header";
import BackgroundContainer from "./background";
import { Alef } from "@next/font/google";
import FooterComponent from "../footer/footer";
interface LayoutProps {
	children?: ReactNode | undefined;
	className?: string;
}

const Layout = function (props: LayoutProps) {
	return (
		<Fragment>
			<div className="relative container overflow-hidden max-w-full min-h-screen">
				<BackgroundContainer></BackgroundContainer>
				<div className={props.className}>
					<MainHeader></MainHeader>
					<main className={""}>{props.children}</main>
				</div>
				<FooterComponent></FooterComponent>
			</div>
		</Fragment>
	);
};

export default Layout;
