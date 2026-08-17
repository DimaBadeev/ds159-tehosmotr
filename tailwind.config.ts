import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef5fc",
          100: "#d6e7f7",
          200: "#b4d2ef",
          300: "#81b4e3",
          400: "#4a8fd2",
          500: "#2b71b8",
          600: "#1e5999",
          700: "#1b487c",
          800: "#1b3d67",
          900: "#0e2a4a",
          950: "#08182d",
        },
        accent: {
          400: "#f7c948",
          500: "#f0b429",
          600: "#d89b12",
        },
      },
      boxShadow: {
        card: "0 10px 40px -18px rgba(14, 42, 74, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
