import type { Config } from "tailwindcss";

const config = {
  // darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: "",
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
