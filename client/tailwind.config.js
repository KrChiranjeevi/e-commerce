/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4f46e5', // Indigo 600
                    light: '#818cf8',   // Indigo 400
                    dark: '#3730a3',    // Indigo 800
                },
                secondary: '#ec4899', // Pink 500
                surface: '#ffffff',
                background: '#f3f4f6', // Gray 100
            }
        },
    },
    plugins: [],
}
