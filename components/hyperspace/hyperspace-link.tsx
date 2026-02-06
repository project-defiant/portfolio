"use client";

import { useRouter } from "next/router";
import { useHyperspace, resolvePageIndex } from "../../context/hyperspace-context";
import { ReactNode, MouseEvent } from "react";

interface HyperspaceLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

const HyperspaceLink = function ({ href, children, className, onClick }: HyperspaceLinkProps) {
	const router = useRouter();
	const { isWarping, initiateWarp } = useHyperspace();

	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		// Fire any extra handler (e.g. hamburger close)
		if (onClick) onClick();

		// Block during active warp
		if (isWarping) return;

		const currentIdx = resolvePageIndex(router.asPath);
		const targetIdx = resolvePageIndex(href);

		initiateWarp(href, currentIdx, targetIdx);
	};

	return (
		<a href={href} onClick={handleClick} className={className}>
			{children}
		</a>
	);
};

export default HyperspaceLink;
