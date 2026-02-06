import { AppProps } from "next/app";
import "../styles/globals.css";
import { Alef } from "@next/font/google";
import Layout from "../components/layout/layout";
import { HyperspaceProvider, useHyperspace } from "../context/hyperspace-context";
import { AnimatePresence, motion } from "framer-motion";

// font initializations
const alef = Alef({ weight: ["400", "700"], subsets: ["latin"] });

function PageContent({ Component, pageProps, routeKey }: { Component: AppProps["Component"]; pageProps: any; routeKey: string }) {
	const { direction } = useHyperspace();

	// Simple fade-in only — no exit animation, the star warp covers the transition
	return (
		<AnimatePresence mode="popLayout" initial={false}>
			<motion.div
				key={routeKey}
				initial={{ opacity: direction ? 0 : 1 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
				style={{ minHeight: "50vh" }}
			>
				<Component {...pageProps} />
			</motion.div>
		</AnimatePresence>
	);
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps, router }: AppProps) {
	return (
		<HyperspaceProvider>
			<Layout className={alef.className}>
				<PageContent
					Component={Component}
					pageProps={pageProps}
					routeKey={router.asPath}
				/>
			</Layout>
		</HyperspaceProvider>
	);
}
