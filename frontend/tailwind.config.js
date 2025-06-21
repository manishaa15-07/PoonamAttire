/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#DA6220',
                    hover: '#C5571D',
                },
                secondary: {
                    DEFAULT: '#000000',
                    hover: '#333333',
                },
            },
        },
    },
    plugins: [],
};