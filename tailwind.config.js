/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "var(--font-rethink-sans)",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          DEFAULT: "#0189ff",
          dark: "#006fd1",
          light: "#e6f3ff",
        },
        ink: {
          DEFAULT: "#0b0c0f",
          muted: "#6b7280",
        },
      },
    },
  },
  plugins: [],
};
