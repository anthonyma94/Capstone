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
    configureWebpack: {
        devtool: "source-map"
        // module: {
        //     rules: [
        //         {
        //             test: [/\.css$/i, /\.postcss$/i],
        //             use: [
        //                 "css-loader",
        //                 {
        //                     loader: "postcss-loader",
        //                     options: {
        //                         config: { path: "./postcss.config.js" }
        //                     }
        //                 }
        //             ]
        //         }
        //     ]
        // }
    }
};
