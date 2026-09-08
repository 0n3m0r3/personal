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
        sans: ["var(--font-mulish)", "Mulish", "sans-serif"],
        serif: ["var(--font-fraunces)", "Fraunces", "serif"],
      },
      colors: {
        primary: "#242F65",
        "primary-dark": "#1B2763",
        ink: "#2A2C32",
        muted: "#525665",
        orange: "#FF774C",
        cream: "#FFFAFA",
        "soft-border": "#CED2E5",
        "skill-icon": "#D7F2FF",
        "tag-green": "#4E8E70",
        "tag-green-bg": "#C3EAD7",
        "tag-cyan": "#62989C",
        "tag-cyan-bg": "#C3E7EA",
        lime: "#DEFF99",
        blush: "#FFE3E3",
      },
      maxWidth: {
        page: "1400px",
      },
      borderRadius: {
        panel: "30px",
        card: "20px",
        btn: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
