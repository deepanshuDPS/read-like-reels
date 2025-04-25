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
  theme: {
    extend: {
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        fadeInOut: 'fadeInOut 1.5s ease-in-out infinite',
      },
    },
  },
} satisfies Config;

export default config;
