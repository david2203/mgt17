import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#faf8f4",
          100: "#f3eee4",
          200: "#e6dcc9",
          300: "#d4c3a3",
        },
        clay: {
          400: "#a98b6f",
          500: "#8f7259",
          600: "#735a45",
          700: "#574536",
        },
        forest: {
          500: "#5a7d6a",
          600: "#486655",
          700: "#3a5244",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
