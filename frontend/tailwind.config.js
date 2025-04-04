/** @type {import('tailwindcss').Config} */
const svgToDataUri = require('mini-svg-data-uri')
const {
    default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette')

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                nuni: ['Nunito', 'sans-serif'],
            },
            backgroundImage: {
                'custom-image': "url('/ipizgrada.jpg')",
            },
        },
    },
    plugins: [
        addVariablesForColors,
        function ({ matchUtilities, theme }: any) {
          matchUtilities(
            {
              "bg-dot-thick": (value: any) => ({
                backgroundImage: `url("${svgToDataUri(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
                )}")`,
              }),
            },
            { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
          );
        },
      ],
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(
      Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );
   
    addBase({
      ":root": newVars,
    });
  }
