module.exports = {
    purge: {
        content: [`./public/**/*.html`, `./src/**/*.{ts,vue}`],
        options: {
            defaultExtractor(content) {
                const contentWithoutStyleBlocks = content.replace(
                    /<style[^]+?<\/style>/gi,
                    ""
                );
                return (
                    contentWithoutStyleBlocks.match(
                        /[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g
                    ) || []
                );
            },
            safelist: [
                /-(leave|enter|appear)(|-(to|from|active))$/,
                /^(?!(|.*?:)cursor-move).+-move$/,
                /^router-link(|-exact)-active$/,
                /data-v-.*/,
                /^btn.*/,
                /backdrop$/,
                /danger$/,
                /secondary$/,
                /warning$/,
                /success$/,
                /primary$/
            ]
        }
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                danger: {
                    DEFAULT: "#dc2626", // 600
                    light: "#f87171", // 400
                    dark: "#991b1b" // 800
                },
                secondary: {
                    DEFAULT: "#4b5563",
                    light: "#9ca3af",
                    dark: "#1f2937"
                },
                warning: {
                    DEFAULT: "#d97706",
                    light: "#fbbf24",
                    dark: "#92400e"
                },
                success: {
                    DEFAULT: "#059669",
                    light: "#34d399",
                    dark: "#065f46"
                },
                primary: {
                    DEFAULT: "#2563eb",
                    light: "#60a5fa",
                    dark: "#1e40af"
                }
            },
            fontFamily: {
                sans: ["Avenir", "Helvetica", "Arial", "sans-serif"]
            },
            transformOrigin: {
                0: "0%"
            },
            zIndex: {
                "-1": "-1",
                "-2": "-2"
            },
            minHeight: {
                10: "2.5rem"
            }
        }
    },
    variants: {
        extend: {
            backgroundColor: ["disabled", "hover"],
            borderWidth: ["last"],
            borderColor: ["responsive", "hover", "focus", "focus-within"],
            cursor: ["disabled", "hover", "focus"],
            opacity: ["disabled"],
            padding: ["disabled"],
            textOverflow: ["focus"]
        }
    },
    plugins: []
};
