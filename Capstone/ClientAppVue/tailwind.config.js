module.exports = {
    purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                backdrop: {
                    DEFAULT: "#525252",
                    light: "#858585",
                    dark: "#212529",
                },
                danger: {
                    DEFAULT: "#dc2626", // 600
                    light: "#f87171", // 400
                    dark: "#991b1b", // 800
                },
                secondary: {
                    DEFAULT: "#4b5563",
                    light: "#9ca3af",
                    dark: "#1f2937",
                },
                warning: {
                    DEFAULT: "#d97706",
                    light: "#fbbf24",
                    dark: "#92400e",
                },
                success: {
                    DEFAULT: "#059669",
                    light: "#34d399",
                    dark: "#065f46",
                },
            },
            fontFamily: {
                sans: ["Avenir", "Helvetica", "Arial", "sans-serif"],
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ["hover"],
        },
    },
    plugins: [],
};
