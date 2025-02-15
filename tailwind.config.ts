import type { Config } from "tailwindcss/types";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-mulish)", "Inter", "sans-serif"],
      },
    },
    colors: {
      primary: "#242F65",
      "primary-dark": "#1B2763",
      red: "#FF0000",
      white: "#FFFFFF",
    },
  },
  plugins: [],
};
export default config;
