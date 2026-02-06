"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useHyperspace, WarpPhase } from "../../context/hyperspace-context";

interface StarData {
	id: number;
	x: number;
	y: number;
	z: number;
	radius: number;
	baseOpacity: number;
	angleDeg: number;
	distFromCenter: number;
}

interface StarComponentProps {
	star: StarData;
	mouseX: number;
	mouseY: number;
	isWarping: boolean;
	warpPhase: WarpPhase;
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

		// Precompute angle from star to center (50%, 50%)
		const dx = x - 50;
		const dy = y - 50;
		const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
		const distFromCenter = Math.sqrt(dx * dx + dy * dy);

		return { id: i, x, y, z, radius, baseOpacity, angleDeg, distFromCenter };
	});
}

const stars = generateStars(500);

function getPhaseMultiplier(phase: WarpPhase): number {
	switch (phase) {
		case "accelerating": return 0.5;
		case "peak": return 1.0;
		case "flash": return 1.0;
		case "decelerating": return 0.3;
		default: return 0;
	}
}

function getWarpColor(phase: WarpPhase): string {
	switch (phase) {
		case "accelerating": return "#9ee0ff";
		case "peak": return "#ffffff";
		case "flash": return "#ffffff";
		case "decelerating": return "#9ee0ff";
		default: return "#EBCACA";
	}
}

const StarComponent = memo(function StarComponent({ star, mouseX, mouseY, isWarping, warpPhase }: StarComponentProps) {
	if (isWarping) {
		const phaseMultiplier = getPhaseMultiplier(warpPhase);
		const depthFactor = (star.z / 100) * 0.7 + 0.3;

		// Distance factor with cubic ramp — stars near center stay as dots,
		// elongation kicks in strongly past ~30% distance from center
		const normalizedDist = Math.min(star.distFromCenter / 55, 1);
		const distFactor = normalizedDist * normalizedDist * normalizedDist;

		// Line length: center stars stay dot-sized, edge stars get long streaks
		const lineLength = star.radius + 150 * phaseMultiplier * depthFactor * distFactor;
		const lineWidth = Math.max(star.radius * 0.35, 1);

		// Shape: center stars keep round, edge stars become thin lines
		const borderRadiusVal = distFactor < 0.1
			? star.radius / 2
			: lineWidth / 2;

		// Push stars outward from center during warp
		const pushPx = phaseMultiplier * depthFactor * distFactor * 120;

		const warpColor = getWarpColor(warpPhase);
		const glowIntensity = phaseMultiplier;
		const boxShadow = `0 0 ${8 * glowIntensity}px ${3 * glowIntensity}px rgba(158, 224, 255, ${glowIntensity * 0.5})`;

		// During flash phase, stars vanish
		const starOpacity = warpPhase === "flash"
			? 0
			: Math.min(star.baseOpacity + 0.5 * phaseMultiplier, 1);

		return (
			<div
				className="absolute"
				style={{
					right: `${star.x}%`,
					top: `${star.y}%`,
					width: lineLength,
					height: distFactor < 0.1 ? star.radius : lineWidth,
					borderRadius: borderRadiusVal,
					backgroundColor: warpColor,
					opacity: starOpacity,
					// Rotate to point away from center, push outward along that angle
					transform: `rotate(${star.angleDeg}deg) translateX(${pushPx}px)`,
					transformOrigin: "center center",
					boxShadow: boxShadow,
					transition: "width 0.35s cubic-bezier(0.22, 1, 0.36, 1), height 0.15s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s ease, opacity 0.15s ease, box-shadow 0.3s ease, border-radius 0.15s ease",
					willChange: "width, transform, opacity",
				}}
			/>
		);
	}

	// Normal rendering — no CSS transition so parallax stays instant
	const dx = star.x - mouseX;
	const dy = star.y - mouseY;
	const distance = Math.sqrt(dx * dx + dy * dy);

	const parallaxStrength = star.z / 100;
	const offsetX = (mouseX - 50) * parallaxStrength * 0.3;
	const offsetY = (mouseY - 50) * parallaxStrength * 0.3;

	const glowRadius = 20;
	const glowIntensity = distance < glowRadius ? 1 - (distance / glowRadius) : 0;

	const glowBoost = glowIntensity * 0.8;
	const finalOpacity = Math.min(star.baseOpacity + glowBoost, 1);

	const sizeMultiplier = 1 + glowIntensity * 0.8;
	const finalRadius = star.radius * sizeMultiplier;

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
	const { isWarping, warpPhase } = useHyperspace();

	const updateMousePosition = useCallback(() => {
		currentPos.current = {
			x: currentPos.current.x + (targetPos.current.x - currentPos.current.x) * 0.08,
			y: currentPos.current.y + (targetPos.current.y - currentPos.current.y) * 0.08,
		};

		setMousePos({ ...currentPos.current });
		rafRef.current = requestAnimationFrame(updateMousePosition);
	}, []);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			targetPos.current = {
				x: (e.clientX / window.innerWidth) * 100,
				y: (e.clientY / window.innerHeight) * 100,
			};
		};

		document.addEventListener("mousemove", handleMouseMove);
		rafRef.current = requestAnimationFrame(updateMousePosition);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [updateMousePosition]);

	// Freeze mouse during warp so parallax doesn't fight the effect
	const effectiveMouseX = isWarping ? 50 : mousePos.x;
	const effectiveMouseY = isWarping ? 50 : mousePos.y;

	return (
		<div className="fixed inset-0 w-screen h-screen bg-background -z-50 overflow-hidden">
			{stars.map((star) => (
				<StarComponent
					key={`star${star.id}`}
					star={star}
					mouseX={effectiveMouseX}
					mouseY={effectiveMouseY}
					isWarping={isWarping}
					warpPhase={warpPhase}
				/>
			))}
		</div>
	);
};

export default BackgroundContainer;
