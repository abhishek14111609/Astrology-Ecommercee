/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                'auric-gold': '#c5a059',
                'auric-rose': '#2d0a1b',
                'auric-blush': '#fcf9f9',
                'auric-accent': '#e5d1b8',
                'auric-purple': {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                'auric-emerald': {
                    DEFAULT: '#10b981',
                    light: '#34d399',
                },
                'auric-amber': {
                    DEFAULT: '#f59e0b',
                    light: '#fbbf24',
                },
                'auric-crimson': {
                    DEFAULT: '#ef4444',
                    light: '#f87171',
                },
            },
        },
    },
    plugins: [],
}
