const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack')
module.exports = env => {
    return merge(common(env), {

        mode: 'development',

        // Use eval-cheap-source-map for accurate line numbers, eval has best build performance
        devtool: 'eval',

        output: {
            pathinfo: true,
            filename: 'main.js'
        },

        devServer: {
            client: {
                overlay: true,
            },
            open: true,
            hot: false,
            compress: true,
            port: 8070,
        },
        plugins: [
            // Only update what has changed on hot reload
            new webpack.HotModuleReplacementPlugin(),
        ],

    });
};
