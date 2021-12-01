const path = require("path");
module.exports = {
    pages: {
        index: {
            entry: "src/index.ts"
        }
    },
    devServer: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                // pathRewrite: { "^/api": "/testing" },
                changeOrigin: true
            }
        }
    },
    outputDir: path.resolve(__dirname, "../../dist/public"),
    configureWebpack: {
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto"
                }
            ]
        }
    }
};
