"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";

interface StarData {
	id: number;
	x: number;
	y: number;
	z: number;
	radius: number;
	baseOpacity: number;
}

interface StarComponentProps {
	star: StarData;
	mouseX: number;
	mouseY: number;
}

// Seeded random for consistent star positions
function seededRandom(seed: number) {
	return function () {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
}

// Generate stars with deterministic positions
function generateStars(count: number): StarData[] {
	const random = seededRandom(42);
	return Array.from({ length: count }, (_, i) => {
		const x = Number((random() * 100).toFixed(2));
		const y = Number((random() * 100).toFixed(2));
		const z = Number((random() * 100).toFixed(2));
		const radius = Number((random() * 5 + 1).toFixed(2));
		const size = Math.PI * Math.pow(radius, 2);
		const baseOpacity = Math.min((z * size) / 8000, 0.9);
		return { id: i, x, y, z, radius, baseOpacity };
	});
}

const stars = generateStars(500);

const StarComponent = memo(function StarComponent({ star, mouseX, mouseY }: StarComponentProps) {
	// Calculate distance from mouse (in percentage units)
	const dx = star.x - mouseX;
	const dy = star.y - mouseY;
	const distance = Math.sqrt(dx * dx + dy * dy);

	// Parallax effect - stars move based on mouse position and their z-depth
	const parallaxStrength = star.z / 100;
	const offsetX = (mouseX - 50) * parallaxStrength * 0.3;
	const offsetY = (mouseY - 50) * parallaxStrength * 0.3;

	// Glow effect - stars within 20% of cursor glow brighter
	const glowRadius = 20;
	const glowIntensity = distance < glowRadius ? 1 - (distance / glowRadius) : 0;

	// Calculate final opacity (base + glow boost)
	const glowBoost = glowIntensity * 0.8;
	const finalOpacity = Math.min(star.baseOpacity + glowBoost, 1);

	// Calculate glow size increase
	const sizeMultiplier = 1 + glowIntensity * 0.8;
	const finalRadius = star.radius * sizeMultiplier;

	// Box shadow for glow effect
	const boxShadow = glowIntensity > 0.1
		? `0 0 ${8 * glowIntensity}px ${4 * glowIntensity}px rgba(70, 185, 235, ${glowIntensity * 0.7})`
		: "none";

	return (
		<div
			className="rounded-full absolute"
			style={{
				right: `${star.x + offsetX}%`,
				top: `${star.y + offsetY}%`,
				opacity: finalOpacity,
				width: finalRadius,
				height: finalRadius,
				backgroundColor: glowIntensity > 0.1 ? "#9ee0ff" : "#EBCACA",
				boxShadow: boxShadow,
				willChange: "transform, opacity",
			}}
		/>
	);
});

const BackgroundContainer = function () {
	const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
	const rafRef = useRef<number | null>(null);
	const targetPos = useRef({ x: 50, y: 50 });
	const currentPos = useRef({ x: 50, y: 50 });

	const updateMousePosition = useCallback(() => {
		// Smooth interpolation towards target position
		currentPos.current = {
			x: currentPos.current.x + (targetPos.current.x - currentPos.current.x) * 0.08,
			y: currentPos.current.y + (targetPos.current.y - currentPos.current.y) * 0.08,
		};

		setMousePos({ ...currentPos.current });
		rafRef.current = requestAnimationFrame(updateMousePosition);
	}, []);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			// Convert to percentage of viewport
			targetPos.current = {
				x: (e.clientX / window.innerWidth) * 100,
				y: (e.clientY / window.innerHeight) * 100,
			};
		};

		document.addEventListener("mousemove", handleMouseMove);

		// Start animation loop
		rafRef.current = requestAnimationFrame(updateMousePosition);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [updateMousePosition]);

	return (
		<div className="fixed inset-0 w-screen h-screen bg-background -z-50 overflow-hidden">
			{stars.map((star) => (
				<StarComponent
					key={`star${star.id}`}
					star={star}
					mouseX={mousePos.x}
					mouseY={mousePos.y}
				/>
			))}
		</div>
	);
};

export default BackgroundContainer;
