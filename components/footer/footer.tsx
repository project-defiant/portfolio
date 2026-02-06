"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import GithubIcon from "../../public/github.svg";
import LinkedInIcon from "../../public/linkedin.svg";
import YouTubeIcon from "../../public/you-tube.svg";
import MediumIcon from "../../public/medium.svg";

const socialLinks = [
	{
		image: GithubIcon,
		alt: "GitHub",
		href: "https://github.com/PROJECT-DEFIANT",
		hoverColor: "#6e5494",
	},
	{
		image: LinkedInIcon,
		alt: "LinkedIn",
		href: "https://www.linkedin.com/in/szymon-szyszkowski-bb3762182/",
		hoverColor: "#0077b5",
	},
	{
		image: YouTubeIcon,
		alt: "YouTube",
		href: "#",
		hoverColor: "#ff0000",
	},
	{
		image: MediumIcon,
		alt: "Medium",
		href: "https://medium.com/@szymonszyszkowski",
		hoverColor: "#00ab6c",
	},
];

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/aboutme" },
	{ label: "Blog", href: "/blog" },
	{ label: "Timeline", href: "/timeline" },
];

const SocialIcon = ({ icon, index }: { icon: typeof socialLinks[0]; index: number }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link
			href={icon.href}
			target={icon.href !== "#" ? "_blank" : undefined}
			rel={icon.href !== "#" ? "noopener noreferrer" : undefined}
			className="relative group"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className="p-2 rounded-full transition-all duration-300 ease-out"
				style={{
					backgroundColor: isHovered ? `${icon.hoverColor}20` : "transparent",
					transform: isHovered ? "scale(1.15) translateY(-2px)" : "scale(1)",
					boxShadow: isHovered ? `0 4px 12px ${icon.hoverColor}40` : "none",
				}}
			>
				<Image
					alt={icon.alt}
					src={icon.image}
					width={24}
					height={24}
					className="transition-all duration-300"
					style={{
						filter: isHovered
							? `brightness(0) saturate(100%) drop-shadow(0 0 8px ${icon.hoverColor})`
							: "invert(90%) sepia(10%) saturate(200%) hue-rotate(300deg)",
					}}
				/>
			</div>
			<span
				className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-font/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
			>
				{icon.alt}
			</span>
		</Link>
	);
};

const BackToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			setIsVisible(window.scrollY > 300);
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			onClick={scrollToTop}
			className={`absolute -top-12 right-6 p-3 rounded-full bg-background border border-font/20 text-font hover:border-lightblue hover:text-lightblue transition-all duration-300 ${
				isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
			}`}
			aria-label="Back to top"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M18 15l-6-6-6 6" />
			</svg>
		</button>
	);
};

const FooterComponent = function () {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="relative mt-auto bg-background/80 backdrop-blur-sm border-t border-font/10 z-50">
			{/* Gradient top border */}
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lightblue to-transparent" />
			<div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-lightblue via-magenta to-lightblue opacity-50" />

			<BackToTopButton />

			<div className="max-w-6xl mx-auto px-6 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					{/* Brand Section */}
					<div className="flex flex-col items-center md:items-start">
						<h3 className="text-font text-xl font-bold mb-2">Szymon Szyszkowski</h3>
						<p className="text-font/60 text-sm text-center md:text-left">
							Software Developer & Data Engineer
						</p>
					</div>

					{/* Navigation Links */}
					<div className="flex flex-col items-center">
						<h4 className="text-font/80 text-sm font-semibold mb-4 uppercase tracking-wider">
							Navigation
						</h4>
						<nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-font/60 hover:text-lightblue transition-colors duration-300 text-sm"
								>
									{link.label}
								</Link>
							))}
						</nav>
					</div>

					{/* Contact Section */}
					<div className="flex flex-col items-center md:items-end">
						<h4 className="text-font/80 text-sm font-semibold mb-4 uppercase tracking-wider">
							Get in Touch
						</h4>
						<a
							href="mailto:szymonszyszkowski@gmail.com"
							className="text-font/60 hover:text-lightblue transition-colors duration-300 text-sm flex items-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<rect width="20" height="16" x="2" y="4" rx="2" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
							</svg>
							szymonszyszkowski@gmail.com
						</a>
					</div>
				</div>

				{/* Divider */}
				<div className="h-px bg-gradient-to-r from-transparent via-font/20 to-transparent mb-6" />

				{/* Bottom Section */}
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					{/* Copyright */}
					<p className="text-font/50 text-sm order-2 md:order-1">
						&copy; {currentYear} Szymon Szyszkowski. All rights reserved.
					</p>

					{/* Social Icons */}
					<div className="flex gap-4 order-1 md:order-2 pb-2">
						{socialLinks.map((icon, idx) => (
							<SocialIcon key={`${icon.alt}-${idx}`} icon={icon} index={idx} />
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};

export default FooterComponent;
