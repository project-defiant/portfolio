import { AppProps } from "next/app";
import "../styles/globals.css";
import { Alef } from "@next/font/google";
import Layout from "../components/layout/layout";

// font initializations
const alef = Alef({ weight: ["400", "700"], subsets: ["latin"] });

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Layout className={alef.className}>
			<Component {...pageProps} />
		</Layout>
	);
}
