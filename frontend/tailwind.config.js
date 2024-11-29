/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                nuni: ['Nunito', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
