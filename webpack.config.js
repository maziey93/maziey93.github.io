const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const cpy = require('cpy');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let jekyllConfigFileContents;

try {
    jekyllConfigFileContents = fs.readFileSync('./_config.yml', 'utf-8');
} catch (e) {
    console.log(e);
    process.exit(1);
}

const { webpack: jekyllWebpackConfig } = yaml.safeLoad(jekyllConfigFileContents);

module.exports = {
    mode: process.env.JEKYLL_ENV  === 'production' ? 'production' : 'development',
    entry: jekyllWebpackConfig.entry.map(entryItem => path.join(__dirname, entryItem)),
    output: {
        filename: '[name]-bundle.[contenthash].js',
        path: path.resolve(__dirname, jekyllWebpackConfig.cache_directory),
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {loader: 'css-loader'},
                    {loader: 'sass-loader'}
                ]
            },{
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                    }
                }]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    // only create vendors for file that is not a stylesheet
                    test: /node_modules\/(?!(.*\.(sa|sc|c)ss$))/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: [
        new ManifestPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new CleanWebpackPlugin(),
        function() {
            // This makes the files webpack generated available to jekyll and our jekyll plugin,
            // so the assets might be copied
            this.plugin('done', async () => {
                await cpy(path.join(jekyllWebpackConfig.cache_directory, 'manifest.json'), path.join('_data') , {
                    rename: () => 'webpack-manifest.json'
                })
            });
        }
    ]
};