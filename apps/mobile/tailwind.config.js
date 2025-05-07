/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern:
        /(bg|border)-(red|blue|green|yellow|indigo|purple|pink|stone|gray|orange|lime|teal|cyan|sky|rose|emerald|violet|slate|zinc|neutral|sky|amber|fuchsia)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  plugins: [],
};
