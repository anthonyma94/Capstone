const colors = require("tailwindcss/colors");

module.exports = {
    // mode: "jit",
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            transformOrigin: {
                0: "0%",
            },
            zIndex: {
                "-1": "-1",
                "-2": "-2",
            },
        },
    },
    variants: {
        borderColor: ["responsive", "hover", "focus", "focus-within"],
        backgroundColor: ["disabled", "hover"],
        cursor: ["hover", "focus", "disabled"],
        opacity: ["disabled"],
        padding: ["disabled"],
        textOverflow: ["focus"],
        extend: {},
    },
    plugins: [],
};
