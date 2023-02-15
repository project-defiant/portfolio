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
			lightblueBox: "#3FA4D1",
			lightblue: "#46B9EB",
			magenta: "#B3365B",
			magentaBox: "#B3506E",
			font: "#EBCACA",
			fontHover: "#F6D5C7",
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
