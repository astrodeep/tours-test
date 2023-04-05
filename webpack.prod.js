const paths = require('./paths')
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.common');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const globImporter = require('node-sass-glob-importer');
module.exports = env => {
    return merge(common(env), {

        mode: 'production',

        // IMPORTANT: Configure server to disallow access to source maps from public!
        devtool: 'source-map',

        output: {
            path: paths.build,
            filename: 'js/main.js'
        },
        module: {
            rules: [
                {
                    test: /\.((c|sa|sc)ss)$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', {
                        loader: 'sass-loader', options: {
                            sassOptions: {
                                /*importer: globImporter(),*/
                            }, sourceMap: true
                        }
                    },


                    ],
                },

            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            /*       new ImageMinPlugin({ test: /\.(jpg|jpeg|png|gif|svg)$/i }),*/
            new MiniCssExtractPlugin({
                filename: 'css/main.css',
            }),
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                }),
                new CssMinimizerPlugin(),
            ],
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
        },

    });
};
