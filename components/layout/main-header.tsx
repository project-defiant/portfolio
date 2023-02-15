import { useState } from "react";
import Logo from "../logo/logo";
import Link from "next/link";
import TextWrapper from "../text-components/text-wrapper";
const pages = ["About Me", "Projects", "Timeline", "Blog"];

const MainHeader = function () {
	return (
		<header className={"p-6 m-auto"}>
			<div className={"flex  items-center justify-between"}>
				<Logo className={"m-6 text-3xl"}></Logo>
				<nav className="flex justify-evenly m-6 grow">
					{pages.map((page, idx) => (
						<Link
							href={`/${page.toLowerCase().replace(/ /g, "")}`}
							key={idx + page}
						>
							<TextWrapper>
								<span className={"text-font"}>{page}</span>
							</TextWrapper>
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
};

export default MainHeader;
