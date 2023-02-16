import Logo from "../logo/logo";
import Link from "next/link";
import { useState } from "react";
import TextWrapper from "../text-components/text-wrapper";
const pages = ["About Me", "Projects", "Timeline", "Blog"];

const MainHeader = function () {
	const [hamburgerIconState, setHamburgerIconState] = useState("");

	return (
		<header className={""}>
			<nav className="relative container mx-auto p-6 bg-background bg-opacity-50">
				<div className="flex items-center justify-between">
					<div className="">
						<Logo className={"text-xl xl:text-3xl font-bold"}></Logo>
					</div>
					<div className="hidden md:flex space-x-10">
						{pages.map((page, idx) => (
							<Link
								href={`/${page.toLowerCase().replace(/ /g, "")}`}
								key={idx + page}
							>
								<TextWrapper>
									<span className={"text-font hover:text-fontHover"}>
										{page}
									</span>
								</TextWrapper>
							</Link>
						))}
					</div>
					<div className="md:hidden">
						<button
							id="menu-btn"
							type="button"
							onClick={() =>
								setHamburgerIconState(hamburgerIconState ? "" : "open")
							}
							className={
								"z-50 block hamburger md:hidden focus:outline-none " +
								hamburgerIconState
							}
						>
							<span className="hamburger-top bg-font"></span>
							<span className="hamburger-middle bg-font"></span>
							<span className="hamburger-bottom bg-font"></span>
						</button>
					</div>
				</div>
			</nav>
			<div
				id="menu"
				className={
					"absolute top-0 bottom-0 left-0 flex flex-col self-end w-full min-h-screen py-1 pt-40 pl-12 space-y-3 text-lg md:hidden text-font uppercase bg-background z-30 menu " +
					hamburgerIconState
				}
			>
				{pages.map((page, idx) => (
					<Link
						href={`/${page.toLowerCase().replace(/ /g, "")}`}
						key={idx + page}
					>
						<TextWrapper>
							<span className={"text-font hover:text-fontHover"}>{page}</span>
						</TextWrapper>
					</Link>
				))}
			</div>
		</header>
	);
};

export default MainHeader;
