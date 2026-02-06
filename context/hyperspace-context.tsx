"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { useRouter } from "next/router";

export type WarpPhase = "idle" | "accelerating" | "peak" | "flash" | "decelerating";

interface HyperspaceState {
	isWarping: boolean;
	warpPhase: WarpPhase;
	direction: "left" | "right" | null;
	initiateWarp: (targetPath: string, currentIdx: number, targetIdx: number) => void;
}

const HyperspaceContext = createContext<HyperspaceState>({
	isWarping: false,
	warpPhase: "idle",
	direction: null,
	initiateWarp: () => {},
});

export const NAV_PAGES = [
	{ title: "Home", endpoint: "/" },
	{ title: "About Me", endpoint: "/aboutme" },
	{ title: "Timeline", endpoint: "/timeline" },
	{ title: "Blog", endpoint: "/blog" },
];

export function resolvePageIndex(pathname: string): number {
	// Strip query strings and hashes for matching
	const clean = pathname.split("?")[0].split("#")[0];

	// Exact match first
	const exact = NAV_PAGES.findIndex((p) => p.endpoint === clean);
	if (exact !== -1) return exact;

	// Blog sub-routes resolve to Blog index
	if (clean.startsWith("/blog")) {
		return NAV_PAGES.findIndex((p) => p.endpoint === "/blog");
	}

	return -1;
}

export function HyperspaceProvider({ children }: { children: ReactNode }) {
	const router = useRouter();
	const [warpPhase, setWarpPhase] = useState<WarpPhase>("idle");
	const [direction, setDirection] = useState<"left" | "right" | null>(null);
	const warpingRef = useRef(false);
	const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

	const isWarping = warpPhase !== "idle";

	const clearTimers = useCallback(() => {
		timersRef.current.forEach(clearTimeout);
		timersRef.current = [];
	}, []);

	const initiateWarp = useCallback(
		(targetPath: string, currentIdx: number, targetIdx: number) => {
			// Guard: no-op if already warping
			if (warpingRef.current) return;

			// Guard: no-op if navigating to same page
			const currentClean = router.asPath.split("?")[0].split("#")[0];
			const targetClean = targetPath.split("?")[0].split("#")[0];
			if (currentClean === targetClean) return;

			warpingRef.current = true;

			// Compute direction from nav indices
			const dir = targetIdx > currentIdx ? "right" : "left";
			setDirection(currentIdx === targetIdx ? "left" : dir);

			// T=0ms: accelerating (stars start stretching)
			setWarpPhase("accelerating");

			const t1 = setTimeout(() => {
				// T=400ms: peak (full warp)
				setWarpPhase("peak");
			}, 400);

			const t2 = setTimeout(() => {
				// T=700ms: flash — stars vanish, navigate
				setWarpPhase("flash");
				router.push(targetPath).then(() => {
					// Go straight to idle — no deceleration (no reverse transition)
					setTimeout(() => {
						setWarpPhase("idle");
						setDirection(null);
						warpingRef.current = false;
						window.scrollTo(0, 0);
					}, 150);
				});
			}, 700);

			timersRef.current = [t1, t2];
		},
		[router, clearTimers]
	);

	return (
		<HyperspaceContext.Provider value={{ isWarping, warpPhase, direction, initiateWarp }}>
			{children}
		</HyperspaceContext.Provider>
	);
}

export function useHyperspace() {
	return useContext(HyperspaceContext);
}
