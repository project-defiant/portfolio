/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		colors: {
			background: "#060213",
			lightblue: "#1DBDF0",
			lightblueBox: "#13799A",
			magenta: "#B3365B",
			magentaBox: "#B3365B",
			font: "#EBCACA",
			test: "#000",
			test2: "#fff",
			test3: "#ddd",
		},
		screens: {
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
		},
		extend: {},
	},
	plugins: [],
};
