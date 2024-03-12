/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography"),require("daisyui")],
	daisyui: {
		themes: [{cvCustomTheme:{
			"primary": "#00c18b",
			"secondary": "#00cdee",
			"accent": "#0e7490",
			"neutral": "#111827",
			"base-100": "#374151",
			"info": "#00ccff",
			"success": "#00c18b",
			"warning": "#f59e0b",		 
			"error": "#dc2626",
		}},"dark","emerald"], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
		darkTheme: "dark", // name of one of the included themes for dark mode
		logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
	  }
}
