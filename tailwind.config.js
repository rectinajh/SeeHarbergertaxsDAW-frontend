/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{tsx,jsx}"],
  theme: {
    extend: {
      dropShadow: {
        md: "0px 4px 32px rgba(0, 0, 0, 0.05)",
        lg: "0px 4px 108.6px rgba(0, 0, 0, 0.25)",
        xl: "0px 1px 6px rgba(1, 1, 1, 0.06), inset 0px -1px 0px #FFFFFF",
        "2xl": "0px -1px 20px rgba(1, 1, 1, 0.06), inset 0px 1px 0px #FFFFFF",
      },

      backgroundImage: {
        mh: "linear-gradient(180deg, rgba(252, 253, 252, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        toggleRight: {
          "0%, 100%": { transform: "translatex(0)", opacity: 1 },
          "50%": { transform: "translatex(-100px)", opacity: 0 },
          "51%": { transform: "translatex(100px)", opacity: 0 },
        },
        toggleLeft: {
          "0%, 100%": { transform: "translatex(0)", opacity: 1 },
          "50%": { transform: "translatex(100px)", opacity: 0 },
          "51%": { transform: "translatex(-100px)", opacity: 0 },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        toggleRight: "toggleRight 1s ease-in-out infinite",
        toggleLeft: "toggleLeft 1s ease-in-out infinite",
      },
    },
    colors: {
      white: "#fff",
      blue: "#1fb6ff",
      purple: "#726DF9",
      purple_sub: "#E7E6FF",
      pink: "#ff49db",
      orange: "#E66448",
      green: "#46C086",
      yellow: "#ffc82c",
      "gray-dark": "#273444",
      "gray-200": " #e5e7eb",
      gray: "#9392A4",
      black: "#333",
      "gray-light": "#E8E8EE",
      transparent: "transparent",
      "deep-black": "#000",
    },
    lineHeight: 1.5,
  },
  plugins: [],
};
