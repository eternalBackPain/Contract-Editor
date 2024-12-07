/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#000000", // Set default text color to black
            fontFamily: "Arial, sans-serif", // Set default font to Arial
            margin: 0, // Reset default margin
            padding: 0, // Reset default padding
            maxWidth: "none", // Remove max-width restrictions
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
