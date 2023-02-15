import Logo from "../logo/logo";
import Link from "next/link";
import TextWrapper from "../text-components/text-wrapper";
const pages = ["About Me", "Projects", "Timeline", "Blog"];

const MainHeader = function () {
	return (
		<header className={""}>
			<nav className="relative container mx-auto p-6 bg-background bg-opacity-50">
				<div className="flex items-center justify-between">
					<div className="">
						<Logo className={"text-xl xl:text-3xl"}></Logo>
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
				</div>
			</nav>
		</header>
	);
};

export default MainHeader;
