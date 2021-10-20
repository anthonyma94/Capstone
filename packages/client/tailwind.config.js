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
                },
                on: {
                    primary: {
                        DEFAULT: "#000000",
                        high: "#212121",
                        medium: "#666666",
                        low: "#9e9e9e"
                    },
                    secondary: {
                        DEFAULT: "#ffffff",
                        high: "#c2c2c2",
                        medium: "#767676",
                        low: "#434343"
                    }
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
                "-2": "-2",
                top: "9999"
            },
            minHeight: {
                10: "2.5rem"
            }
        }
    },
    variants: {
        extend: {
            backgroundColor: ["disabled", "even", "hover"],
            borderWidth: ["last"],
            borderColor: ["responsive", "hover", "focus", "focus-within"],
            cursor: ["disabled", "hover", "focus"],
            opacity: ["disabled"],
            padding: ["disabled"],
            textOverflow: ["focus"]
        }
    },
    plugins: [
        // Expose colors to CSS (--{color-name}-{intensity})
        function({ addBase, theme }) {
            function extractColorVars(colorObj, colorGroup = "") {
                const res = Object.keys(colorObj).reduce((vars, colorKey) => {
                    const value = colorObj[colorKey];
                    const key = colorKey === "DEFAULT" ? "" : `${colorKey}`;
                    const newVars =
                        typeof value === "string"
                            ? {
                                  [`--${colorGroup}${
                                      key ? `-${key}` : ""
                                  }`]: value
                              }
                            : extractColorVars(value, key);
                    return { ...vars, ...newVars };
                }, {});
                return res;
            }
            addBase({
                ":root": extractColorVars(theme("colors"))
            });
        },
        // Add min and max width/height
        // function ({addBase, theme}) {
        //     const widths = theme("width");

        // },
        // Add button classes
        function({ addComponents, theme }) {
            const buttonColorOpts = [
                "secondary",
                "success",
                "warning",
                "danger"
            ];
            const colors = theme("colors");
            const buttonColors = Object.keys(colors).reduce((acc, cur) => {
                if (buttonColorOpts.includes(cur)) {
                    // const color = theme(`colors.${cur}`);
                    const color = colors[cur];
                    if (Object.keys(color).includes("DEFAULT")) {
                        acc[cur] = color;
                    }
                }
                return acc;
            }, {});
            const buttons = {
                ".btn": {
                    padding: "0.75rem 0.5rem",
                    minWidth: "4rem",
                    fontWeight: 700,
                    borderWidth: "1px",
                    borderRadius: "0.375rem",
                    transitionProperty: "all",
                    transitionDuration: "150ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    backgroundColor: colors.primary.DEFAULT,
                    borderColor: colors.primary.DEFAULT,
                    color: colors.on.secondary.DEFAULT,
                    "&-sm": {
                        padding: "0.5rem 0.25rem"
                    },
                    "&-lg": {
                        padding: "2rem 0.75rem"
                    },
                    "&-block": {
                        display: "block",
                        width: "100%"
                    },
                    "&:hover": {
                        backgroundColor: colors.primary.dark,
                        borderColor: colors.primary.dark
                        // color: colors.on.primary.high,
                    },
                    "&:disabled": {
                        backgroundColor: colors.on.primary.low,
                        borderColor: colors.on.primary.low,
                        cursor: "not-allowed",
                        "&:hover": {
                            backgroundColor: colors.on.primary.low,
                            borderColor: colors.on.primary.low,
                            cursor: "not-allowed"
                        }
                    },
                    "&-outline": {
                        backgroundColor: "transparent",
                        borderColor: colors.on.primary.DEFAULT,
                        color: colors.on.primary.high,
                        "&:hover": {
                            backgroundColor: colors.on.primary.DEFAULT,
                            borderColor: colors.on.primary.DEFAULT,
                            color: colors.on.secondary.high
                        },
                        "&-primary": {
                            backgroundColor: "transparent",
                            borderColor: colors.primary.DEFAULT,
                            color: colors.primary.DEFAULT,
                            "&:hover": {
                                backgroundColor: colors.primary.DEFAULT,
                                borderColor: colors.primary.DEFAULT,
                                color: colors.on.secondary.high
                            }
                        },
                        ...Object.keys(buttonColors).reduce((acc, cur) => {
                            const color = buttonColors[cur];
                            acc[`&-${cur}`] = {
                                backgroundColor: "transparent",
                                borderColor: color.DEFAULT,
                                color: color.DEFAULT,
                                "&:hover": {
                                    backgroundColor: color.DEFAULT,
                                    borderColor: color.DEFAULT,
                                    color: colors.on.secondary.high
                                }
                            };
                            return acc;
                        }, {})
                    },
                    ...Object.keys(buttonColors).reduce((acc, cur) => {
                        const color = buttonColors[cur];
                        acc[`&-${cur}`] = {
                            backgroundColor: color.DEFAULT,
                            borderColor: color.DEFAULT,
                            "&:hover": {
                                backgroundColor: color.dark,
                                borderColor: color.dark
                            }
                        };
                        return acc;
                    }, {})
                }
            };
            addComponents(buttons);
        }
    ]
};
