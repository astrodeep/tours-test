const paths = require('./paths')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const globImporter = require('node-sass-glob-importer');
const fs = require('fs');
const PAGES_DIR = `${paths.src}/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const svgToMiniDataURI = require("mini-svg-data-uri");

/**
 * Webpack Configuration
 */
module.exports = env => {
    // Is the current build a development build
    const IS_DEV = !!env.dev;

    return {

        entry: [paths.src + '/index.js'],

        resolve: {
            extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
            alias: {
                '@': paths.src

            }
        },


        plugins: [
            new webpack.DefinePlugin({IS_DEV}),

            ...PAGES.map(page => new HtmlWebpackPlugin({
                template: `${PAGES_DIR}/${page}`,
                filename: `./${page.replace(/\.pug/, '.html')}`
            })),

            new CopyPlugin({
                patterns: [
                    {from: './src/images', to: 'images'},

                ],
            })
        ],

        module: {

            rules: [
                // BABEL
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            compact: true
                        }
                    }
                },


                {
                    test: /\.(scss|css)$/,
                    use: [
                        'style-loader',
                        {loader: 'css-loader', options: {sourceMap: IS_DEV, importLoaders: 1}},
                        {loader: 'postcss-loader', options: {sourceMap: true}},
                        {
                            loader: 'sass-loader', options: {
                                sassOptions: {
                                    importer: globImporter(),
                                },
                                sourceMap: true


                            }
                        },
                    ],
                },
                {
                    test: /\.(pug|jade)$/,
                    loader: 'pug-loader',
                    options: {
                        pretty: true,
                        root: paths.src
                    }
                },

                // IMAGES

                {
                    test: /\.(png|jpg|gif|webp)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext]'
                    }

                },
                {
                    test: /\.(woff(2)?|eot|ttf|otf)$/,
                    type: 'asset',
                    generator: {
                        filename: 'fonts/[name][ext]'
                    }

                },
                {
                    test: /\.svg$/,
                    type: "asset",
                    generator: {
                        filename: 'images/[name][ext]',
                        dataUrl: content => {
                            if (typeof content !== "string") {
                                content = content.toString();
                            }

                            return svgToMiniDataURI(content);
                        }
                    }
                }
            ]
        },

        optimization: {
            /*     runtimeChunk: 'single'*/
        }

    };
};
