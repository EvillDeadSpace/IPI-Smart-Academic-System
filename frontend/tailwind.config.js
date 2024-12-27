/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                nuni: ['Nunito', 'sans-serif'],
            },
            backgroundImage: {
                'custom-image':
                    "url('/frontend/public/Screenshot 2024-12-27 224233.png')",
            },
        },
    },
    plugins: [],
}
